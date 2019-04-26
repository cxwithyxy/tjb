import { BrowserWindow, WebContents } from 'electron'
import { Inject_js_handler as IJH } from "./inject_js/Inject_js_handler"
import { Config_helper } from "./../Config_helper"
import sleep from "sleep-promise"
import pLimit from 'p-limit'
import _ from "lodash"
import forin_promise from '../base/forin_promise';

export class Worker
{
    win!: BrowserWindow
    wincc!: WebContents
    win_settings: object
    page_load_lock = false
    garbage_collection_marker = false

    static worker_box: Array<Worker> = []
    static worker_garbage_collection_timeout: NodeJS.Timeout
    
    static add_worker(_w: Worker)
    {
        Worker.worker_box.push(_w)
        Worker.start_garbage_collection()
    }

    static get_workers()
    {
        return Worker.worker_box
    }

    static start_garbage_collection()
    {
        if(_.isUndefined(Worker.worker_garbage_collection_timeout))
        {
            Worker.worker_garbage_collection_timeout = setInterval(() =>
            {
                _.remove(Worker.worker_box, (_w: Worker) =>
                {
                    if(_w.garbage_collection_marker)
                    {
                        _w.win.close()
                    }
                    return _w.garbage_collection_marker
                })
            }, 5000)
            return
        }
        
    }

    static async all_worker_do(_func: (_w: Worker) => Promise<any>)
    {
        await forin_promise(
            Worker.worker_box,
            async (_v, _k) =>
            {
                _func(_v)
            }
        )
    }

    constructor (win_settings: {})
    {
        this.win_settings = win_settings;
        this.win_settings = _.merge(this.win_settings, {
            webPreferences: {
                backgroundThrottling: false
            }
        })
        Worker.add_worker(this)
    }

    close()
    {
        this.garbage_collection_marker = true
    }

    open_url (url: string): Worker
    {
        this.wincc.loadURL(url)
        return this;
    }

    show()
    {
        this.win.center()
    }

    is_show()
    {
        return false
    }

    hide()
    {
        this.win.setPosition(-1920, 0)
    }

    page_init (): Worker
    {
        this.win = new BrowserWindow(this.win_settings)
        this.win.setSkipTaskbar(true)
        this.wincc = this.win.webContents
        this.init_page_load_lock()
        this.hide()
        return this
    }

    init_page_load_lock()
    {
        this.wincc.on("did-stop-loading", () =>
        {
            this.page_load_lock = false
        })
    }

    set_ua (ua: string): Worker
    {
        this.wincc.setUserAgent(ua);
        return this;
    }

    open_dev(): Worker
    {
        this.wincc.openDevTools({mode: "undocked"});
        return this;
    }

    async exec_js(js_code: string)
    {
        return await this.wincc.executeJavaScript(
            IJH.getInstance().to_code_string(js_code)
        );
    }

    // 该函数等待废弃
    async shine_focus(_when_shine_do: () => Promise<any>)
    {
        this.wincc.focus()
        await _when_shine_do()
    }

    async mouse_move(_x: Number, _y: Number)
    {
        this.shine_focus(async () =>
        {
            this.wincc.sendInputEvent(<any>{
                type: "mouseMove",
                x: _x,
                y: _y
            })
        });
    }

    async mouse_down(_x: Number, _y: Number)
    {
        this.shine_focus(async () =>
        {
            this.wincc.sendInputEvent(<any>{
                type: "mouseDown",
                button: "left",
                x: _x,
                y: _y,
                clickCount: 1
            })
        });
    }

    async mouse_up(_x: Number, _y: Number)
    {
        this.shine_focus(async () =>
        {
            this.wincc.sendInputEvent(<any>{
                type: "mouseUp",
                button: "left",
                x: _x,
                y: _y,
                clickCount: 1
            })
        });
    }

    async click(_x: Number, _y: Number)
    {
        this.shine_focus(async () =>
        {
            this.wincc.sendInputEvent(<any>{
                type: "mouseDown",
                button: "left",
                x: _x,
                y: _y,
                clickCount: 1
            })
            await sleep(100 + Math.random() * 100)
            this.wincc.sendInputEvent(<any>{
                type: "mouseUp",
                button: "left",
                x: _x,
                y: _y,
                clickCount: 1
            })

        });
    }

    async reload()
    {
        this.wincc.reload()
        await this.wait_page_load()
    }

    async wait_page_load()
    {
        this.page_load_lock = true
        while(this.page_load_lock)
        {
            await sleep(100)
        }
        return this
    }

    async read_cookies(filter = {})
    {
        return new Promise((succ, fail) =>
        {
            this.wincc.session.cookies.get(filter , (e, the_cookie) =>
            {
                if(e)
                {
                    fail(e)
                }
                succ(the_cookie)
            })
        })
        
    }

    async save_all_cookie_in_conf()
    {
        let cookies = await this.read_cookies()
        Config_helper.getInstance().set({cookies: JSON.stringify(cookies)})
    }

    async load_all_cookie_in_conf(url: string)
    {
        let login_cookies:Array<any> = JSON.parse(Config_helper.getInstance().get("cookies"))
        await this.set_cookies(url, login_cookies)
    }

    async set_cookies(url: string, cookies:Array<any> = [])
    {
        let limit:Function = pLimit(cookies.length)
        let queque:Array<any> = [];
        _.forEach(cookies, (v,k) =>
        {
            v.url = url
            queque.push(limit(async () =>
            {
                return new Promise((succ) =>
                {
                    this.wincc.session.cookies.set(
                        v,
                        ()=>
                        {
                            succ()
                        }
                    )
                })
            }))
        })
        await Promise.all(queque)

    }
}
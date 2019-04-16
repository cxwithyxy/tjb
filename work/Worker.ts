import { BrowserWindow, WebContents,Event  } from 'electron'
import { Inject_js_handler as IJH } from "./inject_js/Inject_js_handler"
import { Config_helper } from "./../Config_helper"

export class Worker
{
    win!: BrowserWindow;
    wincc!: WebContents;
    win_settings: {};

    constructor (win_settings: {})
    {
        this.win_settings = win_settings;
    }

    open_url (url: string): Worker
    {
        this.wincc.loadURL(url);
        return this;
    }

    page_init (): Worker
    {
        this.win = new BrowserWindow(this.win_settings);
        this.wincc = this.win.webContents;
        return this;
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

    mouse_move(_x: Number, _y: Number)
    {
        this.wincc.focus();
        this.wincc.sendInputEvent(<any>{
            type: "mouseMove",
            x: _x,
            y: _y
        })
    }

    mouse_down(_x: Number, _y: Number)
    {
        this.wincc.focus();
        this.wincc.sendInputEvent(<any>{
            type: "mouseDown",
            button: "left",
            x: _x,
            y: _y,
            clickCount: 1
        })
    }

    mouse_up(_x: Number, _y: Number)
    {
        this.wincc.focus();
        this.wincc.sendInputEvent(<any>{
            type: "mouseUp",
            button: "left",
            x: _x,
            y: _y,
            clickCount: 1
        })
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

    async set_cookies(cookies = [])
    {
        return new Promise((succ, fail) =>
        {
            this.wincc.session.cookies.set(
                {
                    url: "https://login.m.taobao.com",
                    domain: ".taobao.com",
                    name: "cxcxcxcx",
                    value: "test",
                    expirationDate: new Date().getTime() / 1000 + 3600
                },
                ()=>
                {
                    succ()
                }
            )
        })
    }
}
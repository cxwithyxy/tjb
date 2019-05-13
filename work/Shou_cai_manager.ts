import { Manager } from "./Manager"
import { Worker } from "./Worker";
import sleep from "sleep-promise";
import { UI } from "electron_commandline_UI";


export class Shou_cai_manager extends Manager
{
    constructor(_w?: Worker | Worker[])
    {
        super(_w)
    }
    
    async start()
    {
        await this.load_zhuangyuan()
        await this.do_my_zhuangyuan()
        await this.do_friend_zhuangyuan()
    }

    async do_my_zhuangyuan()
    {
        await this.workers_do(async (_w) =>
        {
            UI.log("开始处理自己的庄园")
            await _w.exec_js(`inject_EventEmitter()`)
            await sleep(1000)
            await _w.exec_js(`harvest()`)
            UI.log("完成收获")
            await sleep(1000)
            await _w.exec_js(`qian_dao()`)
            UI.log("完成签到")
            await sleep(1000)
            UI.log("已经处理完了自己的庄园")
        })
    }

    async do_friend_zhuangyuan()
    {
        UI.log("开始搞好友庄园")
        while(true)
        {
            await this.load_zhuangyuan()
            await this.open_friend_panel()

            let has_job_to_do: boolean | number = false
            await this.workers_do(async (_w) =>
            {
                has_job_to_do = await _w.exec_js(`has_friend_btn()`)
            })
            if(has_job_to_do === false)
            {
                break
            }

            await this.workers_do(async (_w) =>
            {
                await _w.exec_js(`click_friend_btn(${has_job_to_do})`)
                await _w.wait_page_load()
                await sleep(1500)
                await _w.exec_js(`inject_EventEmitter()`)
                await sleep(1000)
                await _w.exec_js(`water_it()`)
                await sleep(300)
                await _w.exec_js(`fertilize_it()`)
                await sleep(1500)
                await _w.exec_js(`steal()`)
                await sleep(1500)
            })
        }
        UI.log("搞完好友庄园了")
    }

    async open_friend_panel()
    {
        await this.workers_do(async (_w) =>
        {
            await _w.exec_js(`touch_emulator_init()`)
            await _w.click(430, 358)
            await sleep(1000)
            await _w.exec_js(`show_all_friend()`)
        })
    }


    async get_friend_zhuangyuan(): Promise<number>
    {
        let friend_count: number = 0
        await this.open_friend_panel()
        await this.workers_do(async (_w) =>
        {
            friend_count = await _w.exec_js(`friend_count()`)
        })
        return friend_count
    }

    async load_zhuangyuan()
    {
        await this.workers_do(async (_w) =>
        {
            _w.open_url(`https://h5.m.taobao.com`)
            await _w.wait_page_load()
            await _w.exec_js(`touch_emulator_init()`)
            await _w.click(235, 312)
            await _w.wait_page_load()
            await sleep(1000)
            
            await _w.exec_js(`window.scrollTo(0, 0)`)
            await sleep(1000)
        })
    }

}
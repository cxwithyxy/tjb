import { Manager } from "./Manager"
import { Worker } from "./Worker";
import sleep from "sleep-promise";


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
        await this.get_friend_zhuangyuan()
    }

    async do_my_zhuangyuan()
    {
        await this.workers_do(async (_w) =>
        {
            await _w.exec_js(`harvest()`)
            await sleep(1000)
            await _w.exec_js(`qian_dao()`)
            await sleep(1000)
        })
    }

    async get_friend_zhuangyuan()
    {
        await this.workers_do(async (_w) =>
        {
            await _w.exec_js(`touch_emulator_init()`)
            await _w.click(430, 358)
            await sleep(1000)
            await _w.exec_js(`show_all_friend()`)
            console.log(`job done`);
            
        })
    }

    async load_zhuangyuan()
    {
        await this.workers_do(async (_w) =>
        {
            _w.open_url(`https://taobao.com`)
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
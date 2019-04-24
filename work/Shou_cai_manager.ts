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
            await _w.exec_js(`harvest()`)
            await sleep(1000)
            await _w.exec_js(`qian_dao()`)
            await sleep(1000)
            UI.log("已经处理完了自己的庄园")
        })
    }

    async do_friend_zhuangyuan()
    {
        UI.log("获取好友庄园数量")
        let friend_count: number = await this.get_friend_zhuangyuan()
        UI.log(`可操作的好友数量: ${friend_count}`)
        this.proliferate_worker_until(friend_count)
        console.log(`all opened`);
        
        await this.load_zhuangyuan()
    }


    async get_friend_zhuangyuan(): Promise<number>
    {
        let friend_count: number = 0
        await this.workers_do(async (_w) =>
        {
            await _w.exec_js(`touch_emulator_init()`)
            await _w.click(430, 358)
            await sleep(1000)
            await _w.exec_js(`show_all_friend()`)
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
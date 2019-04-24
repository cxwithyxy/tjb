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
        for (let i = 0; i < friend_count; i++) {
            await this.load_zhuangyuan()
            await this.open_friend_panel()
            let button_text: string = ""
            await this.workers_do(async (_w) =>
            {
                button_text = await _w.exec_js(`get_friend_btn_content(${i})`)
                UI.log(button_text)
                if(button_text.length == 3)
                {
                    await _w.exec_js(`click_friend_btn(${i})`)
                    await _w.wait_page_load()
                    await _w.exec_js(`water_it()`)
                    await sleep(1500)
                    await _w.exec_js(`steal()`)
                    await sleep(1500)
                }
            })
        }
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
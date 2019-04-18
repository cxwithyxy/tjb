import { Manager } from "./Manager"
import { Worker } from "./Worker";
import sleep from "sleep-promise";
import forin_promise from "./../base/forin_promise";

export class Zuo_renwu_manager extends Manager
{
    constructor(_w?: Worker | Worker[])
    {
        super(_w);
    }

    async start()
    {
        let links: Array<string> = []

        // this.get_main_worker().open_dev()

        await this.workers_do(async (_w) =>
        {
            _w.open_url(`https://m.tb.cn/h.e0ui9mz`)
            await _w.wait_page_load()
            let iframe_src = await _w.exec_js(`get_rewu_inner_inframe_src()`)
            await _w.open_url(iframe_src)
            await _w.wait_page_load()
            links = await _w.exec_js(`get_rewu_links()`)
        })
        console.log(links.length ? `签到店铺 ${links.length} 个` : `店铺都签完了`);
        
        await forin_promise(
            links,
            async (v) =>
            {
                await this.workers_do(async (_w) =>
                {
                    _w.open_url(`https:${v}`)
                    await _w.wait_page_load()
                    console.log(v)
                    await sleep(11 * 1000)
                })
            }
        )
        console.log("店铺已签完了")
        
    }
    
}
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
        await this.shop_qian_dao()
        console.log("all shop qian dao finish")
        await this.cheng_jiu_ling_qu()
        console.log("all chengjiu finish");
        
    }
    
    async shop_qian_dao()
    {
        let links: Array<string> = []
        
        await this.workers_do(async (_w) =>
        {
            _w.open_url(`https://m.tb.cn/h.e0ui9mz`)
            await _w.wait_page_load()
            let iframe_src = await _w.exec_js(`get_rewu_inner_inframe_src()`)
            await _w.open_url(iframe_src)
            await _w.wait_page_load()
            links = await _w.exec_js(`get_rewu_links()`)
        })
        console.log(links.length ? `shop ${links.length} ` : `no shop need qian dao`);
        
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
    }

    async cheng_jiu_ling_qu()
    {
        await this.workers_do(async (_w) =>
        {
            _w.open_url(`https://market.m.taobao.com/apps/market/tjb/achievement.html`)
            await _w.wait_page_load()
            let chengjiu_link = await _w.exec_js(`get_chengjiu_link()`)
            console.log(chengjiu_link)
            if(chengjiu_link)
            {
                _w.open_url(`https:${chengjiu_link}`)
                await sleep(11 * 1000)
                await this.cheng_jiu_ling_qu()
            }
        })
    }
}
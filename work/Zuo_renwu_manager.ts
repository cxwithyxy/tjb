import { Manager } from "./Manager"
import { Worker } from "./Worker";
import sleep from "sleep-promise";
import forin_promise from "./../base/forin_promise";
import { UI } from "electron_commandline_UI";

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
        UI.log(`已经自动浏览完所有的店铺了`)
        await this.cheng_jiu_ling_qu()
        console.log("all chengjiu finish");
        UI.log(`已经领取完所有的成就了`)
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
        UI.log(links.length ? `店铺 ${links.length} 个` : `所有店铺都已经被领取过了`);
        
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
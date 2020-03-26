import { Worker } from "ElectronPageTentacle";
import sleep from "sleep-promise";
import forin_promise from "forin_promise";
import { UI } from "electron_commandline_UI";
import { Shou_cai_manager } from "./Shou_cai_manager";

export class Zuo_renwu_manager extends Shou_cai_manager
{
    constructor(_w?: Worker | Worker[])
    {
        super(_w);
    }

    async start()
    {
        await this.zhuangyuan_qian_dao()
        await this.shop_qian_dao()
        console.log("all shop qian dao finish")
        UI.log(`已经自动浏览完所有的店铺了`)
        await this.cheng_jiu_ling_qu()
        console.log("all chengjiu finish");
        UI.log(`已经领取完所有的成就了`)
    }
    
    async zhuangyuan_qian_dao()
    {
        await this.load_zhuangyuan()
        await sleep(2e3)
        await this.workers_do(async (_w) =>
        {
            await _w.tap(341, 40)
            await sleep(2e3)
            await _w.tap(236, 580)
            await sleep(2e3)
        })
    }
    
    /**
     * 进入成就页面
     *
     * @memberof Zuo_renwu_manager
     */
    async load_mission_page()
    {
        await this.workers_do(async (_w) =>
        {
            await _w.exec_js(`touch_emulator_init()`)
            await _w.click(48, 463)
            await sleep(1000)
        })
    }

    /**
     * 自动操作进行店铺签到
     *
     * @memberof Zuo_renwu_manager
     */
    async shop_qian_dao()
    {
        let links: Array<string> = []
        while(true)
        {
            await this.load_zhuangyuan()
            await this.load_mission_page()
            await this.workers_do(async (_w) =>
            {
                _w.screen_touch_emulation()
                links = await _w.exec_js(`get_rewu_button_array()`)
            })
            UI.log(links.length ? `店铺 ${links.length} 个` : `所有店铺都已经被领取过了`);
            if(!links.length)
            {
                break
            }
            await this.workers_do(async (_w) =>
            {
                await _w.exec_js("reset_windows_open_in_this()")
                await _w.exec_js(`click_rewu_button(${links.pop()})`)
                await sleep(10e3)
            })
            
        }
    }

    /**
     * 自动操作进行成就自动领取
     *
     * @memberof Zuo_renwu_manager
     */
    async cheng_jiu_ling_qu()
    {
        await this.workers_do(async (_w) =>
        {
            _w.open_url(`https://market.m.taobao.com/apps/market/tjb/achievement.html`)
            await _w.wait_page_load(3 * 60e3)
            _w.give_me_a_life(3 * 60)
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
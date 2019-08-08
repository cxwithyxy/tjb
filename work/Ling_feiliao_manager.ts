import { Worker } from "ElectronPageTentacle";
import sleep from "sleep-promise";
import { Shou_cai_manager } from "./Shou_cai_manager";
import { UI } from "electron_commandline_UI";

export class Ling_feiliao_manager extends Shou_cai_manager
{
    async start()
    {
        await this.loop_ling_feiliao()
    }

    
    async load_good_zhuangyuan()
    {
        await this.load_zhuangyuan()
        await this.workers_do(async (_w: Worker) =>
        {
            await _w.exec_js(`view_goods()`)
            await sleep(1000)
        })
    }

    async open_ling_feiliao_panel()
    {
        await this.workers_do(async(_w: Worker) =>
        {
            await _w.tap(419, 452)
            await sleep(1000)
        })
    }

    async loop_ling_feiliao()
    {
        let can_ling_feiliao = false
        while(true)
        {
            await this.load_good_zhuangyuan()
            await this.open_ling_feiliao_panel()
            await this.workers_do(async(_w: Worker) =>
            {
                can_ling_feiliao = await _w.exec_js("can_ling_feiliao()")
            })
            if(!can_ling_feiliao)
            {
                break
            }
            await this.workers_do(async(_w: Worker) =>
            {
                await _w.exec_js("ling_feiliao()")
                await _w.give_me_a_life(60e3)
            })
            await sleep(50e3)
            UI.log("做了一次任务领了一次肥料")
        }
    }

}
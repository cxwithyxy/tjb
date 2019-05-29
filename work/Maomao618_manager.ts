import sleep from "sleep-promise"
import { UI } from "electron_commandline_UI"
import { Shou_cai_manager } from "./Shou_cai_manager";

export class Maomao618_manager extends Shou_cai_manager
{
    async start()
    {
        await this.load_maomao()
    }
    
    /**
     * 进入猫猫界面
     *
     * @memberof Maomao618_manager
     */
    async load_maomao()
    {
        await this.load_zhuangyuan()
        await this.workers_do(async (_w) =>
        {
            await _w.exec_js(`view_goods()`)
            await sleep(2000)
            await _w.click(409, 172)
            await sleep(5000)
        })
    }
}
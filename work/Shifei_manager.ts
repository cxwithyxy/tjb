import { Manager } from "./Manager"
import { Worker } from "./Worker";
import sleep from "sleep-promise";
import { UI } from "electron_commandline_UI";
import { Shou_cai_manager } from "./Shou_cai_manager";

export class Shifei_manager extends Shou_cai_manager
{
    async start()
    {
        await this.do_friend_zhuangyuan()
    }

    
    async load_zhuangyuan()
    {
        await super.load_zhuangyuan()
        await this.workers_do(async (_w: Worker) =>
        {
            await _w.exec_js(`view_goods()`)
            await sleep(1000)
        })
    }
}
import { Manager } from "./Manager"
import { Worker } from "./Worker";
import sleep from "sleep-promise";
import { UI } from "electron_commandline_UI";
import { Shou_cai_manager } from "./Shou_cai_manager";

export class Shifei_manager extends Shou_cai_manager
{
    async start()
    {
        await this.load_zhuangyuan()
        // 119 312
    }
}
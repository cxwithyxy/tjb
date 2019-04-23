import { Manager } from "./Manager"
import { Worker } from "./Worker";
import sleep from "sleep-promise";


export class Shou_cai_manager extends Manager
{
    constructor(_w?: Worker | Worker[])
    {
        super(_w)
    }
    
    async start()
    {
        await this.workers_do(async (_w) =>
        {
            _w.open_url(`https://taobao.com`)
            await _w.wait_page_load()
            await _w.exec_js(`touch_emulator_init()`)
            await _w.mouse_down(235, 312)
            await _w.mouse_up(235, 312)
        })
    }

}
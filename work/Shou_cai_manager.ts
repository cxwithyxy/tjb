import { Manager } from "./Manager"
import { Worker } from "./Worker";
import sleep from "sleep-promise";
import forin_promise from "./../base/forin_promise";
import { UI } from "electron_commandline_UI";


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
        })
    }

}
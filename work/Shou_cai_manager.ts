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
        this.set_main_worker(new Worker({ 
            width: 480,
            height: 800,
            webPreferences: {
                partition: "persist:tjb",
                webSecurity: false
            },
        }))
        .get_main_worker()
        .page_init()
        .set_ua("Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1")

        await this.workers_do(async (_w) =>
        {
            _w.open_url(`https://taobao.com`)
            await _w.wait_page_load()
        })
    }

}
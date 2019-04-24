import { Manager } from "./Manager"
import { Worker } from "./Worker";
import sleep from "sleep-promise";

export class Qiang_jb_manager extends Manager
{
    constructor(_w?: Worker | Worker[])
    {
        super(_w);
    }

    async start()
    {
        let count = 0
        this.proliferate_worker(5)
        while(true)
        {
            await this.qiang_hongbao()
            count ++
            console.log(`${count}`)
            
        }
        
    }
    async qiang_hongbao()
    {
        await this.workers_do(async (_w) =>
        {
            // let _w = this.get_main_worker()
            await _w.reload()
            await _w.exec_js(`fuli_only_show_jb()`)
            await _w.exec_js(`is_login()`)
            await _w.exec_js(`click_qiang_btn()`)
            await sleep(300)
            await _w.exec_js(`click_zhifu_btn()`)
            await sleep(300)
            
        })
    }
}
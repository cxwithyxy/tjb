import { Worker, Manager } from "ElectronPageTentacle";
import sleep from "sleep-promise";
 
export class Shou_zhangyu extends Manager
{
    async start()
    {
        this.workers_do(async(_w: Worker) =>
        {
            _w.open_url("https://pages.tmall.com/wow/hdwk/act/raise-octopus")
            await _w.wait_page_load(3 * 60e3)
        })
    }
     
}
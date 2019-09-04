import { Worker, Manager } from "ElectronPageTentacle";
import sleep from "sleep-promise";
 
export class Shou_zhangyu extends Manager
{
    async start()
    {
        await this.workers_do(async(_w: Worker) =>
        {
            _w.open_url("https://pages.tmall.com/wow/hdwk/act/raise-octopus")
            await _w.wait_page_load(3 * 60e3)
            await sleep(2000)
            await _w.click(231, 508)
            await sleep(2000)
            await _w.tap(186, 704)
            await sleep(2000)
        })
    }
     
}
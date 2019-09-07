import { Worker, Manager } from "ElectronPageTentacle";
import sleep from "sleep-promise";
 
export class Shou_zhangyu extends Manager
{
    async shou_xingxing()
    {
        await this.go_to_zhangyu_page()
        await this.workers_do(async(_w: Worker) =>
        {
            await sleep(2000)
            await _w.click(231, 508)
            await sleep(2000)
            await _w.tap(186, 704)
            await sleep(2000)
        })
    }

    async go_to_zhangyu_page()
    {
        await this.workers_do(async (_w: Worker) =>
        {
            _w.open_url("https://pages.tmall.com/wow/hdwk/act/raise-octopus")
            await _w.wait_page_load(3 * 60e3)
        })
    }
    async shou_shop()
    {
        await this.go_to_zhangyu_page()
        await this.workers_do(async (_w: Worker) =>
        {
            await _w.exec_js(`window.scrollTo(0, 50)`)
            await _w.tap(411, 709)
        })
        await sleep(5 * 60e3)
    }
}
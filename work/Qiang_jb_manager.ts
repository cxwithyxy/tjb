import { Manager } from "./Manager"
import { Worker } from "./Worker";
import sleep from "sleep-promise";

export class Qiang_jb_manager extends Manager
{

    is_stop = false

    async start()
    {
        let count = 0
        this.proliferate_worker(2)
        this.is_stop = false
        while(!this.is_stop)
        {
            await this.qiang_hongbao()
            count ++
            console.log(`${count}`)
        }
    }

    async stop()
    {
        this.is_stop = true
    }

    async qiang_hongbao()
    {
        await this.workers_do(async (_w) =>
        {
            // let _w = this.get_main_worker()
            _w.set_ua("Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1")
            await _w.reload()
            await _w.exec_js(`fuli_only_show_jb()`)
            await _w.exec_js(`is_login()`)
            _w.set_ua("Mozilla/5.0 (Linux; U; Android 8.0.0; zh-CN; Mi Note 2 Build/OPR1.170623.032) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/69.0.3497.100 UWS/3.17.0.17 Mobile Safari/537.36 AliApp(TB/8.6.0) UCBS/2.11.1.1 TTID/600000@taobao_android_8.6.0 WindVane/8.5.0 1080X1820")
            let has_hongbao_btn = await _w.exec_js(`click_qiang_btn()`)
            await sleep(300)
            await _w.exec_js(`click_zhifu_btn()`)
            await sleep(300)
            // if(has_hongbao_btn)
            // {
            //     await sleep(3600 * 1000)
            //     return
            // }
        })
    }
}
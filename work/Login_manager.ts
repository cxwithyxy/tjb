import { Worker } from "./Worker"
import { Manager } from "./Manager"
import { Inject_js_handler } from "./inject_js/Inject_js_handler"
import { Config_helper } from "./../Config_helper"
import sleep from "sleep-promise"
import pLimit from 'p-limit'
import * as _ from "lodash"

export class Login_manager extends Manager
{
    
    constructor(_w: Worker | undefined)
    {
        super(_w)
    }

    init_work()
    {
        if(_.isUndefined(this.main_worker)){
            this.set_main_worker(new Worker({ 
                width: 480,
                height: 800,
                resizable: false,
                webPreferences: {
                    nodeIntegration: false,
                    nodeIntegrationInWorker: false,
                    contextIsolation: true,
                    partition: "persist:tjb"
                },
            }))
            .get_main_worker()
            .page_init()
            .open_dev()
            .set_ua("Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1")
        }
        return this.get_main_worker()
    }

    async login_opera()
    {
        let limit = pLimit(1)
        let queque_list: any[] = []
        let while_seed = Math.random() * 15  + 5
        while(while_seed > 0){
            while_seed --
            queque_list.push(limit(async () =>
            {
                this.get_main_worker().mouse_move(220 + Math.random() * 10, 420 + Math.random() * 20);
                await sleep(Math.random() * 1000 * 0.04 + 0.01);
            }))
        }
        await Promise.all(queque_list)
         
        this.get_main_worker().mouse_down(242, 433)
        this.get_main_worker().mouse_up(242, 435)
        
        await sleep(1000)
    }

    async start() {
        let ijh = new Inject_js_handler()
        this.init_work()
        // .open_url("https://echo.opera.com")
        this.get_main_worker().open_url("https://market.m.taobao.com/apps/market/tjb/core-member2.html")

        await this.get_main_worker().exec_js(ijh.to_code_string(
            `login_input_set(
                "${Config_helper.getInstance().get("username")}",
                "${Config_helper.getInstance().get("password")}"
            )`
        ));

        // this.login_opera()
        

    }
}

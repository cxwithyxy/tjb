const { Worker } = require("./Worker")
const { Manager } = require("./Manager")
const { Inject_js_handler } = require("./inject_js/Inject_js_handler")
const { Config_helper } = require("./../Config_helper")
const sleep = require("sleep-promise")
const pLimit = require('p-limit')

export class Login_manager extends Manager
{
    constructor()
    {
        super();
    }

    public async start() {
        let ijh = new Inject_js_handler();
        let work_1 = new Worker({ 
            width: 480,
            height: 800,
            resizable: false,
            webPreferences: {
                nodeIntegration: false,
                nodeIntegrationInWorker: false,
                contextIsolation: true
            }
        });

        work_1
        .page_init()
        .open_dev()
        .set_ua("Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1")
        // .open_url("https://echo.opera.com")
        .open_url("https://market.m.taobao.com/apps/market/tjb/core-member2.html");

        await work_1.exec_js(ijh.to_code_string(
            `login_input_set(
                "${Config_helper.getInstance().get("username")}",
                "${Config_helper.getInstance().get("password")}"
            )`
        ));

        let limit = pLimit(1);
        let queque_list: any[] = [];
        let while_seed = Math.random() * 15  + 5;
        while(while_seed > 0){
            while_seed --;
            queque_list.push(limit(async () =>
            {
                work_1.mouse_move(220 + Math.random() * 10, 420 + Math.random() * 20);
                await sleep(Math.random() * 1000 * 0.04 + 0.01);
            }));
        }
        await Promise.all(queque_list);
        
        work_1.mouse_down(242, 433);
        work_1.mouse_up(242, 435);

    }
}

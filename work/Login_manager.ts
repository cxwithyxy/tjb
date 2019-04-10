const { Worker } = require("./Worker")
const { Manager } = require("./Manager")
const { Inject_js_handler } = require("./inject_js/Inject_js_handler")

export class Login_manager extends Manager
{
    constructor()
    {
        super();
    }

    public start() {
        
        // let work_1 = new Worker({ 
        //     width: 480,
        //     height: 800,
        //     resizable: false,
        //     webPreferences: {
        //         nodeIntegration: false,
        //         nodeIntegrationInWorker: false,
        //         contextIsolation: true
        //     }
        // });

        // work_1
        // .page_init()
        // .open_dev()
        // .set_ua("Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1")
        // // .open_url("https://echo.opera.com")
        // .open_url("https://market.m.taobao.com/apps/market/tjb/core-member2.html");

        // work_1.exec_js("console.log(1)")
        // work_1.exec_js("console.log(2)")

        eval(new Inject_js_handler().to_code_string());
        eval("get_username_input()");
    }
}

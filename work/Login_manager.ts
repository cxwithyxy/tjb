import { Worker } from "./../ElectronPageTentacle/Worker"
import { Manager } from "./../ElectronPageTentacle/Manager"
import { Config_helper } from "./../Config_helper"
import sleep from "sleep-promise"
import * as _ from "lodash"
import { ipcMain } from "electron";
import { UI } from "electron_commandline_UI";
import pLimit from "p-limit";

export class Login_manager extends Manager
{
    
    constructor(_w?: Worker | Worker[])
    {
        super(_w)
    }

    init_work()
    {
        try{
            this.get_main_worker()
        }
        catch(e)
        {
            let preload_js_path = `${__dirname}/../PRELOAD/common_preload.js`
            this.set_main_worker(new Worker({ 
                width: 480,
                height: 800,
                webPreferences: {
                    sandbox: true,
                    preload: preload_js_path,
                    partition: "persist:tjb",
                    webSecurity: false
                },
            }))
            .get_main_worker()
            .page_init()
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
         
        this.get_main_worker().click(242, 435)
        
        await sleep(1000)
    }

    async start() {
        this.init_work()
        
        try
        {
            await this.get_main_worker().load_all_cookie_in_conf(`https://market.m.taobao.com`)
        }catch(e){}
        this.get_main_worker().open_url(`https://market.m.taobao.com/apps/market/tjb/core-member2.html`)
        await sleep(2000)
        await this.login_handle()
        await this.get_main_worker().save_all_cookie_in_conf()
        UI.log(`登陆成功`)
    }

    async login_handle()
    {
        await this.get_main_worker().reload()
        let login_state = await this.get_main_worker().exec_js(`is_login()`)
        if(!login_state)
        {
            this.get_main_worker().show()
            try
            {
                await this.type_username_and_password()
            }
            catch(e){
                UI.log(String(e))
            }
            await this.login_opera()
            login_state = await this.get_main_worker().exec_js(`is_login()`)
            if(!login_state)
            {
                await this.manual_login()
            }
        }
        this.get_main_worker().hide()
    }

    async type_username_and_password()
    {
        await this.get_main_worker()
        .exec_js(
            `login_input_set(
                "${Config_helper.getInstance().get("username")}",
                "${Config_helper.getInstance().get("password")}"
            )`
        )
    }

    async manual_login()
    {
        await this.get_main_worker().exec_js(`login_click_event()`)
        return new Promise((succ, fail) =>
        {
            ipcMain.once("login_btn_click", async (e:Event, _u: string, _p: string) =>
            {
                await this.get_main_worker().wait_page_load()
                let login_state = await this.get_main_worker().exec_js(`is_login()`)
                if(!login_state)
                {
                    await this.manual_login()
                }
                Config_helper.getInstance().set({
                    "username": _u,
                    "password": _p
                })
                succ()
            })
        })
    }
}

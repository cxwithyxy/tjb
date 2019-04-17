import { Worker } from "./Worker"
import { Manager } from "./Manager"
import { Config_helper } from "./../Config_helper"
import sleep from "sleep-promise"
import pLimit from 'p-limit'
import * as _ from "lodash"
import { ipcMain } from "electron";

export class Login_manager extends Manager
{
    
    constructor(_w?: Worker | Worker[])
    {
        super(_w)
    }

    init_work()
    {
        if(_.isUndefined(this.main_worker)){
            let preload_js_path = `${__dirname}/../PRELOAD/common_preload.js`
            
            this.set_main_worker(new Worker({ 
                width: 480,
                height: 800,
                resizable: false,
                webPreferences: {
                    sandbox: true,
                    preload: preload_js_path,
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

    }

    async login_handle()
    {
        await this.get_main_worker().reload()
        let login_state = await this.get_main_worker().exec_js(`is_login()`)
        if(!login_state)
        {
            try
            {
                await this.type_username_and_password()
            }
            catch(e){}
            await this.manual_login()
        }
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
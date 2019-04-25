import { Login_manager } from "./work/Login_manager"
import { Zuo_renwu_manager } from "./work/Zuo_renwu_manager"
import { UI, Handler } from "electron_commandline_UI";
import fs from "fs";
import { Shou_cai_manager } from "./work/Shou_cai_manager";
import { BrowserWindow, app } from "electron";
import { scheduleJob, Job } from "node-schedule";
import _ from "lodash";

interface running_job
{
    zuo_renwu?: Job
    shoucai?: Job
}

export class Main_display
{
    my_ui:UI
    jobs: running_job
    constructor()
    {
        this.my_ui = new UI()
        this.jobs = {} as running_job
    }

    async display()
    {
        let my_ui:UI = this.my_ui
        let menu_text = await fs.readFileSync(`${__dirname}/menu.txt`, {encoding: "utf8"})

        await my_ui.init_win({
            cmd_title: `自动化淘金币`
            ,cmd_text: menu_text
        })

        
        my_ui.on_msg((msg:any, handler?: Handler) =>
        {
            this.menu_handle(msg)
        })

        ;(<BrowserWindow>my_ui.UI_win).on("close", () =>
        {
            app.quit()
        })
    }

    async menu_handle(msg: string)
    {
        if(msg == `1`)
        {
            if(_.isUndefined(this.jobs.zuo_renwu))
            {
                this.jobs.zuo_renwu = scheduleJob(`0 0 */1 * * *`, () =>
                {
                    this.menu_zuo_renwu()
                })
            }
            else
            {
                this.my_ui.send(`已经有金币任务在队列中了`)
            }
        }
        if(msg == `2`)
        {
            
            if(_.isUndefined(this.jobs.shoucai))
            {
                this.menu_shoucai()
                this.jobs.shoucai = scheduleJob(`0 */5 * * * *`, () =>
                {
                    this.my_ui.send(`收菜任务启动`)
                    this.menu_shoucai()
                })
            }
            else
            {
                this.my_ui.send(`已经有收菜任务在队列中了`)
            }
        }
    }

    async menu_shoucai()
    {
        this.my_ui.send(`收菜开始`)
        let M_login = new Login_manager()
          
        await M_login.start()

        let M_shou_cai = new Shou_cai_manager()
        M_login.deliver_workers_to(M_shou_cai);
        await M_shou_cai.start()
        this.my_ui.send(`收菜结束`)
    }

    async menu_zuo_renwu()
    {
        this.my_ui.send(`金币任务开始`)

        let M_login = new Login_manager()
         
        await M_login.start()
         
        let M_zuo_renwu = new Zuo_renwu_manager()
        M_login.deliver_workers_to(M_zuo_renwu);
        await M_zuo_renwu.start()
        
        this.my_ui.send(`金币任务结束`)
    }
}
import { Login_manager } from "./work/Login_manager"
import { Zuo_renwu_manager } from "./work/Zuo_renwu_manager"
import { UI, Handler } from "electron_commandline_UI";
import fs from "fs";
import { Shou_cai_manager } from "./work/Shou_cai_manager";
import { BrowserWindow, app } from "electron";
import _ from "lodash";
import { Main_job_manager } from "./Main_job_manager";
import { Worker } from "./work/Worker";

interface job_config
{
    schedule: string
    callback_func: Function
}

interface job_config_box
{
    [x: string]: job_config
}

export class Main_display
{
    my_ui: UI
    M_job: Main_job_manager
    C_job: job_config_box

    constructor()
    {
        this.my_ui = new UI()
        this.M_job = new Main_job_manager()
        this.C_job = {
            "1": {
                schedule: `0 0 */1 * * *`,
                callback_func: this.menu_zuo_renwu
            },
            "2": {
                schedule: `0 */5 * * * *`,
                callback_func: this.menu_shoucai
            },
            "show": {
                schedule:'',
                callback_func: this.command_show_worker
            }
        }
    }

    async command_show_worker()
    {
        await Worker.all_worker_do(async (_w: Worker) =>
        {
            _w.win.show()
        })
        this.my_ui.send(`显示所有窗口`)
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
        if(!_.isUndefined(this.C_job[msg]) && this.C_job[msg].schedule.length > 0)
        {
            try
            {
                this.M_job.create_job(
                    msg,
                    this.C_job[msg].schedule,
                    () =>
                    {
                        this.C_job[msg].callback_func.call(this)
                    }
                )
                this.C_job[msg].callback_func.call(this)
            }
            catch(e)
            {
                this.my_ui.send(`已创建了任务了`)
            }
            return
        }
        if(!_.isUndefined(this.C_job[msg]) && this.C_job[msg].schedule.length == 0)
        {
            this.C_job[msg].callback_func.call(this)
            return
        }
        this.my_ui.send(`没有找到该命令`)
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
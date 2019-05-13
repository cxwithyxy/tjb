import { Login_manager } from "./work/Login_manager"
import { Zuo_renwu_manager } from "./work/Zuo_renwu_manager"
import { UI, Handler } from "electron_commandline_UI";
import fs from "fs";
import { Shou_cai_manager } from "./work/Shou_cai_manager";
import { BrowserWindow, app } from "electron";
import _ from "lodash";
import { Main_job_manager } from "./Main_job_manager";
import { Worker } from "./work/Worker";
import { Shifei_manager } from "./work/Shifei_manager";
import { Qiang_jb_manager } from "./work/Qiang_jb_manager";

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
            "3": {
                schedule: `0 */46 * * * *`,
                callback_func: this.menu_shifei
            },
            "4": {
                schedule: `50 59 9 * * *`,
                callback_func: this.menu_qiang_jb
            },
            "5": {
                schedule: `50 59 15 * * *`,
                callback_func: this.menu_qiang_jb
            },
            "6": {
                schedule: `50 59 1 * * *`,
                callback_func: this.menu_qiang_jb
            },
            "show": {
                schedule:'',
                callback_func: this.command_show_worker
            }
        }
    }

    async menu_qiang_jb()
    {
        this.my_ui.send(`抢红包开始`)
        let M_login = new Login_manager()
    
        await M_login.start();
        
        let M_main = new Qiang_jb_manager();
        M_login.deliver_workers_to(M_main);
        await M_main.start()
        this.my_ui.send(`抢红包结束`)
        await M_main.close_workers()
    }

    async menu_shifei()
    {
        this.my_ui.send(`施肥开始`)
        let M_login = new Login_manager()
           
        await M_login.start()
        
        let M_main = new Shifei_manager()
        M_login.deliver_workers_to(M_main);
        await M_main.start()
        this.my_ui.send(`施肥结束`)
        await M_main.close_workers()
    }

    async command_show_worker()
    {
        await Worker.all_worker_do(async (_w: Worker) =>
        {
            _w.show()
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
                // this.C_job[msg].callback_func.call(this)
                this.my_ui.send(`创建了任务`)
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
        await M_shou_cai.close_workers()
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
        await M_zuo_renwu.close_workers()
    }
}
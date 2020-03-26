import { Login_manager } from "./work/Login_manager"
import { Zuo_renwu_manager } from "./work/Zuo_renwu_manager"
import { UI, Handler } from "electron_commandline_UI";
import fs from "fs";
import { Shou_cai_manager } from "./work/Shou_cai_manager";
import { BrowserWindow, app } from "electron";
import _ from "lodash";
import { Main_job_manager } from "./Main_job_manager";
import { Worker } from "ElectronPageTentacle";
import { Shifei_manager } from "./work/Shifei_manager";
import { Qiang_jb_manager } from "./work/Qiang_jb_manager";
import { Maomao618_manager } from "./work/Maomao618_manager";
import { Ling_feiliao_manager } from "./work/Ling_feiliao_manager";
import { Shou_zhangyu } from "./work/Shou_zhangyu";
import { Config_helper } from "./Config_helper";
import sleep from "sleep-promise"
import path from "path"
import { Path_helper } from "./Path_helper";
import read_pkg_up from 'read-pkg-up'

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
    cls_time = 3600e3

    constructor()
    {
        this.my_ui = new UI()
        this.M_job = new Main_job_manager()
        this.C_job = {
            "0": {
                schedule: ``,
                callback_func: this.pre_login
            },
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
                schedule: `0 32 */3 * * *`,
                callback_func: this.menu_ling_feiliao
            },
            // "5": {
            //     schedule: `0 6 */1 * * *`,
            //     callback_func: this.menu_shou_zhangyu
            // },
            // "4": {
            //     schedule: `50 59 9 * * *`,
            //     callback_func: this.menu_qiang_jb
            // },
            // "5": {
            //     schedule: `50 59 15 * * *`,
            //     callback_func: this.menu_qiang_jb
            // },
            // "6": {
            //     schedule: `50 59 1 * * *`,
            //     callback_func: this.menu_qiang_jb
            // },
            // "7": {
            //     schedule:``,
            //     callback_func: this.menu_maomao618
            // },
            "show": {
                schedule:'',
                callback_func: this.command_show_worker
            },
            "cls": {
                schedule:'',
                callback_func: this.cls
            }
        }
        this.auto_cls()
    }

    auto_cls()
    {
        new Promise(async() =>
        {
            while(true)
            {
                await sleep(this.cls_time)
                this.cls()
            }
        })
    }

    cls()
    {
        this.my_ui.cls()
    }

    check_config_file()
    {
        if(!Config_helper.getInstance().has_config_file())
        {
            this.my_ui.send(`没有预设账号密码！请输入功能数字 0 进行登录\n`)
        }
    }

    async menu_shou_zhangyu()
    {
        this.my_ui.send(`收章鱼星星`)
        let M_login = new Login_manager()
         
        await M_login.start();
          
        let M_main = new Shou_zhangyu();
        M_login.deliver_workers_to(M_main);
        await M_main.start()
        this.my_ui.send(`收章鱼星星结束`)
        await M_main.close_workers()
    }

    async menu_ling_feiliao()
    {
        this.my_ui.send(`领肥料开始`)
        let M_login = new Login_manager()
        
        await M_login.start();
         
        let M_main = new Ling_feiliao_manager();
        M_login.deliver_workers_to(M_main);
        await M_main.start()
        this.my_ui.send(`领肥料结束`)
        await M_main.close_workers()
    }

    async pre_login()
    {
        let M_login = new Login_manager()
        await M_login.start()
        await M_login.close_workers()
        this.my_ui.send(`已经记录完账号密码了！`)
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

    /**
     * 初始化显示
     *
     * @memberof Main_display
     */
    async display()
    {
        let my_ui:UI = this.my_ui
        let menu_text = await fs.readFileSync(`${__dirname}/menu.txt`, {encoding: "utf8"})

        let tjb_version = (await read_pkg_up())?.packageJson.version
        

        await my_ui.init_win({
            cmd_title: `自动化淘金币`
            ,cmd_text: `===== 自动淘金币 v${tjb_version?.substring(0,tjb_version.length - 2)} =====\n${menu_text}`
        })

        
        my_ui.on_msg((msg:any, handler?: Handler) =>
        {
            this.menu_handle(msg)
        })

        ;(<BrowserWindow>my_ui.UI_win).on("close", () =>
        {
            app.quit()
        })

        this.check_config_file()
        my_ui.enable_save_log_file(path.join(Path_helper.get_app_path(), "ui_log.txt"))

        if(process.argv.length > 1)
        {
            let argu_list = _.drop(process.argv, 1)
            this.my_ui.send("检测到命令行参数，开始激活参数")
            argu_list.forEach( async (ele:string) =>
            {
                await this.menu_handle(ele)
            })
        }
    }

    /**
     * 命令行处理
     *
     * @param {string} msg 命令内容
     * @memberof Main_display
     */
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
                this.my_ui.send(`创建了任务 ${msg}`)
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
        this.my_ui.send(`没有找到该命令: "${msg}"`)
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

    async menu_maomao618()
    {
        this.my_ui.send(`店铺猫币开始`)
        let M_login = new Login_manager()
    
        await M_login.start();
        
        let M_main = new Maomao618_manager();
        M_login.deliver_workers_to(M_main);
        await M_main.start()
        this.my_ui.send(`店铺猫币结束`)
        await M_main.close_workers()
    }
}
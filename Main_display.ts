import { Login_manager } from "./work/Login_manager"
import { Zuo_renwu_manager } from "./work/Zuo_renwu_manager"
import { UI, Handler } from "electron_commandline_UI";
import fs from "fs";
import { Shou_cai_manager } from "./work/Shou_cai_manager";

export class Main_display
{
    my_ui:UI

    constructor()
    {
        this.my_ui = new UI()
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
        this.menu_shoucai()
    }

    async menu_handle(msg: string)
    {
        if(msg == `1`)
        {
            this.my_ui.send(`金币任务开始`)
            this.menu_zuo_renwu()
        }
        if(msg == `2`)
        {
            this.my_ui.send(`收菜开始`)
            this.menu_shoucai()
        }
    }

    async menu_shoucai()
    {
        let M_login = new Login_manager()
          
        await M_login.start()

        let M_shou_cai = new Shou_cai_manager()
        M_login.deliver_workers_to(M_shou_cai);
        await M_shou_cai.start()
    }

    async menu_zuo_renwu()
    {
        let M_login = new Login_manager()
         
        await M_login.start()
         
        let M_zuo_renwu = new Zuo_renwu_manager()
        // M_login.deliver_workers_to(M_zuo_renwu);
        await M_zuo_renwu.start()
        
        this.my_ui.send(`金币任务结束`)
    }
}
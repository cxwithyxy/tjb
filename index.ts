import { app } from 'electron'
import { Login_manager } from "./work/Login_manager"
import { Zuo_renwu_manager } from "./work/Zuo_renwu_manager"
import { UI, Handler } from "./electron_commandline_UI/commandline";

app.setPath("userData", app.getPath("temp") + "/tjb");
app.on('ready', async () =>
{
    // let M_login = new Login_manager()
    
    // await M_login.start()
    
    // let M_zuo_renwu = new Zuo_renwu_manager()
    // M_login.deliver_workers_to(M_zuo_renwu);
    // await M_zuo_renwu.start()

    let my_ui = new UI()

    await my_ui.init_win(`初始化成功`)
    my_ui.on_msg((msg:any, handler?: Handler) =>
    {
        console.log(msg);
        (<Handler>handler).send(`asdadasd`);
    })
});


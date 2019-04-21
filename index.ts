import { app } from 'electron'
import { Login_manager } from "./work/Login_manager"
import { Zuo_renwu_manager } from "./work/Zuo_renwu_manager"
import { UI } from "./electron_commandline_UI/commandline";

app.setPath("userData", app.getPath("temp") + "/tjb");
app.on('ready', async () =>
{
    // let M_login = new Login_manager()
    
    // await M_login.start()
    
    // let M_zuo_renwu = new Zuo_renwu_manager()
    // M_login.deliver_workers_to(M_zuo_renwu);
    // await M_zuo_renwu.start()

    new UI()
});


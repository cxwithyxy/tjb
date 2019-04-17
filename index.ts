import { app, BrowserWindow } from 'electron'
import { Login_manager } from "./work/Login_manager"
import { Qiang_jb_manager } from "./work/Qiang_jb_manager"

app.setPath("userData", app.getPath("temp") + "/tjb");
app.on('ready', async () =>
{
    let M_login = new Login_manager()
    
    await M_login.start();
    
    let M_qiang_jb = new Qiang_jb_manager();
    M_login.deliver_work_to(M_qiang_jb);
    await M_qiang_jb.start();
});


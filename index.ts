import { app, BrowserWindow } from 'electron'
import { Login_manager } from "./work/Login_manager"
import { Only_show_jb_manager } from "./work/Only_show_jb_manager"

app.setPath("userData", app.getPath("temp") + "/tjb");
app.on('ready', async () =>
{
    let M_login = new Login_manager()
    
    await M_login.start();
    
    let M_only_show_jb = new Only_show_jb_manager();
    M_login.deliver_work_to(M_only_show_jb);
    await M_only_show_jb.start();
});


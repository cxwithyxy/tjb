const { app, BrowserWindow } = require('electron')
const { Config_helper } = require('./Config_helper')
const { Login_manager } = require("./work/Login_manager")
const { Only_show_jb_manager } = require("./work/Only_show_jb_manager")

app.setPath("userData", app.getPath("temp") + "/tjb");
app.on('ready', async () =>
{
    let M_login = new Login_manager();
    await M_login.start();
    
    let M_only_show_jb = new Only_show_jb_manager();
    M_login.deliver_work_to(M_only_show_jb);
    await M_only_show_jb.start();
});


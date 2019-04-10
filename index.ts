const { app, BrowserWindow } = require('electron')
const { Config_helper } = require('./Config_helper')
const { Login_manager } = require("./work/Login_manager")

app.setPath("userData", app.getPath("temp") + "/tjb");
app.on('ready', ()=>{new tjb()})

class tjb
{

    constructor()
    {
        new Login_manager().start();
        
    }

}

const { app, BrowserWindow } = require('electron')
const { Config_helper } = require('./Config_helper')
const { Login_manager } = require("./work/Login_manager")

app.setPath("userData", app.getPath("temp") + "/tjb");
app.on('ready', ()=>{new tjb(app)})

class tjb
{

    public app = null;

    constructor(app: any)
    {
        Config_helper.getInstance().driver_init(app);
        this.app = app;

        new Login_manager().start();
        
    }

}

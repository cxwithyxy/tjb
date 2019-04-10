const { app, BrowserWindow } = require('electron')
const { Browser_helper } = require('./Browser_helper')
const { Config_helper } = require('./Config_helper')


app.on('ready', ()=>{new tjb(app)})

class tjb
{

    public app = null;

    constructor(app: any)
    {
        Config_helper.getInstance().driver_init(app);
        this.app = app;

        this.path_handle();
        this.goto_tb_page();
        
        (Config_helper.getInstance().get("username"));
        
    }

    goto_tb_page()
    {
        let win = new BrowserWindow({ 
            width: 480,
            height: 800,
            resizable: false,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true
            }
        });
        let wincc = win.webContents;
        Browser_helper.set_ua(wincc);
        // wincc.loadURL("https://market.m.taobao.com/apps/market/tjb/core-member2.html");
        wincc.loadURL("https://echo.opera.com");
    }

    path_handle()
    {
        Browser_helper.set_userdata_path(app);
    }
}

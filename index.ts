const { app, BrowserWindow } = require('electron')

const { Browser_helper } = require('./Browser_helper')

class tjb
{

    public app = null;

    constructor(app: any)
    {
        this.app = app;

        this.path_handle();
        this.goto_tb_page();
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

app.on('ready', ()=>{new tjb(app)})
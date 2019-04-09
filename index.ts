const { app, BrowserWindow } = require('electron')

class tjb {

    public app = null;

    constructor(app: any) {
        this.app = app;

        this.path_handle();
        this.goto_tb_page();
    }

    goto_tb_page() {
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
        wincc.setUserAgent("User-Agent:	Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1");
        wincc.loadURL("https://market.m.taobao.com/apps/market/tjb/core-member2.html");
        // wincc.loadURL("https://m.baidu.com");
        // setTimeout(() => {
        //     wincc.enableDeviceEmulation({});
        // }, 1500);
    }

    path_handle() {
        app.setPath("userData", app.getPath("temp") + "/tjb");
    }
}

app.on('ready', ()=>{new tjb(app)})
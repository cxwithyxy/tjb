const { app, BrowserWindow } = require('electron')

export class Worker
{
    win:any;
    wincc:any;
    win_settings:any;

    constructor (win_settings: {})
    {
        this.win_settings = win_settings;
    }

    open_url (url: string)
    {
        this.wincc.loadURL(url);
        return this;
    }

    page_init ()
    {
        this.win = new BrowserWindow(this.win_settings);
        this.wincc = this.win.webContents;
        return this;
    }

    set_ua (ua: string)
    {
        this.wincc.setUserAgent(ua);
        return this;
    }

    open_dev()
    {
        this.wincc.openDevTools({mode: "undocked"});
        return this;
    }

    async exec_js(js_code: string)
    {
        await this.wincc.executeJavaScript(js_code);
    }
}
import { BrowserWindow } from 'electron'
import { Inject_js_handler as IJH } from "./inject_js/Inject_js_handler"

export class Worker
{
    win:any;
    wincc:any;
    win_settings:any;

    constructor (win_settings: {})
    {
        this.win_settings = win_settings;
    }

    open_url (url: string): Worker
    {
        this.wincc.loadURL(url);
        return this;
    }

    page_init (): Worker
    {
        this.win = new BrowserWindow(this.win_settings);
        this.wincc = this.win.webContents;
        return this;
    }

    set_ua (ua: string): Worker
    {
        this.wincc.setUserAgent(ua);
        return this;
    }

    open_dev(): Worker
    {
        this.wincc.openDevTools({mode: "undocked"});
        return this;
    }

    async exec_js(js_code: string)
    {
        await this.wincc.executeJavaScript(
            IJH.getInstance().to_code_string(js_code)
        );
    }

    mouse_move(_x: Number, _y: Number)
    {
        this.wincc.focus();
        this.wincc.sendInputEvent({
            type: "mouseMove",
            x: _x,
            y: _y
        })
    }

    mouse_down(_x: Number, _y: Number)
    {
        this.wincc.focus();
        this.wincc.sendInputEvent({
            type: "mouseDown",
            button: "left",
            x: _x,
            y: _y,
            clickCount: 1
        })
    }

    mouse_up(_x: Number, _y: Number)
    {
        this.wincc.focus();
        this.wincc.sendInputEvent({
            type: "mouseUp",
            button: "left",
            x: _x,
            y: _y,
            clickCount: 1
        })
    }
}
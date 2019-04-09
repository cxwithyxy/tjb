"use strict";
const { app, BrowserWindow } = require('electron');
class tjb {
    constructor() {
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
        win.loadURL("https://market.m.taobao.com/apps/market/tjb/core-member2.html");
        // wincc.loadURL("https://echo.opera.com");
    }
}
app.on('ready', () => { new tjb(); });

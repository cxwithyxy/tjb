import { IpcRenderer as Ipcr } from "electron"
const $ = (a:any):any => {}
let ipcRenderer!:Ipcr

export = {
    "login_input_set": (_u: string, _p: string) =>
    {
        $("#username").val(_u);
        $("#password").val(_p);
    },
    "is_login": () =>
    {
        return !document.querySelectorAll("#btn-submit").length
    },
    "login_click_event": () =>
    {
        let btn = <HTMLElement>(document.querySelectorAll("#btn-submit")[0])
        
        btn.addEventListener("click", () =>
        {
            ipcRenderer.send("login_btn_click");
        })

    }
}
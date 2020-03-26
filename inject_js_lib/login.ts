import { IpcRenderer as Ipcr } from "electron"
const $ = (a:any):any => {}
let ipcRenderer!:Ipcr

export = {
    "login_input_set": (_u: string, _p: string) =>
    {
        let un = <HTMLInputElement>(document.querySelectorAll("#username")[0])
        let pw = <HTMLInputElement>(document.querySelectorAll("#password")[0])
        un.value = _u
        pw.value = _p
    },
    "is_login": () =>
    {
        return !document.querySelectorAll('#login-form > div.fm-btn > button').length
    },
    "login_click_event": () =>
    {
        let btn = <HTMLElement>document.querySelector('#login-form > div.fm-btn > button')
        
        btn.addEventListener("click", () =>
        {
            let un = <HTMLInputElement>document.querySelector('#fm-login-id')
            let pw = <HTMLInputElement>document.querySelector('#fm-login-password')
            ipcRenderer.send("login_btn_click", un.value, pw.value)
        })

    }
}
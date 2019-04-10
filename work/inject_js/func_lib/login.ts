const $ = (a:any):any => {}
export = {
    "login_input_set": (_u: string, _p: string) =>
    {
        $("#username").val(_u);
        $("#password").val(_p);
    }
}
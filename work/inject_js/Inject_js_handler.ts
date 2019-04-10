const { _ } = require("lodash")
const login = require("./func_lib/login")

export class Inject_js_handler
{
    public codes_lib:any;

    constructor()
    {
        this.codes_lib = {};
        this.add_object(login);
    }

    add_object(_obj:Object){
        _.merge(this.codes_lib, _obj);
        return this;
    }

    to_code_string(code_at_end:String = "")
    {
        let code = "";
        _.forIn(this.codes_lib, (v: any,k: any) =>
        {
            console.log(k);
            console.log(v);
            // code += "var " + k.toString() + " = " + v.toString() + "\n"
        });
        return code + code_at_end;
    }
}
import _ from "lodash"
import login from "./func_lib/login"
import fuli from "./func_lib/fuli"
import { Singleton } from "../../base/Singleton";

export class Inject_js_handler extends Singleton
{
    public codes_lib:any;

    static instance:Inject_js_handler;
    
    public static getInstance():Inject_js_handler
    {
        if(!this.instance)
        {
            this.instance = new Inject_js_handler();
        }
        return this.instance;
    }
    constructor()
    {
        super()
        this.codes_lib = {}
        this.add_object(login)
        this.add_object(fuli)
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
            code += "var " + k.toString() + " = " + v.toString() + "\n"
        });
        return code + code_at_end;
    }
}
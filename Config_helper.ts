import Conf from 'Conf'
import { Singleton } from "./base/Singleton"
import { app, BrowserWindow } from 'electron'

export class Config_helper extends Singleton
{
    private config_name = "app.conf";
    private conf_driver: any;
    private error_desc: any;

    private conf_storage_path: string = "";

    static instance:Config_helper;
    /**
     * 获取实例的静态方法实例
     * @return
     *
     */
    public static getInstance():Config_helper
    {
        if(!this.instance)
        {
            this.instance = new Config_helper();
        }
        return this.instance;
    }

    constructor()
    {
        super();

        enum error_desc {
            username = "需要用户名进行登录",
            password = "需要密码进行登录"
        };
        this.error_desc = error_desc;

        this.conf_storage_path = app.getAppPath();
        
        this.conf_driver = new Conf({
            configName: this.config_name,
            cwd: this.conf_storage_path
        });
        
    }

    get(_key:String)
    {
        let return_v = this.conf_driver.get(_key);
        let error_desc = this.error_desc[_key as any];
        
        if( (typeof return_v == "undefined") && error_desc ){
            console.error(this.get_path_warn_desc() + "\n" + error_desc);
            throw new Error(this.get_path_warn_desc() + "\n" + error_desc);
        }
        return return_v;
    }

    get_path_warn_desc()
    {
        return "确认目录 " + this.conf_storage_path + " 下存在 " + this.config_name + ".json 文件. 而且这个 json 文件不要有多余的逗号"
    }
}
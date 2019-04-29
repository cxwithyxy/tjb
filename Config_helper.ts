import Conf from 'conf'
import { Singleton } from "./base/Singleton"
import { app } from 'electron'
import _ from "lodash";
import { dirname } from "path"

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
            password = "需要密码进行登录",
            cookies = "当前没有保存持久化cookie"
        };
        this.error_desc = error_desc;

        this.conf_storage_path = app.isPackaged ? <string>process.env.PORTABLE_EXECUTABLE_DIR : app.getAppPath();
        
        this.conf_driver = new Conf({
            configName: this.config_name,
            cwd: this.conf_storage_path
        });

        this.set()
    }

    get(_key:String)
    {
        let return_v = this.conf_driver.get(_key);
        let error_desc = this.error_desc[_key as any];
        
        if( _.isUndefined(return_v) && !_.isUndefined(error_desc) ){
            console.log(this.get_path_warn_desc() + "\n" + error_desc);
            throw new Error(this.get_path_warn_desc() + "\n" + error_desc);
        }
        return return_v;
    }

    set(confs = {})
    {
        this.conf_driver.set(confs)
        return this
    }

    get_path_warn_desc()
    {
        return `${this.conf_storage_path} 中的 ${this.config_name}.json 文件很重要，记录着你淘宝账号密码。`
    }
}
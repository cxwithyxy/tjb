import { app } from 'electron'
import { isUndefined } from 'util';
import {dirname} from "path"
export class Path_helper
{

    /**
     * 无论在什么环境下都返回真实的app_path, 仅在win打包下可用
     *
     * @static
     * @returns
     * @memberof Path_helper
     */
    static get_app_path(): string
    {
        if(Path_helper.is_packaged())
        {
            if(isUndefined(process.env.PORTABLE_EXECUTABLE_DIR))
            {
                return dirname(app.getPath("exe"))
            }
            return process.env.PORTABLE_EXECUTABLE_DIR
        }
        return app.getAppPath()
    }

    
    /**
     * 是否在打包环境下运行
     *
     * @static
     * @returns {boolean}
     * @memberof Path_helper
     */
    static is_packaged(): boolean
    {
        return <boolean>app.isPackaged
    }
}
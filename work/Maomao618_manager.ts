import sleep from "sleep-promise"
import { UI } from "electron_commandline_UI"
import { Shou_cai_manager } from "./Shou_cai_manager";

export class Maomao618_manager extends Shou_cai_manager
{
    mao_positions: Array<mao_position>

    constructor()
    {
        super()

        this.mao_positions = [
            new mao_position(66, 341)
            ,new mao_position(172, 341)
            ,new mao_position(278, 341)
            ,new mao_position(407, 341)

            ,new mao_position(66, 443)
            ,new mao_position(172, 443)
            ,new mao_position(278, 443)
            ,new mao_position(407, 443)

            ,new mao_position(66, 548)
            ,new mao_position(172, 548)
            ,new mao_position(278, 548)
            ,new mao_position(407, 548)
        ]
    }

    async start()
    {
        await this.load_maomao()
        await this.close_maomao_xiuxichanbi()
    }
    
    /**
     * 进入猫猫界面
     *
     * @memberof Maomao618_manager
     */
    async load_maomao()
    {
        await this.load_zhuangyuan()
        await this.workers_do(async (_w) =>
        {
            await _w.exec_js(`view_goods()`)
            await sleep(2000)
            await _w.click(409, 172)
            await sleep(5000)
        })
    }

    /**
     * 如果有弹框提示猫猫产生金币数, 关闭弹框便于后续操作
     *
     * @memberof Maomao618_manager
     */
    async close_maomao_xiuxichanbi()
    {
        await this.workers_do(async (_w) =>
        {
            let has_tangkuang = await _w.exec_js(`has_xiuxi_tangkuang()`)
            if(has_tangkuang)
            {
                await _w.click(233, 629)
            }
        })
    }
}

/**
 * 猫猫的位置坐标类
 *
 * @class mao_position
 */
class mao_position
{
    x:number
    y:number

    constructor(x:number, y:number)
    {
        this.x = x
        this.y = y
    }
}
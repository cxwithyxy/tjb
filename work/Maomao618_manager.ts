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
        let count = 1
        while(true)
        {
            UI.log(`猫猫: 载入猫猫页面开始`)
            await this.load_maomao()
            await this.close_maomao_xiuxichanbi()
            UI.log(`猫猫: 载入猫猫页面结束`)
            UI.log(`猫猫: 合并猫猫开始`)
            await this.drag_maomao()
            UI.log(`猫猫: 合并猫猫结束`)
            UI.log(`猫猫: 获取猫币开始`)
            await this.get_mao_bi()
            UI.log(`猫猫: 获取猫币结束`)
            UI.log(`猫猫: 第 ${count} 次结束`)
            count ++
            await this.workers_do(async (_w) =>
            {
                _w.give_me_a_life(60 * 5)
            })
        }
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

    /**
     * 拖拽猫猫进行合并升级
     *
     * @memberof Maomao618_manager
     */
    async drag_maomao()
    {
        await this.workers_do(async (_w) =>
        {
            for (let i = 0; i < this.mao_positions.length; i++)
            {
                let m_p = this.mao_positions[i];
                for (let j = i + 1; j < this.mao_positions.length; j++)
                {
                    let m_p_2 = this.mao_positions[j];
                    await _w.touch_drag_drop(300, m_p.x, m_p.y, m_p_2.x, m_p_2.y)
                }
            }
        })
    }

    async get_mao_bi()
    {
        await this.workers_do(async (_w) =>
        {
            await _w.tap(234, 683)
            await sleep(300)
            await _w.tap(232, 257)
            await sleep(11 * 1000)
            await _w.tap(413, 424)
            await sleep(300)
            await _w.tap(232, 522)
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
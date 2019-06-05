import sleep from "sleep-promise"
import { UI } from "electron_commandline_UI"
import { Shou_cai_manager } from "./Shou_cai_manager";
import { setInterval } from "timers";

export class Maomao618_manager extends Shou_cai_manager
{
    mao_positions: Array<mao_position>
    main_loop_count = 0
    main_thread_timeout = 0
    
    /**
     * 主线程超时时间, 超时代表了卡死, 则重新启动新主线程
     *
     * @memberof Maomao618_manager
     */
    max_main_thread_timeout = 60 * 2

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
        await this.workers_do(async (_w) =>
        {
            await _w.screen_touch_emulation()
        })
        let start_worker_num = 4
        let count = Math.ceil(50 / start_worker_num)
        let nowcount = count
        this.proliferate_worker_until(start_worker_num)
        while(nowcount--)
        {
            UI.log(`领猫币第 ${count-nowcount} 次, 每次领 ${start_worker_num} 个 300 猫币`)
            await this.link_get_mao_bi()
            await this.mission_get_mao_bi()
            await this.workers_do(async (_w) =>
            {
                _w.give_me_a_life(60 * 5)
            })
        }
    }

    async link_get_mao_bi()
    {
        await this.workers_do(async (_w) =>
        {
            await _w.open_url(`https://pages.tmall.com/wow/a/act/tmall/tmc/22351/wupr?spm=a211rx.12872410.1284722755.2&wh_pid=industry-161308&disableNav=YES&sellerId=379424089`)
            await _w.wait_page_load()
        })
    }

    async mission_get_mao_bi()
    {
        await this.workers_do(async (_w) =>
        {
            await sleep(11 * 1000)
            await _w.tap(413, 424)
            await sleep(300)
            await _w.tap(232, 522)
            await sleep(1000 * 3)
        })
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
                    UI.log(`合并第 ${i + 1} 个和第 ${j + 1} 个猫猫`)
                    await _w.touch_drag_drop(100, m_p.x, m_p.y, m_p_2.x, m_p_2.y)
                    await sleep(300)
                }
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
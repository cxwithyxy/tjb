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

    async start2()
    {
        let count = 1
        let stop_holder_func: Function
        let start_holder = new Promise<void>((succ) =>
        {
            stop_holder_func = succ
        })

        this.main_thread_start()
        this.main_thread_watcher()
        return start_holder
    }

    async start()
    {
        while(true)
        {
            await this.load_maomao()
            await this.close_maomao_xiuxichanbi()
            await this.workers_do(async (_w) =>
            {
                await _w.screen_touch_emulation()
            })
            await this.link_get_mao_bi()
            await this.mission_get_mao_bi()
            // await this.workers_do(async (_w) =>
            // {
            //     _w.give_me_a_life(60 * 5)
            // })
        }
    }

    async link_get_mao_bi()
    {
        await this.workers_do(async (_w) =>
        {
            await _w.open_url(`https://pages.tmall.com/wow/a/act/tmall/tmc/22351/wupr?spm=a211rx.12872410.1284722755.2&wh_pid=industry-161308&disableNav=YES&sellerId=379424089`)
        })
    }

    async mission_get_mao_bi()
    {
        await this.workers_do(async (_w) =>
        {
            // _w.set_ua("Mozilla/5.0 (Linux; U; Android 8.0.0; zh-CN; Mi Note 2 Build/OPR1.170623.032) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/69.0.3497.100 UWS/3.17.0.17 Mobile Safari/537.36 AliApp(TB/8.6.0) UCBS/2.11.1.1 TTID/600000@taobao_android_8.6.0 WindVane/8.5.0 1080X1820")
            // await sleep(60 * 3600 * 1000)

            // await _w.tap(383, 690)
            // await sleep(5 * 1000)
            // await _w.tap(393, 420)
            await sleep(11 * 1000)
            await _w.tap(413, 424)
            await sleep(300)
            await _w.tap(232, 522)
            await sleep(1000 * 3)
        })
    }

    /**
     * 启动主线程
     *
     * @memberof Maomao618_manager
     */
    main_thread_start()
    {
        new Promise(async(succ, fail) =>
        {
            this.main_thread_timeout = 0;
            while(true)
            {
                UI.log(`猫猫: 载入猫猫页面开始`)
                await this.load_maomao()
                this.main_thread_timeout = 0;
                await this.close_maomao_xiuxichanbi()
                this.main_thread_timeout = 0;
                UI.log(`猫猫: 载入猫猫页面结束`)
                UI.log(`猫猫: 合并猫猫开始`)
                await this.drag_maomao()
                this.main_thread_timeout = 0;
                UI.log(`猫猫: 合并猫猫结束`)
                UI.log(`猫猫: 获取猫币开始`)
                await this.get_mao_bi()
                this.main_thread_timeout = 0;
                UI.log(`猫猫: 获取猫币结束`)
                UI.log(`猫猫: 第 ${this.main_loop_count} 次结束`)
                this.main_loop_count ++
                await this.workers_do(async (_w) =>
                {
                    _w.give_me_a_life(60 * 5)
                })
                this.main_thread_timeout = 0;
            }
        })
    }

    /**
     * 主线程超时监控
     *
     * @memberof Maomao618_manager
     */
    main_thread_watcher()
    {
        new Promise(async (succ) =>
        {
            setInterval(() =>
            {
                this.main_thread_timeout += 5
                if(this.main_thread_timeout >= this.max_main_thread_timeout)
                {
                    this.main_thread_start()
                }
            }, 5000)
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
            await sleep(1000 * 3)
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
import { Manager } from "./Manager"
import { Worker } from "./Worker";

export class Qiang_jb_manager extends Manager
{
    constructor(_w?: Worker | Worker[])
    {
        super(_w);
    }

    public async start()
    {
        this.proliferate_worker(10)
        await this.workers_do(async (_w) =>
        {
            await _w.exec_js(`fuli_only_show_jb()`)
        })
    }
}
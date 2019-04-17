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
        await this.get_main_worker().exec_js(`fuli_only_show_jb()`)
    }
}
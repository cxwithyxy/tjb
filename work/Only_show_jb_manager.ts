import { Manager } from "./Manager"
import { Inject_js_handler as IJH } from "./inject_js/Inject_js_handler"
import { Worker } from "./Worker";

export class Only_show_jb_manager extends Manager
{
    constructor(_w: Worker | Worker[] | undefined)
    {
        super(_w);
    }

    public async start()
    {
        await this.get_main_worker()
        .exec_js(
            IJH.getInstance().to_code_string(`fuli_only_show_jb()`)
        )
    }
}
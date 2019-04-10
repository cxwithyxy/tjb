const { Manager } = require("./Manager")
const { Inject_js_handler } = require("./inject_js/Inject_js_handler")

export class Only_show_jb_manager extends Manager
{
    constructor(_w: Worker | undefined)
    {
        super(_w);
    }

    public async start()
    {
        let ijh = new Inject_js_handler();
        await this.get_main_worker().exec_js(ijh.to_code_string(`fuli_only_show_jb()`));
    }
}
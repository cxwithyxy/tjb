const { Worker } = require("./Worker")
const { _ } = require("lodash")
export class Manager
{
    public main_worker: Worker | undefined;

    constructor(_w: Worker | undefined){
        if(! _.isUndefined(_w)){
            this.main_worker = _w;
        }
    }

    public start()
    {
        
    }

    public set_main_worker(_w: any)
    {
        this.main_worker = _w;
        return this;
    }

    public get_main_worker()
    {
        return this.main_worker;
    }

    public deliver_work_to(_m: any)
    {
        return _m.set_main_worker(this.get_main_worker());
    }

}
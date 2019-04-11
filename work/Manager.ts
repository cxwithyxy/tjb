import { Worker } from "./Worker"
import * as _ from "lodash";

export class Manager
{
    public main_worker: Worker | undefined;
    public works: Worker[] | undefined;

    constructor(_w: Worker | Worker[] | undefined){
        if(! _.isUndefined(_w) && !_.isArray(_w)){
            this.main_worker = _w;
        }
        if(_.isArray(_w)){
            this.works = _w;
        }
    }

    public start()
    {
        
    }

    public set_main_worker(_w: Worker):Manager
    {
        this.main_worker = _w;
        return this;
    }

    public get_main_worker(): Worker
    {
        if(_.isUndefined(this.main_worker)){
            throw new Error("main_worker_have_not_set");
        }
        return this.main_worker;
    }

    public deliver_work_to(_m: Manager)
    {
        return _m.set_main_worker(this.get_main_worker());
    }

}
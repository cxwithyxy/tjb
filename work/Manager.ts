import { Worker } from "./Worker"
import * as _ from "lodash";

export class Manager
{
    workers!: Worker[];

    constructor(_w?: Worker | Worker[]){
        if(! _.isUndefined(_w) && !_.isArray(_w))
        {
            this.workers = [_w];
        }
        if(_.isArray(_w))
        {
            this.workers = _w;
        }
        if(_.isUndefined(_w))
        {
            this.workers = [];
        }
    }

    start()
    {
        
    }

    set_main_worker(_w: Worker): Manager
    {
        let main_worker = _.head(this.workers)
        if(_.isUndefined(main_worker))
        {
            this.workers.push(_w)
        }
        else
        {
            this.workers[0] = _w;
        }
        return this;
    }

    get_main_worker(): Worker
    {
        let main_worker = _.head(this.workers)
        if(_.isUndefined(main_worker))
        {
            throw new Error("main_worker_have_not_set");
        }
        return main_worker;
    }

    deliver_main_worker_to(_m: Manager): Manager
    {
        return _m.set_main_worker(this.get_main_worker());
    }

    set_workers(_works: Worker[]): Manager
    {
        this.workers = _works
        return this
    }

    get_workers(): Worker[]
    {
        return this.workers
    }

    deliver_workers_to(_m: Manager): Manager
    {
        return _m.set_workers(this.get_workers())
    }

    proliferate_worker(num: number, setting?: {})
    {
        
    }

}
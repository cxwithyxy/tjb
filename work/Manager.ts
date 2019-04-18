import { Worker } from "./Worker"
import * as _ from "lodash"
import pLimit from 'p-limit'

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

    set_workers(_workers: Worker[]): Manager
    {
        this.workers = _workers
        return this
    }

    get_workers(): Worker[]
    {
        return this.workers
    }

    add_worker(_w: Worker)
    {
        this.workers.push(_w);
    }

    deliver_workers_to(_m: Manager): Manager
    {
        return _m.set_workers(this.get_workers())
    }

    proliferate_worker(num: number, setting?: object): Manager
    {
        let base_worker:Worker = this.get_main_worker()
        let current_url:string = base_worker.wincc.getURL()
        while(num--)
        {
            if(_.isUndefined(setting))
            {
                setting = base_worker.win_settings
            }
            this.add_worker(new Worker(setting).page_init().open_url(current_url))
        }
        
        return this
    }

    async workers_do(_func: (one_worker: Worker, index?: number) => Promise<any>)
    {
        let limit:Function = pLimit(this.get_workers().length)
        let queque:Array<any> = [];
        _.forEach(this.get_workers(), (v,k) =>
        {
            queque.push(limit(async () =>
            {
                await _func(v, k)
            }))
        })
        await Promise.all(queque)
    }

}
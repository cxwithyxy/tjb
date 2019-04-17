import { Worker } from "./Worker"
import * as _ from "lodash";

export class Manager
{
    public works!: Worker[];

    constructor(_w?: Worker | Worker[]){
        if(! _.isUndefined(_w) && !_.isArray(_w))
        {
            this.works = [_w];
        }
        if(_.isArray(_w))
        {
            this.works = _w;
        }
        if(_.isUndefined(_w))
        {
            this.works = [];
        }
    }

    public start()
    {
        
    }

    public set_main_worker(_w: Worker): Manager
    {
        let main_worker = _.head(this.works)
        if(_.isUndefined(main_worker))
        {
            this.works.push(_w)
        }
        else
        {
            this.works[0] = _w;
        }
        return this;
    }

    public get_main_worker(): Worker
    {
        let main_worker = _.head(this.works)
        if(_.isUndefined(main_worker))
        {
            throw new Error("main_worker_have_not_set");
        }
        return main_worker;
    }

    public deliver_work_to(_m: Manager): Manager
    {
        return _m.set_main_worker(this.get_main_worker());
    }

}
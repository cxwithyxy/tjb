import { scheduleJob, Job } from "node-schedule";
import _ from "lodash";

interface job_wrapper
{
    body: Job
    name: string
    schedule: string
}

export class Main_job_manager
{
    job_box: Array<job_wrapper> = []

    create_job(job_name: string, job_schedule: string, _func: Function)
    {
        if(this.has_job(job_name))
        {
            throw Error(`${job_name} is existed`)
        }
        let temp_job = scheduleJob(job_schedule, () =>
        {
            _func()
        })
        this.add_job({body: temp_job, name: job_name, schedule: job_schedule})

    }

    get_job(job_name: string): job_wrapper | undefined
    {
       return _.find(this.job_box, {name: job_name})
    }

    has_job(job_name: string): boolean
    {
        if(_.isUndefined(this.get_job(job_name)))
        {
            return false
        }
        return true
    }

    add_job(job: job_wrapper)
    {
        this.job_box.push(job)
    }
}
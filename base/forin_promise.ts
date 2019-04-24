import _ from "lodash"
import pLimit from "p-limit";

export default async (_list: Array<any>, _func: (_v: any, _k?: number | string) => Promise<any>, thread_limit: number = 1) =>
{
    let limit:Function = pLimit(thread_limit)
    let queque:Array<any> = [];
    _.forEach(_list, (v,k) =>
    {
        queque.push(limit(async () =>
        {
            await _func(v, k)
        }))
    })
    await Promise.all(queque)
}
let window: any
export = {
    "water_it": () =>
    {
        window.Biz.emit("interact:water")
        window.Biz.emit("interact:helpWater")
    },
    "steal": () =>
    {
        window.Biz.emit("stealVege")
    },
    "harvest": () =>
    {
        window.Biz.emit("harvestVege")
    },
    "show_all_friend": () =>
    {
        return new Promise((succ) =>
        {
            let timeout_handle = setInterval(() =>
            {
                console.log(`dididi`);
                
                try
                {
                    (<HTMLDivElement>document.querySelectorAll(".card-footer")[0]).click()
                }
                catch(e)
                {
                    clearInterval(timeout_handle)
                    succ()
                }
            }, 1000);
        })
    }
}
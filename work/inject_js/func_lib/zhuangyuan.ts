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
    }
}
let window: any
let friend_btns: Function
export = {
    "water_it": () =>
    {
        window.Biz.emit("interact:water")
        // window.Biz.emit("interact:helpWater")
    },
    "steal": () =>
    {
        window.Biz.emit("stealVege")
    },
    "harvest": () =>
    {
        window.Biz.emit("harvestVege")
    },
    "friend_btns": () => 
    {
        let btns = document.querySelectorAll(".card-item .content .item-action .action .btn")
        return btns
    },
    "has_friend_btn": () =>
    {
        let btns: Array<HTMLDivElement> = friend_btns()
        for (let i = 0; i < btns.length; i++) {
            let item = btns[i];
            if(item.innerHTML.length == 3)
            {
                return i
            }
            
        }
        return false
    },
    "click_friend_btn": (_index: number) =>
    {
        friend_btns()[_index].click()
    },
    "get_friend_btn_content": (_index: number) =>
    {
        return friend_btns()[_index].innerHTML
    },
    "friend_count": () =>
    {
        let friends_div = friend_btns()

        return friends_div.length
    },
    "qian_dao": () =>
    {
        window.Biz.emit("sign")
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
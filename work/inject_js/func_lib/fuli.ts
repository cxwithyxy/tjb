const $ = (a:any):any => {}
export = {
    "fuli_only_show_jb": () =>
    {
        let temp_1 = <NodeListOf<HTMLElement>>document.querySelectorAll(".panel");
        temp_1[0].style.display = "none";
        
        let temp_2 = <NodeListOf<HTMLElement>>document.querySelectorAll("body > div.rax-scrollview > div > div:not(:nth-child(5))");
        temp_2.forEach(element => {
            element.style.display = "none";
        });

    },
    "click_qiang_btn": () =>
    {
        try
        {
            let temp = <HTMLDivElement>document.querySelectorAll("body > div.rax-scrollview > div > div:nth-child(5) > div > div > div > div:nth-child(2) > div > div:nth-child(3)")[0]
            temp.click()
        }
        catch(e)
        {
            console.log(e)
        }
    },
    "click_zhifu_btn": () =>
    {
        try
        {
            let temp = <HTMLDivElement>document.querySelectorAll("body > div:nth-child(14) > div > div > div:nth-child(3) > div:nth-child(2)")[0]
            temp.click()
        }
        catch(e)
        {
            console.log(e)
        }
    }

}
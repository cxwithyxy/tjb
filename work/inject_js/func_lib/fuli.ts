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

    }
}
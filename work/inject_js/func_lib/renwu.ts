const $ = (a:any):any => {}
export = {
    "get_rewu_links" : () =>
    {
        let a_elements = <NodeListOf<HTMLLinkElement>>document.querySelectorAll("a[href*=shop]")
        let return_array: Array<string> = []
        a_elements.forEach(element =>
        {
            return_array.push(<string>element.getAttribute("href"))
        });
        return return_array
    },
    "get_rewu_inner_inframe_src" : () =>
    {
        return (<HTMLIFrameElement>document.querySelectorAll("iframe")[0]).getAttribute("src")
    }
}
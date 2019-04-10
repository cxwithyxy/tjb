const $ = (a:any):any => {}
export = {
    "fuli_only_show_jb": () =>
    {
        $(".panel").style.display = "none";
        console.log($(".panel").style.display);
        console.log($(".panel"));
        
    }
}
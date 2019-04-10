export class Browser_helper
{
    
    static set_ua(handle_target: any)
    {
        handle_target.setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1");
    }

    static set_userdata_path(handle_target: any)
    {
        handle_target.setPath("userData", handle_target.getPath("temp") + "/tjb");
    }

}
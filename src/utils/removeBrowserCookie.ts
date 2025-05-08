import Cookies from "js-cookie";

function removeBrowserCookie(cookieKey: string) {
    if (!cookieKey) {
        throw 'Arg cookieKey not provided';
    }

    Cookies.remove(cookieKey);
}

export default removeBrowserCookie;
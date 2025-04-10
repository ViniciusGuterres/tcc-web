import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { Navigate, Outlet } from "react-router";

const privateRoute = () => {
    const userToken = Cookies.get("user_token");

    if (!userToken) {
        return <Navigate to='/login' replace />
    }

    try {
        const decodedToken = jwtDecode<{ exp: number }>(userToken);

        // Check if the token expired
        if (decodedToken.exp * 1000 < Date.now()) {
            Cookies.remove("user_token");
            return <Navigate to='/login' replace />
        }

        return <Outlet />;
        // return <>{children}</>
    } catch (error) {
        Cookies.remove("user_token");
        return <Navigate to='/login' replace />
    }

}

export default privateRoute;
import React, { ReactNode } from "react";
import { Navigate } from "react-router";

interface Props {
    children: ReactNode,
}

const isAuthenticated = () => {
    return false;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
    return (
        isAuthenticated()
            ?
            <>{children}</>
            :
            <Navigate to="/login" replace />
    );
};

export default PrivateRoute;
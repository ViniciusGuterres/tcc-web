import { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import PrivateRoute from "./privateRoute";
import Layout from "../components/Layout";

const Home = lazy(() => import('../pages/Home'));

const glazesRoutes: RouteObject = {
    path: 'home',
    element: <PrivateRoute />,
    children: [
        {
            element: <Layout />,
            children: [
                { path: "", element: <Suspense fallback={<div>Carregando...</div>}><Home /></Suspense> },
            ]
        }
    ],
};

export default glazesRoutes;
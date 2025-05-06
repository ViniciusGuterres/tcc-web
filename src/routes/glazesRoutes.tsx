import { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import PrivateRoute from "./privateRoute";
import Layout from "../components/Layout";

const ListGlazes = lazy(() => import('../pages/GlazesCRUD/ListGlazes'));

const glazesRoutes: RouteObject = {
    path: 'glazes',
    element: <PrivateRoute />,
    children: [
        {
            element: <Layout />,
            children: [
                { path: "", element: <Suspense fallback={<div>Carregando...</div>}><ListGlazes /></Suspense> },
            ]
        }
    ],
};

export default glazesRoutes;
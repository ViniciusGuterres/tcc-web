import { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import PrivateRoute from "./PrivateRoute";
import Layout from "../components/Layout";

const ListProductLines = lazy(() => import('../pages/ProductLinesCRUD/ListProductLines'));

const productLinesRoutes: RouteObject = {
    path: 'productLines',
    element: <PrivateRoute />,
    children: [
        {
            element: <Layout />,
            children: [
                { path: "", element: <Suspense fallback={<div>Carregando...</div>}><ListProductLines /></Suspense> },
            ]
        }
    ],
};

export default productLinesRoutes;
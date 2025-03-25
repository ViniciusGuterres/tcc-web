import { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import PrivateRoute from "./PrivateRoute";
import Layout from "../components/Layout";

const ListProducts = lazy(() => import('../pages/ProductCRUD/ListProducts'));

const productsRoutes: RouteObject = {
    path: 'products',
    element: <PrivateRoute />,
    children: [
        {
            element: <Layout />,
            children: [
                { path: "", element: <Suspense fallback={<div>Carregando...</div>}><ListProducts /></Suspense> },
            ]
        }
    ],
};

export default productsRoutes;
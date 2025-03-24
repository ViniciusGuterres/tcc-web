import { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import PrivateRoute from "./PrivateRoute";
import Layout from "../components/Layout";

const ListProductTypes = lazy(() => import('../pages/ProductTypesCRUD/ListProductTypes'));

const productTypesRoutes: RouteObject = {
    path: 'productTypes',
    element: <PrivateRoute />,
    children: [
        {
            element: <Layout />,
            children: [
                { path: "", element: <Suspense fallback={<div>Carregando...</div>}><ListProductTypes /></Suspense> },
            ]
        }
    ],
};

export default productTypesRoutes;
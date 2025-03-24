import { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import PrivateRoute from "./PrivateRoute";
import Layout from "../components/Layout";

const ListProductTypes = lazy(() => import('../pages/ProductTypesCRUD/ListProductTypes'));
const ProductTypeForm = lazy(() => import('../pages//ProductTypesCRUD/ProductTypeForm'));

const productTypesRoutes: RouteObject = {
    path: 'productTypes',
    element: <PrivateRoute />,
    children: [
        {
            element: <Layout />,
            children: [
                { path: "", element: <Suspense fallback={<div>Carregando...</div>}><ListProductTypes /></Suspense> },
                { path: "create", element: <Suspense fallback={<div>Carregando...</div>}><ProductTypeForm crudMode={'create'} /></Suspense> },
                { path: "edit/:id", element: <Suspense fallback={<div>Carregando...</div>}><ProductTypeForm crudMode={'edit'} /></Suspense> },
            ]
        }
    ],
};

export default productTypesRoutes;
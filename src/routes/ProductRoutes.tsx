import { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import PrivateRoute from "./PrivateRoute";
import Layout from "../components/Layout";

const ListProducts = lazy(() => import('../pages/ProductCRUD/ListProducts'));
const ProductForm = lazy(() => import('../pages/ProductCRUD/ProductForm'));

const productsRoutes: RouteObject = {
    path: 'products',
    element: <PrivateRoute />,
    children: [
        {
            element: <Layout />,
            children: [
                { path: "", element: <Suspense fallback={<div>Carregando...</div>}><ListProducts /></Suspense> },
                { path: "create", element: <Suspense fallback={<div>Carregando...</div>}><ProductForm crudMode={'create'} /></Suspense> },
                { path: "edit/:id", element: <Suspense fallback={<div>Carregando...</div>}><ProductForm crudMode={'edit'} /></Suspense> },
            ]
        }
    ],
};

export default productsRoutes;
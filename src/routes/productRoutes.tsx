import { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import PrivateRoute from "./privateRoutes";
import Layout from "../components/Layout"

const ListProducts = lazy(() => import('../pages/ProductCRUD/ListProducts'));
const ProductForm = lazy(() => import('../pages/ProductCRUD/ProductForm'));
const ProductTransactionForm = lazy(() => import('../pages/ProductCRUD/ProductTransactionForm'));

const productRoutes: RouteObject = {
    path: 'products',
    element: <PrivateRoute />,
    children: [
        {
            element: <Layout />,
            children: [
                { path: "", element: <Suspense fallback={<div>Carregando...</div>}><ListProducts /></Suspense> },
                { path: "create", element: <Suspense fallback={<div>Carregando...</div>}><ProductForm crudMode={'create'} /></Suspense> },
                { path: "edit/:id", element: <Suspense fallback={<div>Carregando...</div>}><ProductForm crudMode={'edit'} /></Suspense> },
                { path: "createTransaction/:productID", element: <Suspense fallback={<div>Carregando...</div>}><ProductTransactionForm crudMode={'create'} /></Suspense> },
                { path: "editTransaction/:productID/:transactionID", element: <Suspense fallback={<div>Carregando...</div>}><ProductTransactionForm crudMode={'edit'} /></Suspense> },
            ]
        }
    ],
};

export default productRoutes;
import { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import PrivateRoute from "./privateRoute";
import Layout from "../components/Layout";

const ListProductLines = lazy(() => import('../pages/ProductLinesCRUD/ListProductLines'));
const ProductLineForm = lazy(() => import('../pages/ProductLinesCRUD/ProductLineForm'));

const productLinesRoutes: RouteObject = {
    path: 'productLines',
    element: <PrivateRoute />,
    children: [
        {
            element: <Layout />,
            children: [
                { path: "", element: <Suspense fallback={<div>Carregando...</div>}><ListProductLines /></Suspense> },
                { path: "create", element: <Suspense fallback={<div>Carregando...</div>}><ProductLineForm crudMode={'create'} /></Suspense> },
                { path: "edit/:id", element: <Suspense fallback={<div>Carregando...</div>}><ProductLineForm crudMode={'edit'} /></Suspense> },
            ]
        }
    ],
};

export default productLinesRoutes;
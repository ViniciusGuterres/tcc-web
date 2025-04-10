import { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import PrivateRoute from "./privateRoute";
import Layout from "../components/Layout";

const ListKilns = lazy(() => import('../pages/KilnCrud/ListKilns'));
const KilnForm = lazy(() => import('../pages/KilnCrud/KilnForm'));

const kilnsRoutes: RouteObject = {
    path: 'kilns',
    element: <PrivateRoute />,
    children: [
        {
            element: <Layout />,
            children: [
                { path: "", element: <Suspense fallback={<div>Carregando...</div>}><ListKilns /></Suspense> },
                { path: "create", element: <Suspense fallback={<div>Carregando...</div>}><KilnForm crudMode={'create'} /></Suspense> },
                { path: "edit/:id", element: <Suspense fallback={<div>Carregando...</div>}><KilnForm crudMode={'edit'} /></Suspense> },
            ]
        }
    ],
};

export default kilnsRoutes;
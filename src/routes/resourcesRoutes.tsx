import { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import PrivateRoute from "./PrivateRoute";
import Layout from "../components/Layout";

const ListResources = lazy(() => import('../pages/ResourcesCRUD/ListResources'));
const ResourceForm = lazy(() => import('../pages/ResourcesCRUD/ResourceForm'));

const resourcesRoutes: RouteObject = {
    path: 'resources',
    element: <PrivateRoute />,
    children: [
        {
            element: <Layout />,
            children: [
                { path: "", element: <Suspense fallback={<div>Carregando...</div>}><ListResources /></Suspense> },
                { path: "create", element: <Suspense fallback={<div>Carregando...</div>}><ResourceForm crudMode={'create'} /></Suspense> },
                { path: "edit/:id", element: <Suspense fallback={<div>Carregando...</div>}><ResourceForm crudMode={'edit'} /></Suspense> },
            ]
        }
    ],
};

export default resourcesRoutes;
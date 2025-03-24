import { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import PrivateRoute from "./PrivateRoute";
import Layout from "../components/Layout";
import ListBatches from "../pages/BatchesCRUD/ListBatches";
import BatchForm from "../pages/BatchesCRUD/BatchForm";


const batchesRoutes: RouteObject = {
    path: 'batches',
    element: <PrivateRoute />,
    children: [
        {
            element: <Layout />,
            children: [
                { path: "", element: <Suspense fallback={<div>Carregando...</div>}><ListBatches /></Suspense> },
                { path: "create", element: <Suspense fallback={<div>Carregando...</div>}><BatchForm crudMode={'create'} /></Suspense> },
                { path: "edit/:id", element: <Suspense fallback={<div>Carregando...</div>}><BatchForm crudMode={'edit'} /></Suspense> },
            ],
        },
    ],
};

export default batchesRoutes;
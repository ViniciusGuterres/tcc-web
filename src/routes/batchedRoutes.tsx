import { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import PrivateRoute from "./PrivateRoute";
import Layout from "../components/Layout";
import ListBatches from "../pages/BatchesCRUD/ListBatches";


const batchesRoutes: RouteObject = {
    path: 'batches',
    element: <PrivateRoute />,
    children: [
        {
            element: <Layout />,
            children: [
                { path: "", element: <Suspense fallback={<div>Carregando...</div>}><ListBatches /></Suspense> },
            ]
        }
    ],
};

export default batchesRoutes;
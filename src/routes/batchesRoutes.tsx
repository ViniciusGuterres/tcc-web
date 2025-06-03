import { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import PrivateRoute from "./privateRoutes";
import Layout from "../components/Layout";
import BatchForm from "../pages/BatchesCRUD/BatchForm";

const ListBatches = lazy(() => import('../pages/BatchesCRUD/ListBatches'));

const batchesRoutes: RouteObject = {
    path: 'batches',
    element: <PrivateRoute />,
    children: [
        {
            element: <Layout />,
            children: [
                { path: "", element: <Suspense fallback={<div>Carregando...</div>}><ListBatches /></Suspense> },
                { path: "create", element: <Suspense fallback={<div>Carregando...</div>}><BatchForm crudMode={'create'} /></Suspense> },

            ]
        }
    ],
};

export default batchesRoutes;
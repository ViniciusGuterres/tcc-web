import { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import PrivateRoute from "./privateRoutes";
import Layout from "../components/Layout";
import GlazeForm from "../pages/GlazesCRUD/GlazeForm";
import GlazeTransactionForm from "../pages/GlazesCRUD/GlazeTransactionForm";

const ListGlazes = lazy(() => import('../pages/GlazesCRUD/ListGlazes'));

const glazesRoutes: RouteObject = {
    path: 'glazes',
    element: <PrivateRoute />,
    children: [
        {
            element: <Layout />,
            children: [
                { path: "", element: <Suspense fallback={<div>Carregando...</div>}><ListGlazes /></Suspense> },
                { path: "create", element: <Suspense fallback={<div>Carregando...</div>}><GlazeForm crudMode={'create'} /></Suspense> },
                { path: "edit/:id", element: <Suspense fallback={<div>Carregando...</div>}><GlazeForm crudMode={'edit'} /></Suspense> },
                // Transactions crud
                { path: "createTransaction/:glazeID", element: <Suspense fallback={<div>Carregando...</div>}><GlazeTransactionForm crudMode={'create'} /></Suspense> },
                { path: "editTransaction/:glazeID/:transactionID", element: <Suspense fallback={<div>Carregando...</div>}><GlazeTransactionForm crudMode={'edit'} /></Suspense> },
            ]
        }
    ],
};

export default glazesRoutes;
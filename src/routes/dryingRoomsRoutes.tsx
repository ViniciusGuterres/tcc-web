import { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import PrivateRoute from "./privateRoutes";
import Layout from "../components/Layout";

const ListDryingRooms = lazy(() => import('../pages/DryingRoomsCRUD/ListDryingRooms'));
const DryingRoomForm = lazy(() => import('../pages/DryingRoomsCRUD/DryingRoomForm'));
const DryingRoomSessionForm = lazy(() => import('../pages/DryingRoomsCRUD/DryingRoomSessionForm'));

const dryingRoomRoutes: RouteObject = {
    path: 'dryingRooms',
    element: <PrivateRoute />,
    children: [
        {
            element: <Layout />,
            children: [
                { path: "", element: <Suspense fallback={<div>Carregando...</div>}><ListDryingRooms /></Suspense> },
                { path: "create", element: <Suspense fallback={<div>Carregando...</div>}><DryingRoomForm crudMode={'create'} /></Suspense> },
                { path: "edit/:id", element: <Suspense fallback={<div>Carregando...</div>}><DryingRoomForm crudMode={'edit'} /></Suspense> },
                   // Session crud
                { path: "createSession/:dryingRoomID", element: <Suspense fallback={<div>Carregando...</div>}><DryingRoomSessionForm crudMode={'create'} /></Suspense> },
                { path: "editSession/:dryingRoomID/:sessionID", element: <Suspense fallback={<div>Carregando...</div>}><DryingRoomSessionForm crudMode={'edit'} /></Suspense> },
            ]
        }
    ],
};

export default dryingRoomRoutes;
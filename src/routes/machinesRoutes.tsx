import { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import PrivateRoute from "./privateRoutes";
import Layout from "../components/Layout";

const ListMachines = lazy(() => import('../pages/MachinesCRUD/ListMachines'));
const MachineForm = lazy(() => import('../pages/MachinesCRUD/MachineForm'));

const machinesRoutes: RouteObject = {
    path: 'machines',
    element: <PrivateRoute />,
    children: [
        {
            element: <Layout />,
            children: [
                { path: "", element: <Suspense fallback={<div>Carregando...</div>}><ListMachines /></Suspense> },
                { path: "create", element: <Suspense fallback={<div>Carregando...</div>}><MachineForm crudMode={'create'} /></Suspense> },
                { path: "edit/:id", element: <Suspense fallback={<div>Carregando...</div>}><MachineForm crudMode={'edit'} /></Suspense> },
            ]
        }
    ],
};

export default machinesRoutes;
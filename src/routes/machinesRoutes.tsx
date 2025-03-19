import { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import PrivateRoute from "./PrivateRoute";
import Layout from "../components/Layout";

const MachineList = lazy(() => import('../pages/MachinesCRUD/ListMachines'));
const machineEdit = lazy(() => import('../pages/MachinesCRUD/MachineForm'));

const machinesRoutes: RouteObject = {
    path: 'machines',
    element: <PrivateRoute />,
    children: [
        {
            element: <Layout />,
            children: [
                { path: "", element: <Suspense fallback={<div>Carregando...</div>}><MachineList /></Suspense> },
                // { path: "create", element: <Suspense fallback={<div>Loading...</div>}><ResourceCreate /></Suspense> },
                // { path: "edit/:id", element: <Suspense fallback={<div>Loading...</div>}><ResourceEdit /></Suspense> }
            ]
        }
    ],
};

export default machinesRoutes;
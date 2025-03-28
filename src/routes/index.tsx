import React, { lazy } from "react";
import { BrowserRouter as Router, createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/Layout";
import machinesRoutes from "./machinesRoutes";
import resourcesRoutes from "./resourcesRoutes";
import batchesRoutes from "./batchesRoutes";
import productLinesRoutes from "./productLinesRoutes";
import productTypesRoutes from "./productTypesRoutes";
import productsRoutes from "./ProductRoutes";

// Lazy-loaded pages for better performance
// const ResourcesCRUD = lazy(() => import("../pages/ResourcesCRUD"));
const Login = lazy(() => import("../pages/Login"));

const router = createBrowserRouter([
    { path: "/login", element: <Login />},
    resourcesRoutes,
    machinesRoutes,
    batchesRoutes,
    productLinesRoutes,
    productTypesRoutes,
    productsRoutes,
    {path: "*", element: <Layout />},
]);

const AppRoutes = () => <RouterProvider router={router}/>

export default AppRoutes;

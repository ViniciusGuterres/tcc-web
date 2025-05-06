import React, { lazy } from "react";
import { BrowserRouter as Router, createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/Layout";
import machinesRoutes from "./machinesRoutes";
import resourcesRoutes from "./resourcesRoutes";
import productLinesRoutes from "./productLinesRoutes";
import productTypesRoutes from "./productTypesRoutes";
import productsRoutes from "./productRoutes";
import kilnsRoutes from "./kilnsRoutes";
import batchesRoutes from "./batchesRoutes";
import glazesRoutes from "./glazesRoutes";
import homeRoute from "./homeRoute";

// Lazy-loaded pages for better performance
// const ResourcesCRUD = lazy(() => import("../pages/ResourcesCRUD"));
const Login = lazy(() => import("../pages/Login"));
const Home = lazy(() => import("../pages/Home"));

const router = createBrowserRouter([
    { path: "/login", element: <Login />},
    homeRoute,
    resourcesRoutes,
    machinesRoutes,
    batchesRoutes,
    productLinesRoutes,
    productTypesRoutes,
    productsRoutes,
    kilnsRoutes,
    glazesRoutes,
    {path: "*", element: <Layout />},
]);

const AppRoutes = () => <RouterProvider router={router}/>

export default AppRoutes;

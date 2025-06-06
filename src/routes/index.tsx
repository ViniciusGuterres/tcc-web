import React, { lazy } from "react";
import { BrowserRouter as Router, createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// Components
import Layout from "../components/Layout";

// Routes
import machinesRoutes from "./machinesRoutes";
import resourcesRoutes from "./resourcesRoutes";
import productLinesRoutes from "./productLinesRoutes";
import productTypesRoutes from "./productTypesRoutes";
import productRoutes from "./productRoutes";
import kilnsRoutes from "./kilnsRoutes";
import batchesRoutes from "./batchesRoutes";
import glazesRoutes from "./glazesRoutes";
import homeRoute from "./homeRoute";
import dryingRoomRoutes from "./dryingRoomsRoutes";

// Lazy-loaded pages for better performance
const Login = lazy(() => import("../pages/Login/Login"));

const router = createBrowserRouter([
    { path: "/login", element: <Login />},
    { path: "/", element: <Navigate to="/home" replace /> }, 
    homeRoute,
    resourcesRoutes,
    machinesRoutes,
    batchesRoutes,
    productLinesRoutes,
    productTypesRoutes,
    productRoutes,
    kilnsRoutes,
    glazesRoutes,
    dryingRoomRoutes,
    {path: "*", element: <Layout />},
]);

const AppRoutes = () => <RouterProvider router={router}/>

export default AppRoutes;
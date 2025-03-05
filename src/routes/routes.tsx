import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import PrivateRoute from "./PrivateRoute";

// Lazy-loaded pages for better performance
// const Home = lazy(() => import("../pages/Home"));
// const About = lazy(() => import("../pages/About"));
// const Dashboard = lazy(() => import("../pages/Dashboard"));
const ResourcesCRUD = lazy(() => import("../pages/ResourcesCRUD"));
const Login = lazy(() => import("../pages/Login"));
// const NotFound = lazy(() => import("../pages/NotFound"));

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Login route*/}
                <Route path="/login" element={<Login />} />

                {/* 404 Page */}
                {/* <Route path="*" element={<NotFound />} /> */}

                {/* Protected routes */}
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Layout />
                        </PrivateRoute>
                    }
                >
                    {/* <Route index element={<Home />} /> */}

                    <Route path="profile" element={<ResourcesCRUD />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;

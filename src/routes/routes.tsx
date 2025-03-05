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
            <Layout>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        {/* <Route path="/" element={<Home />} /> */}

                        {/* Resources */}
                        <Route path="/resources" element={
                            <PrivateRoute>
                                <ResourcesCRUD />
                            </PrivateRoute>}
                        />

                        {/* Protected Routes */}
                        {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}

                        {/* Authentication Route */}
                        <Route path="/login" element={<Login />} />

                        {/* 404 Page */}
                        {/* <Route path="*" element={<NotFound />} /> */}
                    </Routes>
                </Suspense>
            </Layout>
        </Router>
    );
};

export default AppRoutes;

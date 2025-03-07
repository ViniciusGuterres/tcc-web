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

                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                    <Route element={<Layout />}>

                        {/* Resources */}
                        <Route 
                            path="resources"
                            element={
                                <Suspense fallback={<div>Loading...</div>}>
                                    <ResourcesCRUD />
                                </Suspense>
                            } 
                        />


                        <Route path="inbox" element={<h1>Inbox Page</h1>} />
                        <Route path="*" element={<h1>404 Not Found</h1>} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;

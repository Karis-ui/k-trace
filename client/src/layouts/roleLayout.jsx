// src/layouts/RoleLayout.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../pages/auth/authContext";
import MainLayout from "./MainLayout";

export default function RoleLayout({ allowedRoles = [] }) {
    const { isAuthenticated, role, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
        );
    }
    if (!isAuthenticated) {
        return < Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    );
}
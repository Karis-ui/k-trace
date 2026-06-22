// src/layouts/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebars/AdminSidebar";
import AdminHeader from "../components/headers/AdminHeader";
import AdminFooter from "../components/footers/AdminFooter";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white">
      <div className="flex">
        {/* Sidebar stays fixed on the left */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-white/80 border-b border-green-100 shadow-sm">
            <AdminHeader />
          </header>

          {/* Page Content from child routes */}
          <main className="p-6 flex-1 overflow-auto">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="bg-white/80 border-t border-green-100 shadow-inner">
            <AdminFooter />
          </footer>
        </div>
      </div>
    </div>
  );
}

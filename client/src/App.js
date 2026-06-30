// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Authprovider } from "./pages/auth/authContext";
import RoleLayout from "./layouts/roleLayout";
import Footer from './components/footers/HomeFooter';

// Auth Pages
import Login from "./pages/auth/login";
import Signup from './pages/auth/signup';
import Unauthorized from "./pages/auth/Unauthorized";
import Home from "./pages/auth/home";
import ResetPassword from './pages/auth/ResetPassword';
import ForgotPassword from "./pages/auth/ForgotPassword";

import About from "./pages/about";
import Analytics from './pages/analytics';
import Contact from './pages/contact';
import CropAdvice from './pages/crop-advice';
import Forum from './pages/forum';
import Help from './pages/help';
import Learning from './pages/learning';
import Weather from './pages/weather';
import Terms from './pages/terms';
import Privacy from './pages/privacy';
import MarketPlace from './pages/marketplace';
import Notifications from "./pages/notifications";

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import Users from "./pages/Admin/Users";
import Farmers from "./pages/Admin/Farmers";
import Buyers from "./pages/Admin/Buyers";
import Inventory from "./pages/Admin/Inventory";
import Payouts from "./pages/Admin/Payouts";
import Reports from "./pages/Admin/Reports";
import Exports from "./pages/Admin/Exports";
import Settings from "./pages/Admin/Settings";
import AdminAnalytics from "./pages/Admin/Analytics";

// Drymill Pages
import DrymillDashboard from "./pages/drymill/Dashboard";
import DrymillFarmers from "./pages/drymill/Farmers";
import Grading from "./pages/drymill/Grading";
import DrymillProcessing from "./pages/drymill/Processing";
import DrymillReports from "./pages/drymill/Report";
import DrymillSettings from "./pages/drymill/Setting";

// Wetmill Pages
import WetMillDashboard from "./pages/wetmill/Dashboard";
import WetMillIntake from "./pages/wetmill/DataEntry";
import WetMillFarmers from "./pages/wetmill/Farmers";
import WetMillFermentation from "./pages/wetmill/Fermentation";
import WetMillSettings from "./pages/wetmill/Settings";

// Finance Pages
import FinanceDashboard from "./pages/finance/Dashboard";
import FinanceFarmers from "./pages/finance/Farmers";
import FinancePayouts from "./pages/finance/Payouts";
import FinanceSettings from "./pages/finance/Settings";

import FarmerProfile from "./pages/finance/FarmerProfile";

// Farmer Pages
import FarmerDashboard from "./pages/farmer/dashboard";
import FarmerDeliveries from "./pages/farmer/deliveries";
import FarmerGradings from "./pages/farmer/Gradings";
import FarmerPayouts from "./pages/farmer/Payouts";
import Profile from "./pages/farmer/profile";
import FarmerSettings from "./pages/farmer/Settings";

// Buyer Pages
import BuyerDashboard from "./pages/Buyer/Dashboard";
import BuyerCatalog from "./pages/Buyer/Catalog";
import BuyerOrders from "./pages/Buyer/Orders";
import BuyerSettings from "./pages/Buyer/Settings";


function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/terms" element={<Terms />} />
            <Route path="/about" element={<About />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/advice" element={<CropAdvice />} />
            <Route path="/help" element={<Help />} />
            <Route path="/marketplace" element={<MarketPlace />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/analytics" element={<Analytics />} />

            {/* Common Routes (All Authenticated Users) */}
            <Route element={<RoleLayout allowedRoles={['admin', 'drymill', 'wetmill', 'finance', 'farmer', 'buyer']} />}>
                <Route path="/notifications" element={<Notifications />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<RoleLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/farmers" element={<Farmers />} />
                <Route path="/admin/buyers" element={<Buyers />} />
                <Route path="/admin/inventory" element={<Inventory />} />
                <Route path="/admin/payouts" element={<Payouts />} />
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/exports" element={<Exports />} />
                <Route path="/admin/settings" element={<Settings />} />
                <Route path="/admin/stats" element={<AdminAnalytics />} />
            </Route>

            {/* Drymill Routes */}
            <Route element={<RoleLayout allowedRoles={['drymill']} />}>
                <Route path="/drymill" element={<DrymillDashboard />} />
                <Route path="/drymill/farmers" element={<DrymillFarmers />} />
                <Route path="/drymill/grading" element={<Grading />} />
                <Route path="/drymill/processing" element={<DrymillProcessing />} />
                <Route path="/drymill/reports" element={<DrymillReports />} />
                <Route path="/drymill/settings" element={<DrymillSettings />} />
                <Route path="/operator/farmers/:id" element={<FarmerProfile />} />
            </Route>

            {/* Wetmill Routes */}
            <Route element={<RoleLayout allowedRoles={['wetmill']} />}>
                <Route path="/wetmill" element={<WetMillDashboard />} />
                <Route path="/wetmill/farmers" element={<WetMillFarmers />} />
                <Route path="/wetmill/intake" element={<WetMillIntake />} />
                <Route path="/wetmill/fermentation" element={<WetMillFermentation />} />
                <Route path="/wetmill/settings" element={<WetMillSettings />} />
                <Route path="/operator/farmers/:id" element={<FarmerProfile />} />
            </Route>

            {/* Finance Routes */}
            <Route element={<RoleLayout allowedRoles={['finance']} />}>
                <Route path="/finance" element={<FinanceDashboard />} />
                <Route path="/finance/payouts" element={<FinancePayouts />} />
                <Route path="/finance/farmers" element={<FinanceFarmers />} />
                <Route path="/finance/settings" element={<FinanceSettings />} />
                <Route path="/operator/farmers/:id" element={<FarmerProfile />} />
            </Route>

            {/* Farmer Routes */}
            <Route element={<RoleLayout allowedRoles={['farmer']} />}>
                <Route path="/farmer" element={<FarmerDashboard />} />
                <Route path="/farmer/deliveries" element={<FarmerDeliveries />} />
                <Route path="/farmer/gradings" element={<FarmerGradings />} />
                <Route path="/farmer/payouts" element={<FarmerPayouts />} />
                <Route path="/farmer/settings" element={<FarmerSettings />} />
                <Route path="/farmer/profile" element={<Profile />} />
            </Route>

            {/* Buyer Routes */}
            <Route element={<RoleLayout allowedRoles={['buyer']} />}>
                <Route path="/buyer" element={<BuyerDashboard />} />
                <Route path="/buyer/orders" element={<BuyerOrders />} />
                <Route path="/buyer/catalog" element={<BuyerCatalog />} />
                <Route path="/buyer/settings" element={<BuyerSettings />} />
            </Route>

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Authprovider>
                <div className="min-h-screen flex flex-col">
                    <div className="flex-1">
                        <AppRoutes />
                    </div>
                    <Footer />
                </div>
            </Authprovider>
        </BrowserRouter>
    );
}

export default App;
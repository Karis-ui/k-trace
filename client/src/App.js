import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from "./pages/login";
import Signup from "./pages/signup";
import ProtectedRoute from "./components/PrivateRoute";

import Home from "./pages/home";
import About from "./pages/about";
import Contact from "./pages/contact";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import Help from "./pages/help";

import FarmerDashboard from "./pages/dashboard";
import Marketplace from "./pages/marketplace";
import CropAdvice from "./pages/crop-advice";
import Forum from "./pages/forum";
import Learning from "./pages/learning";
import Weather from "./pages/weather";
import Notifications from "./pages/notifications";
import Analytics from "./pages/analytics";
import Profile from "./pages/profile";
import Orders from "./pages/orders";

import AdminDashboard from "./pages/Admin/Dashboard";
import Farmers from "./pages/Admin/Farmers";
import Wetmill from "./pages/Admin/Wetmill";
import Payouts from "./pages/Admin/Payouts";
import Analytic from "./pages/Admin/Analytics";
import Users from "./pages/Admin/Users";
import Reports from "./pages/Admin/Reports";
import Inventory from "./pages/Admin/Inventory";
import Buyer from "./pages/Admin/Buyers";
import Exports from "./pages/Admin/Exports";
import Drymill from "./pages/Admin/Drymill";
import Settings from "./pages/Admin/Settings";

import DryMillDashboard from "./pages/drymill/Dashboard";
import Grading from "./pages/drymill/Grading";
import Processing from "./pages/drymill/Processing";
import Farmer from "./pages/drymill/Farmers";
import DrymillLayout from "./layouts/DrymillLayout";
import Reportss from "./pages/drymill/Report";
import Settingss from "./pages/drymill/Setting";


import BuyerDashboard from "./pages/Buyer/Dashboard";

import MDashboard from "./pages/wetmill/Dashboard";
import DataEntry from "./pages/wetmill/DataEntry";
import FarmerSearch from "./pages/wetmill/FarmerSearch";
import FarmerProfile from "./pages/wetmill/FarmerProfile";
import IntakeEntry from "./pages/wetmill/DataEntry";

import HomeLayout from "./layouts/HomeLayout";
import FarmerLayout from "./layouts/FarmerLayout";
import AdminLayout from "./layouts/AdminLayout";
import BuyerLayout from "./layouts/BuyerLayout";
import WetmillLayout from "./layouts/WetmillLayout";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        {/* -------- Public / Home -------- */}
        <Route
          path="/"
          element={
            <HomeLayout>
              <Home />
            </HomeLayout>
          }
        />
        <Route
          path="/about"
          element={
            <HomeLayout>
              <About />
            </HomeLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <HomeLayout>
              <Contact />
            </HomeLayout>
          }
        />
        <Route
          path="/privacy"
          element={
            <HomeLayout>
              <Privacy />
            </HomeLayout>
          }
        />
        <Route
          path="/terms"
          element={
            <HomeLayout>
              <Terms />
            </HomeLayout>
          }
        />
        <Route
          path="/help"
          element={
            <HomeLayout>
              <Help />
            </HomeLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* -------- Farmer -------- */}
        <Route
          path="/dashboard/farmer"
          element={
            <ProtectedRoute>
              <FarmerLayout>
                <FarmerDashboard />
              </FarmerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketplace"
          element={
            <FarmerLayout>
              <Marketplace />
            </FarmerLayout>
          }
        />
        <Route
          path="/crop-advice"
          element={
            <FarmerLayout>
              <CropAdvice />
            </FarmerLayout>
          }
        />
        <Route
          path="/forum"
          element={
            <FarmerLayout>
              <Forum />
            </FarmerLayout>
          }
        />
        <Route
          path="/learning"
          element={
            <FarmerLayout>
              <Learning />
            </FarmerLayout>
          }
        />
        <Route
          path="/weather"
          element={
            <FarmerLayout>
              <Weather />
            </FarmerLayout>
          }
        />
        <Route
          path="/notifications"
          element={
            <FarmerLayout>
              <Notifications />
            </FarmerLayout>
          }
        />
        <Route
          path="/analytics"
          element={
            <FarmerLayout>
              <Analytics />
            </FarmerLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <FarmerLayout>
              <Profile />
            </FarmerLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <FarmerLayout>
              <Orders />
            </FarmerLayout>
          }
        />

        {/* -------- Admin -------- */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="farmers" element={<Farmers />} />
          <Route path="wetmill" element={<Wetmill />} />
          <Route path="drymill" element={<Drymill />} />
          <Route path="exports" element={<Exports />} />
          <Route path="buyers" element={<Buyer />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="payouts" element={<Payouts />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<Users />} />
          <Route path="analytics" element={<Analytic />} />
          <Route path="settings" element={<Settings />} />
        </Route>


        {/* -------- Buyer -------- */}
        <Route
          path="/buyer/dashboard"
          element={
            <ProtectedRoute>
              <BuyerLayout>
                <BuyerDashboard />
              </BuyerLayout>
            </ProtectedRoute>
          }
        />


        {/* -------- Wetmill -------- */}
        <Route
          path="/wetmill/Dashboard"
          element={
            //<ProtectedRoute>
            <WetmillLayout>
              <MDashboard />
            </WetmillLayout>
            //</ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/farmers/:farmerId" element={<FarmerProfile />} />
        <Route path="/wetmill/farmer-search" element={<FarmerSearch />} />
        <Route path="/wetmill/data-entry" element={<DataEntry />} />

        <Route
          path="/intake/dataentry"
          element={
            <WetmillLayout>
              <IntakeEntry />
            </WetmillLayout>
          }
        />
        {/* -------- Drymill -------- */}
        <Route path="/drymill" element={<DrymillLayout />}>
          <Route
            path="/drymill/dashboard"
            element={
              <DryMillDashboard />
            }
          />
          <Route path="/drymill/grading" element={<Grading />} />
          <Route path="/drymill/processing" element={<Processing />} />
          <Route path="/drymill/farmers" element={<Farmer />} />
          <Route path="/drymill/reports" element={<Reportss />} />
          <Route path="/drymill/settings" element={<Settingss />} />
        </Route>


      </Routes>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />

    </Router>
  );
}

export default App;

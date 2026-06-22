import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Users, Settings, Archive, Truck, Box, DollarSign, FileText, PieChart } from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const links = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <BarChart3 className="h-5 w-5 mr-2" /> },
    { path: "/admin/farmers", label: "Farmers", icon: <Users className="h-5 w-5 mr-2" /> },
    { path: "/admin/wetmill", label: "Wet Mill", icon: <Archive className="h-5 w-5 mr-2" /> },
    { path: "/admin/drymill", label: "Dry Mill", icon: <Truck className="h-5 w-5 mr-2" /> },
    { path: "/admin/exports", label: "Exports", icon: <Box className="h-5 w-5 mr-2" /> },
    { path: "/admin/buyers", label: "Buyers", icon: <Users className="h-5 w-5 mr-2" /> },
    { path: "/admin/inventory", label: "Inventory", icon: <Box className="h-5 w-5 mr-2" /> },
    { path: "/admin/payouts", label: "Payouts", icon: <DollarSign className="h-5 w-5 mr-2" /> },
    { path: "/admin/reports", label: "Reports", icon: <FileText className="h-5 w-5 mr-2" /> },
    { path: "/admin/analytics", label: "Analytics", icon: <PieChart className="h-5 w-5 mr-2" /> },
    { path: "/admin/settings", label: "Settings", icon: <Settings className="h-5 w-5 mr-2" /> },
  ];

  return (
    <div className="w-64 bg-green-50 shadow-lg p-4 flex flex-col gap-3 min-h-screen">
      {links.map((link) => (
        <motion.div
          key={link.path}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to={link.path}
            className={`flex items-center px-4 py-3 rounded-xl shadow-sm transition-all duration-200
              ${isActive(link.path)
                ? "bg-green-200 text-green-800 shadow-lg"
                : "bg-white/70 text-green-700 hover:bg-green-100"
              }`}
          >
            {link.icon}
            <span className="font-medium">{link.label}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminSidebar;

import { Link, useLocation } from "react-router-dom";
import { Home, Coffee, Package, BarChart3, Users, Settings } from "lucide-react";

const DrymillSidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const links = [
    { path: "/drymill/dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { path: "/drymill/grading", label: "Grading", icon: <Coffee className="h-5 w-5" /> },
    { path: "/drymill/processing", label: "Processing", icon: <Package className="h-5 w-5" /> },
    { path: "/drymill/farmers", label: "Farmers", icon: <Users className="h-5 w-5" /> },
    { path: "/drymill/reports", label: "Reports", icon: <BarChart3 className="h-5 w-5" /> },
    { path: "/drymill/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <aside className="w-64 bg-green-50 border-r border-green-200 shadow-inner min-h-screen p-4 hidden md:flex flex-col space-y-2 fixed left-0 top-16 bottom-0 overflow-y-auto">
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`flex items-center space-x-3 p-3 rounded-md transition-all duration-200 ${
            isActive(link.path)
              ? "bg-green-600 text-white shadow-md"
              : "text-green-700 hover:bg-green-100 hover:shadow-sm"
          }`}
        >
          {link.icon}
          <span className="font-medium">{link.label}</span>
        </Link>
      ))}
    </aside>
  );
};

export default DrymillSidebar;

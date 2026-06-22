import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, BarChart3, Package, Users, Coffee, Settings } from "lucide-react";
import AgriSmartLogo from "../../assets/1.jpg";

const DrymillHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const navItems = [
    { path: "/drymill/dashboard", label: "Dashboard", icon: <BarChart3 className="h-4 w-4 mr-1" /> },
    { path: "/drymill/processing", label: "Processing", icon: <Package className="h-4 w-4 mr-1" /> },
    { path: "/drymill/farmers", label: "Farmers", icon: <Users className="h-4 w-4 mr-1" /> },
    { path: "/drymill/grading", label: "Grading", icon: <Coffee className="h-4 w-4 mr-1" /> },
    { path: "/drymill/settings", label: "Settings", icon: <Settings className="h-4 w-4 mr-1" /> },
  ];

  return (
    <header className="bg-green-50 border-b border-green-200 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <Link to="/" className="flex items-center space-x-3">
          <img src={AgriSmartLogo} alt="Logo" className="h-12 w-12 rounded-md shadow-sm" />
          <span className="text-2xl font-bold text-green-800 tracking-wide">KahawaTrace Drymill</span>
        </Link>
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center font-medium pb-1 border-b-2 transition-all duration-200 ${
                isActive(item.path)
                  ? "text-green-700 border-green-700"
                  : "text-green-600 border-transparent hover:text-green-800 hover:border-green-500"
              }`}
            >
              {item.icon}{item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center transition-all duration-200 shadow-sm"
        >
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </button>
      </div>
    </header>
  );
};

export default DrymillHeader;

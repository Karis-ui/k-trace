import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Users, Settings, BarChart3, Bell } from "lucide-react";
import AgriSmartLogo from "../../assets/1.jpg";

const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <BarChart3 className="h-4 w-4 mr-1" /> },
    { path: "/admin/users", label: "Users", icon: <Users className="h-4 w-4 mr-1" /> },
    { path: "/admin/settings", label: "Settings", icon: <Settings className="h-4 w-4 mr-1" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-green-200 shadow-sm">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center space-x-3">
          <img src={AgriSmartLogo} alt="Logo" className="h-10 w-10 rounded-lg shadow-sm" />
          <span className="text-xl font-extrabold text-green-800 tracking-tight">
            KahawaTrace Admin
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-1 rounded-md transition ${
                isActive(item.path)
                  ? "bg-green-100 text-green-800 font-semibold"
                  : "text-green-600 hover:text-green-800 hover:bg-green-50"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right-side controls */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative text-green-700 hover:text-green-900">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full hover:bg-green-200">
              <img
                src={AgriSmartLogo}
                alt="Admin avatar"
                className="h-6 w-6 rounded-full border border-green-300"
              />
              <span className="text-sm font-medium">Admin</span>
            </button>

            {/* Dropdown on hover */}
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-green-100 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition">
              <Link
                to="/admin/settings"
                className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="inline-block h-4 w-4 mr-1" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

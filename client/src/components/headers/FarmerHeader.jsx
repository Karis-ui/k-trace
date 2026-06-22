import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Menu, Sprout, User, LogOut } from "lucide-react";
import "../all.css";
import AgriSmartLogo from "../../assets/1.jpg";
import AppSidebar from "../navbar";
import Profile from "../../pages/profile";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;
  const isDashboard = location.pathname === "/dashboard";

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/crop-advice", label: "Advice" },
    { path: "/marketplace", label: "Market" },
    { path: "/notifications", label: "Notifications" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <AppSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <header className="bg-green-50 backdrop-blur-sm shadow-soft sticky top-0 z-40 border-b border-green-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Sidebar Toggle */}
              <button
                className="p-2 rounded-lg hover:bg-green-100 transition-colors"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle sidebar"
              >
                <Menu className="h-6 w-6 text-green-700" />
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3 ml-2 group">
                <img
                  src={AgriSmartLogo}
                  alt="AgriSmart Logo"
                  className="h-14 w-14 object-cover rounded-md hidden md:block"
                />
                <span className="text-2xl font-roboto-slab font-bold text-green-800">
                  KahawaTrace
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`font-roboto font-medium transition-all duration-200 pb-1 border-b-2 ${
                      isActive(item.path)
                        ? "text-green-700 border-green-700"
                        : "text-green-600 border-transparent hover:text-green-800 hover:border-green-500"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Desktop Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                {isDashboard ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center bg-green-600 hover:bg-green-700 text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-700 hover:text-green-900 hover:bg-green-100"
                    >
                      <Link to="/profile">
                      <User className="h-4 w-4 mr-2" /> Profile
                      </Link>
                    </Button>

                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-green-100 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6 text-green-700" />
              </button>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Header;

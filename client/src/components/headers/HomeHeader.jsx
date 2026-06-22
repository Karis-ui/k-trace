// src/components/headers/HomeHeader.jsx
import { Link, useLocation } from "react-router-dom";
import AgriSmartLogo from "../../assets/1.jpg";

const HomeHeader = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/features", label: "Features" },
    { path: "/contact", label: "Contact" },
    { path: "/login", label: "Login" },
  ];

  return (
    <header className="bg-green-50 border-b border-green-200 shadow-soft sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <Link to="/" className="flex items-center space-x-3">
          <img src={AgriSmartLogo} alt="Logo" className="h-12 w-12 object-cover rounded-md" />
          <span className="text-2xl font-bold text-green-800">KahawaTrace</span>
        </Link>
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-medium pb-1 border-b-2 ${
                isActive(item.path)
                  ? "text-green-700 border-green-700"
                  : "text-green-600 border-transparent hover:text-green-800 hover:border-green-500"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default HomeHeader;

import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home, User, ShoppingCart, MessageSquare, BookOpen,
  CloudSun, Bell, Settings, Phone, Info, Shield,
  FileText, BarChart3, X
} from "lucide-react";

const mainNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Marketplace", url: "/marketplace", icon: ShoppingCart },
  { title: "Orders", url: "/orders", icon: FileText },
  { title: "Community Forum", url: "/forum", icon: MessageSquare },
  { title: "Learning Hub", url: "/learning", icon: BookOpen },
  { title: "Weather & Alerts", url: "/weather", icon: CloudSun },
  { title: "Notifications", url: "/notifications", icon: Bell },
];

const managementItems = [
  { title: "Admin Panel", url: "/admin", icon: Settings },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const supportItems = [
  { title: "Contact Us", url: "/contact", icon: Phone },
  { title: "About Us", url: "/about", icon: Info },
  { title: "Privacy Policy", url: "/privacy", icon: Shield },
];

export default function AppSidebar({ isOpen, onClose }) {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-green-50 shadow-lg z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Close button */}
      <div className="flex justify-end p-4">
        <button onClick={onClose}>
          <X className="h-6 w-6 text-green-700 hover:text-green-900" />
        </button>
      </div>

      {/* Scrollable Nav */}
      <div className="h-[calc(100%-3rem)] overflow-y-auto px-4 pb-6">
        <h2 className="text-lg font-bold text-green-800 mb-4">Main Navigation</h2>
        {mainNavItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center gap-2 py-2 px-3 rounded-md transition-colors
              ${isActive
                ? "bg-green-200 text-green-800 font-semibold"
                : "text-green-700 hover:bg-green-100 hover:text-green-900"}`
            }
            onClick={onClose}
          >
            <item.icon className="w-5 h-5" />
            {item.title}
          </NavLink>
        ))}

        <h2 className="text-lg font-bold text-green-800 mt-6 mb-4">Management</h2>
        {managementItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center gap-2 py-2 px-3 rounded-md transition-colors
              ${isActive
                ? "bg-green-200 text-green-800 font-semibold"
                : "text-green-700 hover:bg-green-100 hover:text-green-900"}`
            }
            onClick={onClose}
          >
            <item.icon className="w-5 h-5" />
            {item.title}
          </NavLink>
        ))}

        <h2 className="text-lg font-bold text-green-800 mt-6 mb-4">Support</h2>
        {supportItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center gap-2 py-2 px-3 rounded-md transition-colors
              ${isActive
                ? "bg-green-200 text-green-800 font-semibold"
                : "text-green-700 hover:bg-green-100 hover:text-green-900"}`
            }
            onClick={onClose}
          >
            <item.icon className="w-5 h-5" />
            {item.title}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

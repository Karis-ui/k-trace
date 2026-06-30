// src/layouts/MainLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Correct import
import {
    Menu, X, ChevronDown, Bell, User, LogOut,
    Settings, Home, Coffee, Package, DollarSign,
    Users, ShoppingCart, Award, Leaf, Droplets,
    TrendingUp, FileText, BarChart3, Shield,
    Sun, Moon, ChevronLeft, ChevronRight
} from "lucide-react";
import { useAuth } from "../pages/auth/authContext";

export default function MainLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const navigate = useNavigate();
    const location = useLocation();
    const { user, role, logout } = useAuth();

    useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    const getNavItems = () => {
        const commonItems = [
            { path: '/notifications', label: 'Notifications', icon: Bell },
        ];

        const roleNav = {
            admin: [
                { path: '/admin', label: 'Dashboard', icon: Home },
                { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
                { path: '/admin/users', label: 'Users', icon: Users },
                { path: '/admin/farmers', label: 'Farmers', icon: Leaf },
                { path: '/admin/buyers', label: 'Buyers', icon: ShoppingCart },
                { path: '/admin/inventory', label: 'Inventory', icon: Package },
                { path: '/admin/payouts', label: 'Payouts', icon: DollarSign },
                { path: '/admin/reports', label: 'Reports', icon: FileText },
                { path: '/admin/exports', label: 'Exports', icon: TrendingUp },
                { path: '/admin/settings', label: 'Settings', icon: Settings },
            ],
            drymill: [
                { path: '/drymill', label: 'Dashboard', icon: Home },
                { path: '/drymill/farmers', label: 'Farmers', icon: Leaf },
                { path: '/drymill/grading', label: 'Grading', icon: Award },
                { path: '/drymill/processing', label: 'Processing', icon: Package },
                { path: '/drymill/reports', label: 'Reports', icon: FileText },
                { path: '/drymill/settings', label: 'Settings', icon: Settings },
            ],
            wetmill: [
                { path: '/wetmill', label: 'Dashboard', icon: Home },
                { path: '/wetmill/farmers', label: 'Farmers', icon: Leaf },
                { path: '/wetmill/intake', label: 'Record Intake', icon: Droplets },
                { path: '/wetmill/fermentation', label: 'Fermentation', icon: Package },
                { path: '/wetmill/settings', label: 'Settings', icon: Settings },
            ],
            finance: [
                { path: '/finance', label: 'Dashboard', icon: Home },
                { path: '/finance/payouts', label: 'Payouts', icon: DollarSign },
                { path: '/finance/farmers', label: 'Farmers', icon: Leaf },
                { path: '/finance/settings', label: 'Settings', icon: Settings },
            ],
            farmer: [
                { path: '/farmer', label: 'Dashboard', icon: Home },
                { path: '/farmer/deliveries', label: 'My Deliveries', icon: Package },
                { path: '/farmer/gradings', label: 'My Gradings', icon: Award },
                { path: '/farmer/payouts', label: 'My Payouts', icon: DollarSign },
                { path: '/farmer/settings', label: 'Settings', icon: Settings },
            ],
            buyer: [
                { path: '/buyer', label: 'Dashboard', icon: Home },
                { path: '/buyer/catalog', label: 'Catalog', icon: Coffee },
                { path: '/buyer/orders', label: 'My Orders', icon: ShoppingCart },
                { path: '/buyer/settings', label: 'Settings', icon: Settings },
            ]
        };

        return [...(roleNav[role] || []), ...commonItems];
    };

    const navItems = getNavItems();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getRoleColor = () => {
        const colors = {
            admin: 'green',
            drymill: 'emerald',
            wetmill: 'blue',
            finance: 'purple',
            farmer: 'amber',
            buyer: 'cyan'
        };
        return colors[role] || 'gray';
    };

    const color = getRoleColor();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'
                    } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <Coffee className={`h-8 w-8 text-${color}-600`} />
                        {sidebarOpen && (
                            <span className="text-xl font-bold text-gray-800 dark:text-white">
                                K-Trace
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="hidden lg:block text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </button>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    setMobileOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive
                                    ? `bg-${color}-50 text-${color}-700 dark:bg-${color}-900/20 dark:text-${color}-400`
                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    } ${!sidebarOpen && 'justify-center'}`}
                            >
                                <Icon className={`h-5 w-5 ${!sidebarOpen && 'h-6 w-6'}`} />
                                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between h-16 px-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                                {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            </button>

                            {/* Notifications */}
                            <button
                                onClick={() => navigate('/notifications')}
                                className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                        <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                    </div>
                                    {sidebarOpen && (
                                        <>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {user?.name || 'User'}
                                            </span>
                                            <ChevronDown className="h-4 w-4 text-gray-500" />
                                        </>
                                    )}
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role}</p>
                                        </div>
                                        <button
                                            onClick={() => { navigate('/settings'); setDropdownOpen(false); }}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            <Settings className="h-4 w-4" /> Settings
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                                        >
                                            <LogOut className="h-4 w-4" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
// src/pages/buyer/BuyerOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
    ShoppingCart, RefreshCw, Search, Eye, X,
    Filter, Package, DollarSign, Calendar, Clock
} from "lucide-react";

export default function BuyerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [summary, setSummary] = useState({
        total: 0,
        totalSpent: 0,
        pending: 0,
        delivered: 0
    });

    const fetchOrders = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `https://zesty-ktrace.up.railway.app/api/buyer/orders?status=${statusFilter}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setOrders(res.data.data.orders || []);
                setSummary(res.data.data.summary || {});
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError(err.response?.data?.error || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(fetchOrders, 300);
        return () => clearTimeout(debounce);
    }, [statusFilter]);

    const cancelOrder = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `https://zesty-ktrace.up.railway.app/api/buyer/orders/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchOrders();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Failed to cancel order");
        }
    };

    const filteredOrders = orders.filter(o =>
        o._id?.toLowerCase().includes(search.toLowerCase()) ||
        o.lotId?.lotId?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800",
            processing: "bg-blue-100 text-blue-800",
            shipped: "bg-purple-100 text-purple-800",
            delivered: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800"
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
                    <ShoppingCart className="h-7 w-7 text-blue-600" /> My Orders
                </h2>
                <button
                    onClick={fetchOrders}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                >
                    <RefreshCw className="h-4 w-4" /> Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/90 rounded-xl p-4 shadow">
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-700">{summary.total || 0}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-green-600">Total Spent</p>
                    <p className="text-2xl font-bold text-green-700">${summary.totalSpent?.toFixed(2) || 0}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-yellow-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-700">{summary.pending || 0}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-green-600">Delivered</p>
                    <p className="text-2xl font-bold text-green-700">{summary.delivered || 0}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white/90 p-4 rounded-xl shadow flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <Search className="text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search by order or lot ID..."
                        className="flex-1 border-none focus:outline-none bg-transparent"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1 rounded-lg text-sm transition ${statusFilter === status
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {error && <p className="text-red-600 font-semibold">{error}</p>}

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredOrders.map((order) => (
                    <motion.div
                        key={order._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/90 backdrop-blur-lg rounded-2xl p-5 shadow-lg hover:shadow-xl transition cursor-pointer"
                        onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order)}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-semibold text-blue-900">Order #{order._id?.slice(-6) || "N/A"}</p>
                                <p className="text-sm text-blue-700">Lot: {order.lotId?.lotId || "N/A"}</p>
                                <p className="text-sm text-blue-500">{order.quantity || 0}kg @ ${order.unitPrice || 0}/kg</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                {order.status || 'Pending'}
                            </span>
                        </div>

                        <div className="mt-3 flex justify-between items-center">
                            <p className="text-xl font-bold text-green-700">${order.totalPrice?.toFixed(2) || 0}</p>
                            <p className="text-xs text-gray-400">
                                {new Date(order.createdAt || order.orderDate).toLocaleDateString()}
                            </p>
                        </div>

                        {selectedOrder === order._id && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-3 pt-3 border-t border-blue-100"
                            >
                                <p className="text-sm text-gray-600">Grade: {order.lotId?.grade || "N/A"}</p>
                                <p className="text-sm text-gray-600">Station: {order.lotId?.station || "N/A"}</p>
                                {order.status === 'pending' && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); cancelOrder(order._id); }}
                                        className="mt-2 bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition"
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>

            {filteredOrders.length === 0 && (
                <div className="text-center py-12 bg-white/80 rounded-2xl">
                    <p className="text-gray-500 text-lg">No orders found</p>
                </div>
            )}
        </div>
    );
}
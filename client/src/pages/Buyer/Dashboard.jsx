// src/pages/buyer/BuyerDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, CartesianGrid
} from "recharts";
import {
  ShoppingCart, DollarSign, Package, Clock, CheckCircle,
  TrendingUp, RefreshCw, Star, Award, Coffee
} from "lucide-react";

const COLORS = ["#2F855A", "#68D391", "#81E6D9", "#F6E05E", "#ED8936", "#38A169", "#4FD1C5"];

export default function BuyerDashboard() {
  const [dashboard, setDashboard] = useState({
    profile: {},
    summary: {
      totalOrders: 0,
      totalSpent: 0,
      totalQuantity: 0,
      averageOrderValue: 0,
      availableLots: 0
    },
    rating: {
      rating: "New Buyer",
      level: 1,
      badge: "🛒 New Buyer",
      score: 0
    },
    orderStatus: {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    },
    monthlyTrend: [],
    gradePurchases: [],
    stationPurchases: [],
    recentOrders: [],
    catalog: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        "http://localhost:5000/api/buyer/dashboard",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setDashboard(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching buyer dashboard:", err);
      setError(err.response?.data?.error || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
          <h3 className="text-red-700 font-bold text-lg mb-2">⚠️ Error Loading Dashboard</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchDashboard}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const summary = dashboard.summary || {};
  const orderStatus = dashboard.orderStatus || {};
  const monthlyTrend = dashboard.monthlyTrend || [];
  const gradePurchases = dashboard.gradePurchases || [];
  const stationPurchases = dashboard.stationPurchases || [];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
            <Coffee className="h-7 w-7 text-blue-600" /> Buyer Dashboard
          </h2>
          <p className="text-blue-600">Welcome back, {dashboard.profile?.name || "Buyer"}!</p>
        </div>
        <button
          onClick={fetchDashboard}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-blue-50">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-3xl">{dashboard.rating?.badge?.split(' ')[0] || '🛒'}</span>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-bold text-blue-900">{dashboard.profile?.name}</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                {dashboard.profile?.company || "Individual"}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                {dashboard.rating?.rating}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <p className="text-sm text-blue-700">📧 {dashboard.profile?.email || "N/A"}</p>
              <p className="text-sm text-blue-700">📱 {dashboard.profile?.phone || "N/A"}</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-500">Buyer Score</p>
            <p className="text-3xl font-bold text-blue-700">{dashboard.rating?.score || 0}%</p>
            <p className="text-xs text-gray-400">Level {dashboard.rating?.level || 1}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/90 rounded-xl p-4 shadow">
          <p className="text-xs text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-blue-700">{summary.totalOrders || 0}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow">
          <p className="text-xs text-green-600">Total Spent</p>
          <p className="text-2xl font-bold text-green-700">${summary.totalSpent?.toFixed(2) || 0}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 shadow">
          <p className="text-xs text-purple-600">Total Quantity</p>
          <p className="text-2xl font-bold text-purple-700">{summary.totalQuantity?.toFixed(2) || 0}kg</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 shadow">
          <p className="text-xs text-amber-600">Avg Order Value</p>
          <p className="text-2xl font-bold text-amber-700">${summary.averageOrderValue?.toFixed(2) || 0}</p>
        </div>
      </div>

      {/* Order Status */}
      <div className="grid grid-cols-5 gap-3">
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <p className="text-xs text-yellow-600">Pending</p>
          <p className="text-xl font-bold text-yellow-700">{orderStatus.pending || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-xs text-blue-600">Processing</p>
          <p className="text-xl font-bold text-blue-700">{orderStatus.processing || 0}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <p className="text-xs text-purple-600">Shipped</p>
          <p className="text-xl font-bold text-purple-700">{orderStatus.shipped || 0}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-xs text-green-600">Delivered</p>
          <p className="text-xl font-bold text-green-700">{orderStatus.delivered || 0}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <p className="text-xs text-red-600">Cancelled</p>
          <p className="text-xl font-bold text-red-700">{orderStatus.cancelled || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-blue-50">
          <h4 className="text-lg font-semibold text-blue-800 mb-4">Monthly Spending Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#2F855A" />
              <YAxis stroke="#2F855A" />
              <Tooltip />
              <Line type="monotone" dataKey="spent" stroke="#2F855A" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-blue-50">
          <h4 className="text-lg font-semibold text-blue-800 mb-4">Purchases by Grade</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={gradePurchases}
                dataKey="spent"
                nameKey="grade"
                outerRadius={80}
                label={({ grade, percent }) => `${grade} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {gradePurchases.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-blue-50">
        <h4 className="text-lg font-semibold text-blue-800 mb-4">Recent Orders</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-blue-100 text-blue-900">
              <tr>
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">Lot</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {(dashboard.recentOrders || []).map((order) => (
                <tr key={order._id} className="border-b border-blue-50 hover:bg-blue-50 transition">
                  <td className="px-4 py-2 text-sm">{order._id?.slice(-6) || "N/A"}</td>
                  <td className="px-4 py-2 text-sm">{order.lotId?.lotId || "N/A"}</td>
                  <td className="px-4 py-2 text-sm">{order.quantity || 0}kg</td>
                  <td className="px-4 py-2 text-sm font-bold text-green-700">${order.totalPrice?.toFixed(2) || 0}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                      }`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {(dashboard.recentOrders || []).length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Catalog */}
      {dashboard.catalog?.length > 0 && (
        <div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-blue-50">
          <h4 className="text-lg font-semibold text-blue-800 mb-4">Available Lots</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {(dashboard.catalog || []).slice(0, 8).map((lot) => (
              <div key={lot._id} className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="font-medium text-blue-800">{lot.lotId || "Lot"}</p>
                <p className="text-sm text-blue-600">{lot.grade || "N/A"}</p>
                <p className="text-sm font-bold text-green-700">${lot.unitPrice || 0}/kg</p>
                <p className="text-xs text-gray-500">{lot.availableQuantity || 0}kg available</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
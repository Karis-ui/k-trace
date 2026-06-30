// src/pages/wetmill/WetMillDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, CartesianGrid
} from "recharts";
import { RefreshCw, Droplets, Users, DollarSign, Package, Thermometer, TrendingUp, Clock } from "lucide-react";

const COLORS = ["#2F855A", "#68D391", "#81E6D9", "#F6E05E", "#ED8936", "#38A169", "#4FD1C5"];

export default function WetMillDashboard() {
  const [dashboard, setDashboard] = useState({
    dashboard: {
      totalContributions: 0,
      totalWetMilk: 0,
      averageMoisture: 0,
      totalPayouts: 0,
      totalFarmers: 0,
      totalIntakes: 0,
      fermentationRate: 0
    },
    fermentationStatus: {
      completed: 0,
      inProgress: 0,
      pending: 0,
      total: 0
    },
    recent: {
      contributions: [],
      fermentations: [],
      payouts: [],
      intakes: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        "http://localhost:5000/api/operator/wetmill/dashboard",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setDashboard(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching wetmill dashboard:", err);
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-blue-800 font-semibold">Loading dashboard...</p>
        </div>
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

  const stats = dashboard.dashboard || {};
  const fermentation = dashboard.fermentationStatus || {};

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
          💧 Wet Mill Dashboard
        </h2>
        <button
          onClick={fetchDashboard}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/90 rounded-2xl p-5 shadow-lg border border-blue-50"
        >
          <div className="flex items-center gap-3">
            <Droplets className="h-6 w-6 text-blue-600" />
            <div>
              <h4 className="text-xs font-semibold text-gray-600">Total Wet Milk</h4>
              <p className="text-2xl font-bold text-blue-700">{stats.totalWetMilk?.toFixed(2) || 0}kg</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/90 rounded-2xl p-5 shadow-lg border border-blue-50"
        >
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-green-600" />
            <div>
              <h4 className="text-xs font-semibold text-gray-600">Total Farmers</h4>
              <p className="text-2xl font-bold text-green-700">{stats.totalFarmers || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/90 rounded-2xl p-5 shadow-lg border border-blue-50"
        >
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-purple-600" />
            <div>
              <h4 className="text-xs font-semibold text-gray-600">Total Intakes</h4>
              <p className="text-2xl font-bold text-purple-700">{stats.totalIntakes || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/90 rounded-2xl p-5 shadow-lg border border-blue-50"
        >
          <div className="flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-green-700" />
            <div>
              <h4 className="text-xs font-semibold text-gray-600">Total Payouts</h4>
              <p className="text-2xl font-bold text-green-700">${stats.totalPayouts?.toFixed(2) || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/90 rounded-2xl p-5 shadow-lg border border-blue-50"
        >
          <div className="flex items-center gap-3">
            <Thermometer className="h-6 w-6 text-amber-600" />
            <div>
              <h4 className="text-xs font-semibold text-gray-600">Avg Moisture</h4>
              <p className="text-2xl font-bold text-amber-700">{stats.averageMoisture?.toFixed(2) || 0}%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/90 rounded-2xl p-5 shadow-lg border border-blue-50"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-teal-600" />
            <div>
              <h4 className="text-xs font-semibold text-gray-600">Fermentation Rate</h4>
              <p className="text-2xl font-bold text-teal-700">{stats.fermentationRate || 0}%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fermentation Status */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-xs text-green-600">Completed</p>
          <p className="text-2xl font-bold text-green-700">{fermentation.completed || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-xs text-blue-600">In Progress</p>
          <p className="text-2xl font-bold text-blue-700">{fermentation.inProgress || 0}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <p className="text-xs text-yellow-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{fermentation.pending || 0}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-700">{fermentation.total || 0}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contributions */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white/90 rounded-2xl p-6 shadow-lg border border-blue-50"
        >
          <h4 className="text-lg font-semibold text-blue-800 mb-4">Recent Contributions</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {(dashboard.recent?.contributions || []).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-800">{item.farmerId?.name || "Unknown"}</p>
                  <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="font-bold text-blue-600">${item.amount?.toFixed(2) || 0}</p>
              </div>
            ))}
            {(dashboard.recent?.contributions || []).length === 0 && (
              <p className="text-center text-gray-500 py-4">No recent contributions</p>
            )}
          </div>
        </motion.div>

        {/* Recent Fermentations */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white/90 rounded-2xl p-6 shadow-lg border border-blue-50"
        >
          <h4 className="text-lg font-semibold text-blue-800 mb-4">Recent Fermentations</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {(dashboard.recent?.fermentations || []).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-800">Batch {item.batchNumber || item._id}</p>
                  <p className="text-xs text-gray-500">{item.farmerId?.name || "Unknown"}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'completed' ? 'bg-green-100 text-green-800' :
                  item.status === 'inProgress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                  {item.status || 'Pending'}
                </span>
              </div>
            ))}
            {(dashboard.recent?.fermentations || []).length === 0 && (
              <p className="text-center text-gray-500 py-4">No recent fermentations</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
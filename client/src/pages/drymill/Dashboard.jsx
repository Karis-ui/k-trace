// src/pages/drymill/DryMillDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  CartesianGrid
} from "recharts";
import { motion } from "framer-motion";
import { RefreshCw, Package, CheckCircle, Clock, DollarSign, Users, TrendingUp } from "lucide-react";

const COLORS = ["#2F855A", "#68D391", "#81E6D9", "#F6E05E", "#ED8936", "#38A169", "#4FD1C5"];

export default function DryMillDashboard() {
  const [dashboard, setDashboard] = useState({
    dashboard: {
      totalLots: 0,
      gradedLots: 0,
      pendingGrading: 0,
      totalPayout: 0,
      totalFarmers: 0,
      totalDryMilk: 0,
      gradingCompletionRate: 0
    },
    trends: {
      intakeTrend: [],
      gradeDistribution: []
    },
    processing: {
      pending: 0,
      inProgress: 0,
      completed: 0
    },
    recentLots: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        "http://localhost:5000/api/operator/drymill/dashboard",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setDashboard(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching dry mill dashboard:", err);
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
      <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-green-800 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
          <h3 className="text-red-700 font-bold text-lg mb-2">⚠️ Error Loading Dashboard</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchDashboard}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboard.dashboard || {};
  const trends = dashboard.trends || {};
  const processing = dashboard.processing || {};

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-green-900 flex items-center gap-2">
          ☕ Dry Mill Dashboard
        </h2>
        <button
          onClick={fetchDashboard}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/90 rounded-2xl p-5 shadow-lg border border-green-50"
        >
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-green-600" />
            <div>
              <h4 className="text-xs font-semibold text-gray-600">Total Lots</h4>
              <p className="text-2xl font-bold text-green-800">{stats.totalLots || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/90 rounded-2xl p-5 shadow-lg border border-green-50"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-blue-600" />
            <div>
              <h4 className="text-xs font-semibold text-gray-600">Graded Lots</h4>
              <p className="text-2xl font-bold text-blue-700">{stats.gradedLots || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/90 rounded-2xl p-5 shadow-lg border border-green-50"
        >
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-amber-500" />
            <div>
              <h4 className="text-xs font-semibold text-gray-600">Pending Grading</h4>
              <p className="text-2xl font-bold text-amber-500">{stats.pendingGrading || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/90 rounded-2xl p-5 shadow-lg border border-green-50"
        >
          <div className="flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-green-700" />
            <div>
              <h4 className="text-xs font-semibold text-gray-600">Total Payout</h4>
              <p className="text-2xl font-bold text-green-700">
                ${(stats.totalPayout || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/90 rounded-2xl p-5 shadow-lg border border-green-50"
        >
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-purple-600" />
            <div>
              <h4 className="text-xs font-semibold text-gray-600">Total Farmers</h4>
              <p className="text-2xl font-bold text-purple-700">{stats.totalFarmers || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/90 rounded-2xl p-5 shadow-lg border border-green-50"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-teal-600" />
            <div>
              <h4 className="text-xs font-semibold text-gray-600">Completion Rate</h4>
              <p className="text-2xl font-bold text-teal-700">{stats.gradingCompletionRate || 0}%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Processing Status */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <p className="text-xs text-yellow-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{processing.pending || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-xs text-blue-600">In Progress</p>
          <p className="text-2xl font-bold text-blue-700">{processing.inProgress || 0}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-xs text-green-600">Completed</p>
          <p className="text-2xl font-bold text-green-700">{processing.completed || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50 lg:col-span-2"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4">Intake Trend</h4>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trends.intakeTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="_id" stroke="#2F855A" />
              <YAxis stroke="#2F855A" />
              <Tooltip />
              <Line type="monotone" dataKey="totalWeight" stroke="#2F855A" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4">Grade Distribution</h4>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                dataKey="count"
                data={trends.gradeDistribution || []}
                nameKey="grade"
                outerRadius={90}
                label={({ grade, percent }) => `${grade} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {(trends.gradeDistribution || []).map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Lots Table */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50"
      >
        <h4 className="text-lg font-semibold text-green-800 mb-4">Recent Lots</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/80 rounded-2xl">
            <thead className="bg-green-100 text-green-900">
              <tr>
                <th className="px-4 py-2 text-left">Lot ID</th>
                <th className="px-4 py-2 text-left">Farmer</th>
                <th className="px-4 py-2 text-left">Weight</th>
                <th className="px-4 py-2 text-left">Grade</th>
                <th className="px-4 py-2 text-left">Score</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {(dashboard.recentLots || []).map((lot, idx) => (
                <motion.tr
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer hover:bg-green-50 transition-colors"
                >
                  <td className="border px-4 py-2 text-sm">{lot._id || lot.lotId || "N/A"}</td>
                  <td className="border px-4 py-2 text-sm">{lot.farmerId?.name || "Unknown"}</td>
                  <td className="border px-4 py-2 text-sm">{lot.weight || 0}kg</td>
                  <td className="border px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${lot.grade === 'specialty' ? 'bg-green-100 text-green-800' :
                        lot.grade === 'premium' ? 'bg-blue-100 text-blue-800' :
                          lot.grade === 'commercial' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                      }`}>
                      {lot.grade || 'Pending'}
                    </span>
                  </td>
                  <td className="border px-4 py-2 text-sm">{lot.score || lot.cuppingScore || '-'}</td>
                  <td className="border px-4 py-2 text-sm">{new Date(lot.createdAt || lot.date).toLocaleDateString()}</td>
                </motion.tr>
              ))}
              {(dashboard.recentLots || []).length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">No recent lots</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
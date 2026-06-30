// src/pages/admin/Analytics.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, CartesianGrid
} from "recharts";

const COLORS = ["#2F855A", "#68D391", "#81E6D9", "#F6E05E", "#ED8936", "#38A169", "#4FD1C5"];

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalFarmers: 0,
    totalIntake: 0,
    pendingPayouts: 0,
    activeWetmills: 0,
    totalPayouts: 0,
    intakeTrend: [],
    lotDistribution: [],
    topWetmills: [],
    gradeDistribution: {},
    qualityMetrics: {},
    defectAnalysis: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("monthly");

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 60000);
    return () => clearInterval(interval);
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      const response = await axios.get(
        `http://localhost:5000/api/admin/analytics?timeframe=${timeframe}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const data = response.data.data;
        setAnalytics({
          totalFarmers: data.totalFarmers || 0,
          totalIntake: data.totalIntake || 0,
          pendingPayouts: data.pendingPayouts || 0,
          activeWetmills: data.activeWetmills || 0,
          totalPayouts: data.totalPayouts || 0,
          intakeTrend: data.intakeTrend || [],
          lotDistribution: Object.entries(data.lotDistribution || {}).map(([key, value]) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value: value
          })),
          topWetmills: data.topWetmills || [],
          gradeDistribution: data.gradeDistribution || {},
          qualityMetrics: data.qualityMetrics || {},
          defectAnalysis: data.defectAnalysis || {}
        });
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err.response?.data?.error || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-green-800 font-semibold">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
          <h3 className="text-red-700 font-bold text-lg mb-2">⚠️ Error Loading Analytics</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getGradeChartData = () => {
    const distribution = analytics.gradeDistribution || {};
    return Object.entries(distribution).map(([grade, data]) => ({
      name: grade,
      count: data.count || data,
      percentage: data.percentage || 0
    }));
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-green-900">Analytics Dashboard</h2>
        <div className="flex items-center gap-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 bg-white border border-green-200 rounded-lg text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Farmers", value: analytics.totalFarmers, color: "green", icon: "👨‍🌾" },
          { label: "Total Intake (kg)", value: analytics.totalIntake.toLocaleString(), color: "blue", icon: "📦" },
          { label: "Pending Payouts", value: analytics.pendingPayouts, color: "amber", icon: "💰" },
          { label: "Active Wetmills", value: analytics.activeWetmills, color: "teal", icon: "🏭" },
          { label: "Total Payouts", value: `$${analytics.totalPayouts.toFixed(2)}`, color: "purple", icon: "💵" },
          { label: "Avg Grade", value: analytics.qualityMetrics?.averageScore?.toFixed(1) || "N/A", color: "indigo", icon: "⭐" },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.03, boxShadow: "0px 15px 30px rgba(0,0,0,0.12)" }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow border border-green-50 transition-all duration-300 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.label}</p>
                <p className={`text-2xl font-bold text-${card.color}-700 mt-1`}>{card.value}</p>
              </div>
              <span className="text-2xl">{card.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intake Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-green-50"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span>📈</span> Intake Trend
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.intakeTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="period" stroke="#2F855A" tick={{ fontSize: 12 }} />
              <YAxis stroke="#2F855A" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#2F855A" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Lot Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-green-50"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span>🎯</span> Lot Distribution
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analytics.lotDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {analytics.lotDistribution.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Grade Distribution & Top Wetmills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-green-50"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span>⭐</span> Grade Distribution
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={getGradeChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#2F855A" tick={{ fontSize: 12 }} />
              <YAxis stroke="#2F855A" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#68D391" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-green-50"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span>🏆</span> Top Wetmills
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.topWetmills}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#2F855A" tick={{ fontSize: 12 }} />
              <YAxis stroke="#2F855A" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="averageScore" fill="#4FD1C5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Quality Metrics & Defect Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-green-50"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span>📊</span> Quality Metrics
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">Avg Score</p>
              <p className="text-2xl font-bold text-green-700">{analytics.qualityMetrics?.averageScore?.toFixed(2) || 0}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">Specialty Rate</p>
              <p className="text-2xl font-bold text-blue-700">{analytics.qualityMetrics?.specialtyRate?.toFixed(1) || 0}%</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">Max Score</p>
              <p className="text-2xl font-bold text-purple-700">{analytics.qualityMetrics?.maxScore?.toFixed(2) || 0}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">Total Gradings</p>
              <p className="text-2xl font-bold text-amber-700">{analytics.qualityMetrics?.totalGradings || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-green-50"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span>🔍</span> Defect Analysis
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Defects</span>
              <span className="font-bold text-red-600">{analytics.defectAnalysis?.totalDefects || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Defect Rate</span>
              <span className="font-bold text-amber-600">{analytics.defectAnalysis?.defectRate?.toFixed(1) || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Defects/Lot</span>
              <span className="font-bold text-purple-600">{analytics.defectAnalysis?.averageDefectsPerLot?.toFixed(2) || 0}</span>
            </div>
            {analytics.defectAnalysis?.topDefects?.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Top Defects:</p>
                <div className="flex flex-wrap gap-2">
                  {analytics.defectAnalysis.topDefects.slice(0, 3).map((defect, idx) => (
                    <span key={idx} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs">
                      {defect.type}: {defect.count}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="text-center text-sm text-gray-400 mt-8">
        Last updated: {new Date().toLocaleString()}
        <span className="mx-2">•</span>
        Auto-refresh every 60 seconds
      </div>
    </div>
  );
}
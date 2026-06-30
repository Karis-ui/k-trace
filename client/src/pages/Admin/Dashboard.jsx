// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, CartesianGrid
} from "recharts";

const COLORS = ["#2F855A", "#68D391", "#81E6D9", "#F6E05E", "#ED8936", "#38A169", "#4FD1C5", "#48BB78", "#276749"];

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState({
    totalFarmers: 0,
    totalIntake: 0,
    pendingPayouts: 0,
    activeWetmills: 0,
    totalPayouts: 0,
    totalDryMilk: 0,
    totalWetMilk: 0,
    intakeTrend: [],
    lotDistribution: [],
    gradeDistribution: {},
    topWetmills: [],
    farmerPerformance: [],
    qualityMetrics: {},
    defectAnalysis: {},
    monthlyProduction: [],
    summary: {}
  });

  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("monthly");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [timeframe]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `http://localhost:5000/api/admin/dashboard?timeframe=${timeframe}`
      );

      if (response.data.success) {
        const data = response.data.data;

        // Transform data to match the frontend structure
        setDashboard({
          // Core metrics
          totalFarmers: data.totalFarmers || 0,
          totalIntake: data.totalIntake || 0,
          pendingPayouts: data.pendingPayouts || 0,
          activeWetmills: data.activeWetmills || 0,
          totalPayouts: data.totalPayouts || 0,
          totalDryMilk: data.totalDryMilk || 0,
          totalWetMilk: data.totalWetMilk || 0,

          // Trends and distributions
          intakeTrend: data.intakeTrend || [],
          lotDistribution: Object.entries(data.lotDistribution || {}).map(([key, value]) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value: value
          })),

          // Grade distribution (for bar chart)
          gradeDistribution: data.gradeDistribution || {},

          // Top performers
          topWetmills: data.topWetmills || [],

          // Farmer performance
          farmerPerformance: data.farmerPerformance || [],

          // Quality metrics
          qualityMetrics: data.qualityMetrics || {},

          // Defect analysis
          defectAnalysis: data.defectAnalysis || {},

          // Monthly production
          monthlyProduction: data.monthlyProduction || [],

          // Summary stats
          summary: data.summary || {},

          // Additional useful data
          totalDeliveries: data.summary?.totalDeliveries || 0,
          totalGradings: data.summary?.totalGradings || 0,
          averageGrade: data.summary?.averageGrade || 0,
          completionRate: data.summary?.completionRate || 0
        });
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.error || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Format data for charts
  const getPayoutTrendData = () => {
    if (!dashboard.intakeTrend || dashboard.intakeTrend.length === 0) {
      return [{ month: "No Data", payouts: 0 }];
    }
    return dashboard.intakeTrend.map(item => ({
      month: item.period,
      payouts: item.weight || 0
    }));
  };

  const getGradeChartData = () => {
    const distribution = dashboard.gradeDistribution || {};
    return Object.entries(distribution).map(([grade, data]) => ({
      name: grade,
      count: data.count || data,
      percentage: data.percentage || 0
    }));
  };

  const getTopFarmers = () => {
    if (!dashboard.farmerPerformance || dashboard.farmerPerformance.length === 0) {
      return [];
    }
    return dashboard.farmerPerformance
      .sort((a, b) => b.totalWeight - a.totalWeight)
      .slice(0, 5)
      .map(farmer => ({
        name: farmer.name || farmer.farmerId,
        value: farmer.totalWeight || 0
      }));
  };

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

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-green-900">Admin Dashboard</h2>
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
            onClick={fetchDashboard}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {[
          {
            label: "Total Farmers",
            value: dashboard.totalFarmers,
            color: "green",
            icon: "👨‍🌾",
            subtitle: `${dashboard.summary?.totalFarmers || 0} active`
          },
          {
            label: "Total Intake (kg)",
            value: dashboard.totalIntake.toLocaleString(),
            color: "blue",
            icon: "📦",
            subtitle: `${dashboard.totalDeliveries || 0} deliveries`
          },
          {
            label: "Pending Payouts",
            value: dashboard.pendingPayouts,
            color: "amber",
            icon: "💰",
            subtitle: `$${dashboard.totalPayouts.toFixed(2)} total`
          },
          {
            label: "Active Wetmills",
            value: dashboard.activeWetmills,
            color: "teal",
            icon: "🏭",
            subtitle: `${dashboard.summary?.activeDrymills || 0} drymills`
          },
          {
            label: "Average Grade",
            value: dashboard.averageGrade.toFixed(1),
            color: "purple",
            icon: "⭐",
            subtitle: `${dashboard.totalGradings || 0} gradings`
          },
          {
            label: "Completion Rate",
            value: `${dashboard.completionRate || 0}%`,
            color: "indigo",
            icon: "📊",
            subtitle: `${dashboard.totalGradings}/${dashboard.totalDeliveries}`
          },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.03, boxShadow: "0px 15px 30px rgba(0,0,0,0.12)" }}
            className={`bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow border border-green-50 transition-all duration-300 hover:shadow-xl`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.label}</p>
                <p className={`text-2xl font-bold text-${card.color}-700 mt-1`}>{card.value}</p>
                <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
              </div>
              <span className="text-2xl">{card.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Intake Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-green-50 transition hover:shadow-lg"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span>📈</span> Intake Trend (kg)
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dashboard.intakeTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="period" stroke="#2F855A" tick={{ fontSize: 12 }} />
              <YAxis stroke="#2F855A" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0'
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#2F855A"
                strokeWidth={3}
                dot={{ r: 4, fill: "#2F855A" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Lot Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-green-50 transition hover:shadow-lg"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span>🎯</span> Lot Distribution
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dashboard.lotDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {dashboard.lotDistribution.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Grade Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-green-50 transition hover:shadow-lg"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span>⭐</span> Grade Distribution
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={getGradeChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#2F855A" tick={{ fontSize: 12 }} />
              <YAxis stroke="#2F855A" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0'
                }}
              />
              <Bar dataKey="count" fill="#68D391" radius={[6, 6, 0, 0]}>
                {getGradeChartData().map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Second Row of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Wetmills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-green-50 transition hover:shadow-lg"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span>🏆</span> Top Wetmills (by performance)
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dashboard.topWetmills}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#2F855A" tick={{ fontSize: 12 }} />
              <YAxis stroke="#2F855A" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0'
                }}
              />
              <Bar dataKey="averageScore" fill="#68D391" radius={[6, 6, 0, 0]}>
                {dashboard.topWetmills.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Farmers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-green-50 transition hover:shadow-lg"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span>👨‍🌾</span> Top Farmers (by volume)
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={getTopFarmers()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#2F855A" tick={{ fontSize: 12 }} />
              <YAxis stroke="#2F855A" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0'
                }}
              />
              <Bar dataKey="value" fill="#4FD1C5" radius={[6, 6, 0, 0]}>
                {getTopFarmers().map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[(idx + 3) % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Quality Metrics & Defect Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-green-50"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span>📊</span> Quality Metrics
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-green-700">
                {dashboard.qualityMetrics?.averageScore?.toFixed(2) || 0}
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">Specialty Rate</p>
              <p className="text-2xl font-bold text-blue-700">
                {dashboard.qualityMetrics?.specialtyRate?.toFixed(1) || 0}%
              </p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">Max Score</p>
              <p className="text-2xl font-bold text-purple-700">
                {dashboard.qualityMetrics?.maxScore?.toFixed(2) || 0}
              </p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">Total Gradings</p>
              <p className="text-2xl font-bold text-amber-700">
                {dashboard.qualityMetrics?.totalGradings || 0}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-green-50"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span>🔍</span> Defect Analysis
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Defects</span>
              <span className="font-bold text-red-600">
                {dashboard.defectAnalysis?.totalDefects || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Defect Rate</span>
              <span className="font-bold text-amber-600">
                {dashboard.defectAnalysis?.defectRate?.toFixed(1) || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Defects/Lot</span>
              <span className="font-bold text-purple-600">
                {dashboard.defectAnalysis?.averageDefectsPerLot?.toFixed(2) || 0}
              </span>
            </div>
            {dashboard.defectAnalysis?.topDefects?.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Top Defects:</p>
                <div className="flex flex-wrap gap-2">
                  {dashboard.defectAnalysis.topDefects.slice(0, 3).map((defect, idx) => (
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

      {/* Footer */}
      <div className="text-center text-sm text-gray-400 mt-8">
        Last updated: {new Date().toLocaleString()}
        <span className="mx-2">•</span>
        Auto-refresh every 60 seconds
        <span className="mx-2">•</span>
        Timeframe: {timeframe}
      </div>
    </div>
  );
}

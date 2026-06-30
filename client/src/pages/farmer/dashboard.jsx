// src/pages/farmer/FarmerDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, CartesianGrid
} from "recharts";
import {
  Package, DollarSign, Award, TrendingUp, Clock,
  CheckCircle, RefreshCw, Leaf, Calendar, Phone, MapPin
} from "lucide-react";

const COLORS = ["#2F855A", "#68D391", "#81E6D9", "#F6E05E", "#ED8936", "#38A169", "#4FD1C5"];

export default function FarmerDashboard() {
  const [dashboard, setDashboard] = useState({
    profile: {},
    summary: {
      totalDeliveries: 0,
      totalWeight: 0,
      totalGradings: 0,
      totalPayouts: 0,
      averageGrade: 0,
      pendingPayouts: 0
    },
    performance: {
      rating: "New Farmer",
      level: 1,
      badge: "🌱 New Farmer",
      nextLevel: "20 points to Rising",
      score: 0
    },
    gradeDistribution: {},
    payoutStatus: {},
    monthlyTrend: [],
    recent: {
      deliveries: [],
      gradings: [],
      payouts: []
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
        "http://localhost:5000/api/farmer/dashboard",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setDashboard(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching farmer dashboard:", err);
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

  const profile = dashboard.profile || {};
  const summary = dashboard.summary || {};
  const performance = dashboard.performance || {};
  const gradeDist = dashboard.gradeDistribution || {};
  const payoutStatus = dashboard.payoutStatus || {};
  const monthlyTrend = dashboard.monthlyTrend || [];
  const recent = dashboard.recent || {};

  const gradeChartData = Object.entries(gradeDist).map(([grade, count]) => ({
    name: grade || 'Pending',
    value: count
  }));

  const payoutChartData = Object.entries(payoutStatus).map(([status, count]) => ({
    name: status,
    value: count
  }));

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-green-900 flex items-center gap-2">
            <Leaf className="h-7 w-7 text-green-600" /> My Dashboard
          </h2>
          <p className="text-green-600">Welcome back, {profile.name || "Farmer"}!</p>
        </div>
        <button
          onClick={fetchDashboard}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-3xl">{performance.badge?.split(' ')[0] || '🌱'}</span>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-bold text-green-900">{profile.name}</h3>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                {profile.farmerId}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                {performance.rating}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
              <p className="text-sm text-green-700 flex items-center gap-2">
                <Phone className="h-4 w-4" /> {profile.phone || "N/A"}
              </p>
              <p className="text-sm text-green-700 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {profile.station || "N/A"}
              </p>
              <p className="text-sm text-green-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Member since {new Date(profile.registeredAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-500">Performance Score</p>
            <p className="text-3xl font-bold text-green-700">{performance.score || 0}%</p>
            <p className="text-xs text-gray-400">{performance.nextLevel}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white/90 rounded-xl p-4 shadow">
          <p className="text-xs text-gray-500">Deliveries</p>
          <p className="text-2xl font-bold text-blue-700">{summary.totalDeliveries || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow">
          <p className="text-xs text-blue-600">Total Weight</p>
          <p className="text-2xl font-bold text-blue-700">{summary.totalWeight?.toFixed(2) || 0}kg</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 shadow">
          <p className="text-xs text-purple-600">Gradings</p>
          <p className="text-2xl font-bold text-purple-700">{summary.totalGradings || 0}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 shadow">
          <p className="text-xs text-amber-600">Avg Grade</p>
          <p className="text-2xl font-bold text-amber-700">{summary.averageGrade?.toFixed(2) || 0}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow">
          <p className="text-xs text-green-600">Total Payouts</p>
          <p className="text-2xl font-bold text-green-700">${summary.totalPayouts?.toFixed(2) || 0}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 shadow">
          <p className="text-xs text-yellow-600">Pending Payouts</p>
          <p className="text-2xl font-bold text-yellow-700">{summary.pendingPayouts || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50">
          <h4 className="text-lg font-semibold text-green-800 mb-4">Monthly Delivery Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#2F855A" />
              <YAxis stroke="#2F855A" />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#2F855A" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50">
          <h4 className="text-lg font-semibold text-green-800 mb-4">Grade Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={gradeChartData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {gradeChartData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50">
          <h4 className="text-lg font-semibold text-green-800 mb-4">Recent Deliveries</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {(recent.deliveries || []).slice(0, 5).map((delivery) => (
              <div key={delivery._id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-800">{delivery.weight}kg</p>
                  <p className="text-xs text-gray-500">{new Date(delivery.date || delivery.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-xs text-green-600">{delivery.moistureContent || "N/A"}% moisture</span>
              </div>
            ))}
            {(recent.deliveries || []).length === 0 && (
              <p className="text-center text-gray-500 py-4">No deliveries yet</p>
            )}
          </div>
        </div>

        <div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50">
          <h4 className="text-lg font-semibold text-green-800 mb-4">Recent Gradings</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {(recent.gradings || []).slice(0, 5).map((grading) => (
              <div key={grading._id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-800">{grading.grade || 'Pending'}</p>
                  <p className="text-xs text-gray-500">{new Date(grading.date || grading.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-sm font-bold text-green-700">{grading.cuppingScore || 'N/A'}</span>
              </div>
            ))}
            {(recent.gradings || []).length === 0 && (
              <p className="text-center text-gray-500 py-4">No gradings yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
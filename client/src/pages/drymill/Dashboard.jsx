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
  Legend
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#2F855A", "#68D391", "#81E6D9", "#F6E05E", "#ED8936", "#38A169", "#4FD1C5"];

export default function DryMillDashboard() {
  const [stats, setStats] = useState({
    totalLots: 0,
    gradedLots: 0,
    pendingGrading: 0,
    totalPayout: 0,
    intakeTrend: [],
    lotDistribution: [],
    topFarmers: [],
    recentLots: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/drymill/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dry mill dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-6 text-green-800">Loading dashboard...</div>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      <h2 className="text-3xl font-bold text-green-900 mb-6">☕ Dry Mill Dashboard</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50 hover:scale-105 transition-transform" whileHover={{ scale: 1.05 }}>
          <h4 className="text-sm font-semibold text-gray-600">Total Lots</h4>
          <p className="text-2xl font-bold text-green-800">{stats.totalLots}</p>
        </motion.div>

        <motion.div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50 hover:scale-105 transition-transform" whileHover={{ scale: 1.05 }}>
          <h4 className="text-sm font-semibold text-gray-600">Graded Lots</h4>
          <p className="text-2xl font-bold text-green-800">{stats.gradedLots}</p>
        </motion.div>

        <motion.div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50 hover:scale-105 transition-transform" whileHover={{ scale: 1.05 }}>
          <h4 className="text-sm font-semibold text-gray-600">Pending Grading</h4>
          <p className="text-2xl font-bold text-amber-500">{stats.pendingGrading}</p>
        </motion.div>

        <motion.div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50 hover:scale-105 transition-transform" whileHover={{ scale: 1.05 }}>
          <h4 className="text-sm font-semibold text-gray-600">Total Payout (KSh)</h4>
          <p className="text-2xl font-bold text-green-700">{stats.totalPayout.toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50 lg:col-span-2" whileHover={{ scale: 1.02 }}>
          <h4 className="text-lg font-semibold text-green-800 mb-4">Intake Trend</h4>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.intakeTrend}>
              <XAxis dataKey="month" stroke="#2F855A" />
              <YAxis stroke="#2F855A" />
              <Tooltip />
              <Line type="monotone" dataKey="intake" stroke="#2F855A" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50" whileHover={{ scale: 1.02 }}>
          <h4 className="text-lg font-semibold text-green-800 mb-4">Lot Grade Distribution</h4>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie dataKey="value" data={stats.lotDistribution} outerRadius={90} label>
                {stats.lotDistribution.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Farmers */}
      <motion.div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50" whileHover={{ scale: 1.02 }}>
        <h4 className="text-lg font-semibold text-green-800 mb-4">Top Farmers (by volume)</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stats.topFarmers}>
            <XAxis dataKey="name" stroke="#2F855A" />
            <YAxis stroke="#2F855A" />
            <Tooltip />
            <Bar dataKey="volume" fill="#68D391" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Graded Lots Table */}
      <motion.div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50" whileHover={{ scale: 1.01 }}>
        <h4 className="text-lg font-semibold text-green-800 mb-4">Recent Graded Lots</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/80 rounded-2xl">
            <thead className="bg-green-100 text-green-900">
              <tr>
                <th className="px-4 py-2">Lot ID</th>
                <th className="px-4 py-2">Grade</th>
                <th className="px-4 py-2">Cupping Score</th>
                <th className="px-4 py-2">Farmer</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentLots.map((lot) => (
                <motion.tr key={lot.lotId} whileHover={{ scale: 1.02 }} className="cursor-pointer hover:bg-green-50 transition-colors">
                  <td className="border px-4 py-2">{lot.lotId}</td>
                  <td className="border px-4 py-2">{lot.grade}</td>
                  <td className="border px-4 py-2">{lot.cuppingScore?.total}</td>
                  <td className="border px-4 py-2">{lot.farmerName}</td>
                  <td className="border px-4 py-2">{new Date(lot.date).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

// src/pages/admin/Analytic.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";

const COLORS = ["#2F855A", "#68D391", "#81E6D9", "#F6E05E", "#ED8936", "#38A169", "#4FD1C5"];

export default function Analytic() {
  const [analytics, setAnalytics] = useState({
    totalFarmers: 0,
    totalIntake: 0,
    pendingPayouts: 0,
    activeWetmills: 0,
    intakeTrend: [],
    lotDistribution: [],
    topWetmills: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/analytics");
        setAnalytics(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 60000); // refresh every 60s for live effect
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-6 text-green-800 font-semibold">Loading analytics...</div>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      <h2 className="text-3xl font-bold text-green-900 mb-6">Analytics Dashboard</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/90 rounded-2xl p-6 shadow border border-green-50 hover:shadow-lg transition">
          <h4 className="text-sm font-semibold text-gray-600">Total Farmers</h4>
          <p className="text-2xl font-bold text-green-800">{analytics.totalFarmers}</p>
        </div>
        <div className="bg-white/90 rounded-2xl p-6 shadow border border-green-50 hover:shadow-lg transition">
          <h4 className="text-sm font-semibold text-gray-600">Total Cherry (kg)</h4>
          <p className="text-2xl font-bold text-green-800">{analytics.totalIntake}</p>
        </div>
        <div className="bg-white/90 rounded-2xl p-6 shadow border border-green-50 hover:shadow-lg transition">
          <h4 className="text-sm font-semibold text-gray-600">Pending Payouts</h4>
          <p className="text-2xl font-bold text-amber-500">{analytics.pendingPayouts}</p>
        </div>
        <div className="bg-white/90 rounded-2xl p-6 shadow border border-green-50 hover:shadow-lg transition">
          <h4 className="text-sm font-semibold text-gray-600">Active Wetmills</h4>
          <p className="text-2xl font-bold text-green-700">{analytics.activeWetmills}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intake Trend */}
        <div className="bg-white/90 rounded-2xl p-6 shadow border border-green-50 hover:shadow-lg transition">
          <h4 className="text-lg font-semibold text-green-800 mb-4">Intake Trend (kg over time)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.intakeTrend}>
              <XAxis dataKey="month" stroke="#2F855A" />
              <YAxis stroke="#2F855A" />
              <Tooltip />
              <Line type="monotone" dataKey="intake" stroke="#2F855A" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Lot Distribution */}
        <div className="bg-white/90 rounded-2xl p-6 shadow border border-green-50 hover:shadow-lg transition">
          <h4 className="text-lg font-semibold text-green-800 mb-4">Lot Distribution by Wetmill</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={analytics.lotDistribution}
                outerRadius={100}
                label
              >
                {analytics.lotDistribution.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Wetmills Bar Chart */}
      <div className="bg-white/90 rounded-2xl p-6 shadow border border-green-50 hover:shadow-lg transition">
        <h4 className="text-lg font-semibold text-green-800 mb-4">Top Wetmills (by volume)</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.topWetmills}>
            <XAxis dataKey="wetmill" stroke="#2F855A" />
            <YAxis stroke="#2F855A" />
            <Tooltip />
            <Bar dataKey="volume" fill="#68D391" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

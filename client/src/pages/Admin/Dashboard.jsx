// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";

const COLORS = ["#2F855A", "#68D391", "#81E6D9", "#F6E05E", "#ED8936", "#38A169", "#4FD1C5"];

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState({
    totalFarmers: 0,
    totalCherry: 0,
    pendingPayouts: 0,
    totalWetmills: 0,
    totalDrymills: 0,
    intakeTrend: [],
    regionDistribution: [],
    topFarmers: [],
    topWetmills: [],
    payoutTrend: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [farmersRes, intakesRes, payoutsRes, wetmillsRes, drymillsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/farmers/count"),
          axios.get("http://localhost:5000/api/intakes/summary"),
          axios.get("http://localhost:5000/api/payouts/pending"),
          axios.get("http://localhost:5000/api/wetmills/count"),
          axios.get("http://localhost:5000/api/drymills/count")
        ]);

        const intakeTrend = intakesRes.data.map(i => ({ month: i.month, intake: i.totalWeight }));
        const regionDistribution = intakesRes.data.reduce((acc, i) => {
          i.regions.forEach(r => {
            const existing = acc.find(e => e.name === r.name);
            if (existing) existing.value += r.value;
            else acc.push({ name: r.name, value: r.value });
          });
          return acc;
        }, []);

        const topFarmers = intakesRes.data.reduce((acc, i) => {
          i.farmers.forEach(f => {
            const existing = acc.find(e => e.name === f.name);
            if (existing) existing.value += f.value;
            else acc.push({ name: f.name, value: f.value });
          });
          return acc.sort((a, b) => b.value - a.value).slice(0, 5);
        }, []);

        const topWetmills = intakesRes.data.reduce((acc, i) => {
          const existing = acc.find(e => e.name === i.wetmill);
          if (existing) existing.value += i.totalWeight;
          else acc.push({ name: i.wetmill, value: i.totalWeight });
          return acc.sort((a, b) => b.value - a.value).slice(0, 5);
        }, []);

        const payoutTrend = payoutsRes.data.monthly.map(m => ({ month: m.month, payouts: m.count }));

        setDashboard({
          totalFarmers: farmersRes.data.count,
          totalCherry: intakesRes.data.reduce((sum, i) => sum + i.totalWeight, 0),
          pendingPayouts: payoutsRes.data.count,
          totalWetmills: wetmillsRes.data.count,
          totalDrymills: drymillsRes.data.count,
          intakeTrend,
          regionDistribution,
          topFarmers,
          topWetmills,
          payoutTrend
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    const interval = setInterval(fetchDashboard, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-6 text-green-800 font-semibold">Loading dashboard...</div>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      <h2 className="text-3xl font-bold text-green-900 mb-6">Admin Dashboard</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[
          { label: "Total Farmers", value: dashboard.totalFarmers, color: "green" },
          { label: "Total Cherry (kg)", value: dashboard.totalCherry, color: "green" },
          { label: "Pending Payouts", value: dashboard.pendingPayouts, color: "amber" },
          { label: "Total Wetmills", value: dashboard.totalWetmills, color: "teal" },
          { label: "Total Drymills", value: dashboard.totalDrymills, color: "blue" },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03, boxShadow: "0px 15px 30px rgba(0,0,0,0.12)" }}
            className={`bg-white/80 rounded-2xl p-6 shadow border border-green-50 transition-colors duration-300`}
          >
            <h4 className="text-sm font-semibold text-gray-600">{card.label}</h4>
            <p className={`text-2xl font-bold text-${card.color}-700`}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Intake Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 rounded-2xl p-6 shadow border border-green-50 transition hover:shadow-lg"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4">Intake Trend (kg)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dashboard.intakeTrend}>
              <XAxis dataKey="month" stroke="#2F855A" />
              <YAxis stroke="#2F855A" />
              <Tooltip />
              <Line type="monotone" dataKey="intake" stroke="#2F855A" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Payout Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 rounded-2xl p-6 shadow border border-green-50 transition hover:shadow-lg"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4">Payout Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dashboard.payoutTrend}>
              <XAxis dataKey="month" stroke="#2F855A" />
              <YAxis stroke="#2F855A" />
              <Tooltip />
              <Line type="monotone" dataKey="payouts" stroke="#38A169" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Region Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 rounded-2xl p-6 shadow border border-green-50 transition hover:shadow-lg"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4">Region Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                dataKey="value"
                data={dashboard.regionDistribution}
                outerRadius={90}
                label
              >
                {dashboard.regionDistribution.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Wetmills & Farmers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 rounded-2xl p-6 shadow border border-green-50 transition hover:shadow-lg"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4">Top Wetmills (by volume)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dashboard.topWetmills}>
              <XAxis dataKey="name" stroke="#2F855A" />
              <YAxis stroke="#2F855A" />
              <Tooltip />
              <Bar dataKey="value" fill="#68D391" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 rounded-2xl p-6 shadow border border-green-50 transition hover:shadow-lg"
        >
          <h4 className="text-lg font-semibold text-green-800 mb-4">Top Farmers (by volume)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dashboard.topFarmers}>
              <XAxis dataKey="name" stroke="#2F855A" />
              <YAxis stroke="#2F855A" />
              <Tooltip />
              <Bar dataKey="value" fill="#4FD1C5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

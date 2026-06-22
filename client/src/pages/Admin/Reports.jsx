// src/pages/admin/Reports.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";

const COLORS = ["#2F855A", "#68D391", "#81E6D9", "#F6E05E", "#ED8936", "#38A169", "#4FD1C5"];

export default function Reports() {
  const [stats, setStats] = useState({
    intakeTrend: [],
    lotDistribution: [],
    topFarmers: [],
    wetmillContribution: [],
    exportVolumes: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/reports");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="p-6 text-green-800">Loading reports...</div>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      <h2 className="text-3xl font-bold text-green-900 mb-6">Reports Overview</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/90 rounded-2xl p-6 shadow border border-green-50">
          <h4 className="text-lg font-semibold text-green-800 mb-4">Intake Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.intakeTrend}>
              <XAxis dataKey="month" stroke="#2F855A"/>
              <YAxis stroke="#2F855A"/>
              <Tooltip/>
              <Line type="monotone" dataKey="intake" stroke="#2F855A" strokeWidth={3} dot={{ r: 3 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/90 rounded-2xl p-6 shadow border border-green-50">
          <h4 className="text-lg font-semibold text-green-800 mb-4">Lot Distribution by Wetmill</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie dataKey="value" data={stats.lotDistribution} outerRadius={90} label>
                {stats.lotDistribution.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip/>
              <Legend/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/90 rounded-2xl p-6 shadow border border-green-50">
          <h4 className="text-lg font-semibold text-green-800 mb-4">Top Farmers (by volume)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.topFarmers}>
              <XAxis dataKey="farmer" stroke="#2F855A"/>
              <YAxis stroke="#2F855A"/>
              <Tooltip/>
              <Bar dataKey="value" fill="#68D391" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/90 rounded-2xl p-6 shadow border border-green-50">
          <h4 className="text-lg font-semibold text-green-800 mb-4">Wetmill Contribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie dataKey="value" data={stats.wetmillContribution} outerRadius={90} label>
                {stats.wetmillContribution.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip/>
              <Legend/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/90 rounded-2xl p-6 shadow border border-green-50 lg:col-span-2">
          <h4 className="text-lg font-semibold text-green-800 mb-4">Export Volumes</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.exportVolumes}>
              <XAxis dataKey="month" stroke="#2F855A"/>
              <YAxis stroke="#2F855A"/>
              <Tooltip/>
              <Bar dataKey="volume" fill="#38A169" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

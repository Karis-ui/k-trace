// src/pages/admin/Wetmill.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, RefreshCw, Droplet, TrendingUp, Activity } from "lucide-react";

export default function Wetmill() {
  const [wetmills, setWetmills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedWetmill, setSelectedWetmill] = useState(null);
  const [summary, setSummary] = useState({
    total: 0,
    totalWetMilk: 0,
    totalContributions: 0,
    averageMoisture: 0
  });

  const fetchWetmills = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/admin/wetmill/analytics`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setWetmills(res.data.data.wetmills || []);
        setSummary(res.data.data.summary || {});
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to fetch wetmills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWetmills();
  }, []);

  const filteredWetmills = wetmills.filter(wm =>
    wm.name?.toLowerCase().includes(search.toLowerCase()) ||
    wm.station?.toLowerCase().includes(search.toLowerCase())
  );

  const getMoistureStatus = (moisture) => {
    if (moisture >= 10 && moisture <= 12) return { label: "Optimal", color: "bg-green-100 text-green-800" };
    if (moisture > 12 && moisture <= 14) return { label: "Acceptable", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Critical", color: "bg-red-100 text-red-800" };
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-green-900">Wetmills</h2>
        <button
          onClick={fetchWetmills}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/90 rounded-xl p-4 shadow">
          <p className="text-sm text-gray-500">Total Wetmills</p>
          <p className="text-2xl font-bold text-green-700">{summary.total || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow">
          <p className="text-sm text-blue-600">Total Wet Milk (kg)</p>
          <p className="text-2xl font-bold text-blue-700">{summary.totalWetMilk?.toFixed(2) || 0}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 shadow">
          <p className="text-sm text-purple-600">Total Contributions</p>
          <p className="text-2xl font-bold text-purple-700">{summary.totalContributions?.toFixed(2) || 0}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 shadow">
          <p className="text-sm text-amber-600">Avg Moisture</p>
          <p className="text-2xl font-bold text-amber-700">{summary.averageMoisture?.toFixed(2) || 0}%</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/90 p-4 rounded-xl shadow flex items-center gap-3">
        <Search className="text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by name or station..."
          className="flex-1 border-none focus:outline-none bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="text-sm text-gray-500">{filteredWetmills.length} wetmills</span>
      </div>

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Wetmills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWetmills.map((wm) => {
          const moistureStatus = getMoistureStatus(wm.averageMoisture);
          return (
            <motion.div
              key={wm.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-5 shadow-lg hover:shadow-xl transition cursor-pointer"
              onClick={() => setSelectedWetmill(selectedWetmill === wm.id ? null : wm)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-lg text-green-900">{wm.name}</p>
                  <p className="text-sm text-green-600">Station: {wm.station}</p>
                  <p className="text-sm text-green-500">ID: {wm.id}</p>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                  Active
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-sm bg-green-50 rounded-lg p-3">
                <div>
                  <p className="text-gray-500">Wet Milk</p>
                  <p className="font-bold text-blue-600">{wm.totalWetMilk?.toFixed(2) || 0}kg</p>
                </div>
                <div>
                  <p className="text-gray-500">Contributions</p>
                  <p className="font-bold text-purple-600">${wm.totalContributions?.toFixed(2) || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500">Moisture</p>
                  <p className={`font-bold ${moistureStatus.color}`}>{wm.averageMoisture?.toFixed(2) || 0}%</p>
                </div>
              </div>

              {/* Expanded details */}
              {selectedWetmill === wm.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 pt-3 border-t border-green-100"
                >
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-green-50 rounded p-2">
                      <p className="text-gray-500">Fermentation Rate</p>
                      <p className="font-bold text-green-700">{wm.completionRate || 0}%</p>
                    </div>
                    <div className="bg-blue-50 rounded p-2">
                      <p className="text-gray-500">Moisture Status</p>
                      <p className={`font-bold ${moistureStatus.color}`}>{moistureStatus.label}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {filteredWetmills.length === 0 && (
        <div className="text-center py-12 bg-white/80 rounded-2xl">
          <p className="text-gray-500 text-lg">No wetmills found</p>
        </div>
      )}
    </div>
  );
}
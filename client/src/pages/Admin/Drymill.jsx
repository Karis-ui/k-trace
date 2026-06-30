// src/pages/admin/Drymill.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, RefreshCw, Activity, Package, TrendingUp } from "lucide-react";

export default function Drymill() {
  const [drymills, setDrymills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDrymill, setSelectedDrymill] = useState(null);
  const [summary, setSummary] = useState({
    total: 0,
    totalDryMilk: 0,
    totalGradings: 0,
    averageGrade: 0
  });

  const fetchDrymills = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/admin/drymill/analytics`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setDrymills(res.data.data.drymills || []);
        setSummary(res.data.data.summary || {});
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to fetch drymills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrymills();
  }, []);

  const filteredDrymills = drymills.filter(dm =>
    dm.name?.toLowerCase().includes(search.toLowerCase()) ||
    dm.station?.toLowerCase().includes(search.toLowerCase())
  );

  const getProcessingStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      inProgress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
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
        <h2 className="text-3xl font-bold text-green-900">Drymills</h2>
        <button
          onClick={fetchDrymills}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/90 rounded-xl p-4 shadow">
          <p className="text-sm text-gray-500">Total Drymills</p>
          <p className="text-2xl font-bold text-green-700">{summary.total || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow">
          <p className="text-sm text-blue-600">Total Dry Milk (kg)</p>
          <p className="text-2xl font-bold text-blue-700">{summary.totalDryMilk?.toFixed(2) || 0}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 shadow">
          <p className="text-sm text-purple-600">Total Gradings</p>
          <p className="text-2xl font-bold text-purple-700">{summary.totalGradings || 0}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 shadow">
          <p className="text-sm text-amber-600">Average Grade</p>
          <p className="text-2xl font-bold text-amber-700">{summary.averageGrade?.toFixed(2) || 0}</p>
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
        <span className="text-sm text-gray-500">{filteredDrymills.length} drymills</span>
      </div>

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Drymills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDrymills.map((dm) => (
          <motion.div
            key={dm.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-5 shadow-lg hover:shadow-xl transition cursor-pointer"
            onClick={() => setSelectedDrymill(selectedDrymill === dm.id ? null : dm)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-lg text-green-900">{dm.name}</p>
                <p className="text-sm text-green-600">Station: {dm.station}</p>
                <p className="text-sm text-green-500">ID: {dm.id}</p>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                Active
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-sm bg-green-50 rounded-lg p-3">
              <div>
                <p className="text-gray-500">Dry Milk</p>
                <p className="font-bold text-blue-600">{dm.totalDryMilk?.toFixed(2) || 0}kg</p>
              </div>
              <div>
                <p className="text-gray-500">Gradings</p>
                <p className="font-bold text-purple-600">{dm.totalGradings || 0}</p>
              </div>
              <div>
                <p className="text-gray-500">Avg Grade</p>
                <p className="font-bold text-amber-600">{dm.averageGrade?.toFixed(2) || 0}</p>
              </div>
            </div>

            {/* Expanded details */}
            {selectedDrymill === dm.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 pt-3 border-t border-green-100"
              >
                <p className="text-sm font-semibold text-green-800 mb-2">Processing Status</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-yellow-50 rounded p-2 text-center">
                    <p className="text-yellow-600 font-semibold">{dm.processingStatus?.pending || 0}</p>
                    <p className="text-gray-500">Pending</p>
                  </div>
                  <div className="bg-blue-50 rounded p-2 text-center">
                    <p className="text-blue-600 font-semibold">{dm.processingStatus?.inProgress || 0}</p>
                    <p className="text-gray-500">In Progress</p>
                  </div>
                  <div className="bg-green-50 rounded p-2 text-center">
                    <p className="text-green-600 font-semibold">{dm.processingStatus?.completed || 0}</p>
                    <p className="text-gray-500">Completed</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredDrymills.length === 0 && (
        <div className="text-center py-12 bg-white/80 rounded-2xl">
          <p className="text-gray-500 text-lg">No drymills found</p>
        </div>
      )}
    </div>
  );
}
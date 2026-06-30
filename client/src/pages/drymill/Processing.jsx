// src/pages/drymill/DryMillProcessing.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Package, Thermometer, Droplets, RefreshCw, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

export default function DryMillProcessing() {
  const [processingData, setProcessingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });

  const fetchProcessing = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        "http://localhost:5000/api/operator/drymill/processing",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setProcessingData(res.data.data.processing || []);
        setSummary(res.data.data.summary || {});
      }
    } catch (err) {
      console.error("Error fetching processing data:", err);
      setError(err.response?.data?.error || "Failed to fetch processing data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcessing();
  }, []);

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
        <h2 className="text-3xl font-bold text-green-900 flex items-center">
          <Package className="h-7 w-7 mr-2 text-green-600" /> Drymill Processing
        </h2>
        <button
          onClick={fetchProcessing}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/90 rounded-xl p-4 shadow">
          <p className="text-sm text-gray-500">Total Batches</p>
          <p className="text-2xl font-bold text-green-700">{summary.total || 0}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 shadow">
          <p className="text-sm text-yellow-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{summary.pending || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow">
          <p className="text-sm text-blue-600">In Progress</p>
          <p className="text-2xl font-bold text-blue-700">{summary.inProgress || 0}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow">
          <p className="text-sm text-green-600">Completed</p>
          <p className="text-2xl font-bold text-green-700">{summary.completed || 0}</p>
        </div>
      </div>

      {/* Processing Table */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50"
      >
        <h4 className="text-lg font-semibold text-green-800 mb-4">Processing Batches</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/80 rounded-2xl">
            <thead className="bg-green-100 text-green-900">
              <tr>
                <th className="px-4 py-2 text-left">Batch ID</th>
                <th className="px-4 py-2 text-left">Farmer</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Progress</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {processingData.map((batch) => (
                <motion.tr
                  key={batch._id}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer hover:bg-green-50 transition-colors"
                >
                  <td className="border px-4 py-2 text-sm">{batch.batchId || batch._id}</td>
                  <td className="border px-4 py-2 text-sm">{batch.farmerId?.name || "Unknown"}</td>
                  <td className="border px-4 py-2 text-sm">{batch.quantity || 0}kg</td>
                  <td className="border px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${batch.status === "completed" ? "bg-green-100 text-green-800" :
                        batch.status === "inProgress" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                      }`}>
                      {batch.status || "Pending"}
                    </span>
                  </td>
                  <td className="border px-4 py-2 text-sm">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${batch.progress || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{batch.progress || 0}%</span>
                  </td>
                  <td className="border px-4 py-2 text-sm">{new Date(batch.createdAt).toLocaleDateString()}</td>
                </motion.tr>
              ))}
              {processingData.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">No processing batches</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
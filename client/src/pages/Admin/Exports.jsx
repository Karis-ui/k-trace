// src/pages/admin/Exports.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, RefreshCw, Download, FileText, Trash2, Package, Calendar, MapPin } from "lucide-react";

export default function Exports() {
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedExport, setSelectedExport] = useState(null);
  const [summary, setSummary] = useState({
    total: 0,
    totalWeight: 0,
    totalValue: 0
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportForm, setExportForm] = useState({
    entity: "farmers",
    format: "csv",
    filters: {}
  });

  const fetchExports = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/admin/exports`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setExports(res.data.data.data || []);
        setSummary({
          total: res.data.data.total || 0,
          totalWeight: res.data.data.totalWeight || 0,
          totalValue: res.data.data.totalValue || 0
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to fetch exports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExports();
  }, []);

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/admin/exports?entity=${exportForm.entity}&format=${exportForm.format}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const data = res.data.data;
        // Create download
        const blob = new Blob([JSON.stringify(data.data, null, 2)], {
          type: data.format === 'csv' ? 'text/csv' : 'application/json'
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.entity}_export_${new Date().toISOString().slice(0, 10)}.${data.format === 'csv' ? 'csv' : 'json'}`;
        a.click();
        setShowExportModal(false);
        fetchExports();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to export data");
    }
  };

  const deleteExport = async (id) => {
    if (!window.confirm("Are you sure you want to delete this export record?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/admin/exports/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchExports();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete export");
    }
  };

  const filteredExports = exports.filter(exp =>
    exp.entity?.toLowerCase().includes(search.toLowerCase()) ||
    exp.filename?.toLowerCase().includes(search.toLowerCase())
  );

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
        <h2 className="text-3xl font-bold text-green-900">Exports</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <Download className="h-4 w-4" /> New Export
          </button>
          <button
            onClick={fetchExports}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/90 rounded-xl p-4 shadow">
          <p className="text-sm text-gray-500">Total Exports</p>
          <p className="text-2xl font-bold text-green-700">{summary.total || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow">
          <p className="text-sm text-blue-600">Total Weight</p>
          <p className="text-2xl font-bold text-blue-700">{summary.totalWeight?.toFixed(2) || 0}kg</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 shadow">
          <p className="text-sm text-amber-600">Total Value</p>
          <p className="text-2xl font-bold text-amber-700">${summary.totalValue?.toFixed(2) || 0}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/90 p-4 rounded-xl shadow flex items-center gap-3">
        <Search className="text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by entity or filename..."
          className="flex-1 border-none focus:outline-none bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="text-sm text-gray-500">{filteredExports.length} exports</span>
      </div>

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Exports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExports.map((exp) => (
          <motion.div
            key={exp._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-5 shadow-lg hover:shadow-xl transition cursor-pointer"
            onClick={() => setSelectedExport(selectedExport === exp._id ? null : exp)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-lg text-green-900">{exp.entity?.toUpperCase() || "Export"}</p>
                <p className="text-sm text-green-600">{exp.filename}</p>
                <p className="text-sm text-green-500 flex items-center gap-1">
                  <FileText className="h-3 w-3" /> {exp.format?.toUpperCase() || "JSON"}
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(exp.generatedAt).toLocaleDateString()}
              </span>
            </div>

            <div className="mt-3 flex gap-2">
              <button className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition text-sm">
                <Download className="h-3 w-3" /> Download
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); deleteExport(exp._id); }}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition text-sm"
              >
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>

            {selectedExport === exp._id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 pt-3 border-t border-green-100"
              >
                <p className="text-sm text-gray-500">Generated by: {exp.generatedBy?.name || "Unknown"}</p>
                <p className="text-sm text-gray-500">Records: {exp.data?.length || 0}</p>
                <button className="mt-2 text-green-600 text-sm hover:underline">View Details</button>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredExports.length === 0 && (
        <div className="text-center py-12 bg-white/80 rounded-2xl">
          <p className="text-gray-500 text-lg">No exports found</p>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-green-900 mb-4">Export Data</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entity</label>
                <select
                  value={exportForm.entity}
                  onChange={(e) => setExportForm({ ...exportForm, entity: e.target.value })}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                >
                  <option value="farmers">Farmers</option>
                  <option value="intakes">Intakes</option>
                  <option value="payouts">Payouts</option>
                  <option value="gradings">Gradings</option>
                  <option value="inventory">Inventory</option>
                  <option value="deliveries">Deliveries</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <select
                  value={exportForm.format}
                  onChange={(e) => setExportForm({ ...exportForm, format: e.target.value })}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                  <option value="excel">Excel</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleExport}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Export
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
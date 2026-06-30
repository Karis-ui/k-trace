// src/pages/drymill/Report.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Download, BarChart3, FileText, Calendar, RefreshCw, Clock } from "lucide-react";

export default function DrymillReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportType, setReportType] = useState("daily");
  const [generating, setGenerating] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        "http://localhost:5000/api/operator/drymill/reports",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setReports(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(err.response?.data?.error || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [reportType]);

  const generateReport = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/operator/drymill/reports?type=${reportType}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("Report generated successfully!");
        fetchReports();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/operator/drymill/reports/${id}/download`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const blob = new Blob([JSON.stringify(res.data.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to download report");
    }
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2">
          <BarChart3 className="text-green-600" /> Reports
        </h1>
        <div className="flex gap-3">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="border border-green-300 rounded-lg px-3 py-2 text-green-800 bg-white shadow-sm"
          >
            <option value="daily">Daily Report</option>
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
            <option value="custom">Custom Report</option>
          </select>
          <button
            onClick={generateReport}
            disabled={generating}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:bg-green-300"
          >
            <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
            {generating ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

      <div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-green-200 text-green-700">
              <th className="py-3">#</th>
              <th className="py-3">Report Name</th>
              <th className="py-3">Type</th>
              <th className="py-3">Date</th>
              <th className="py-3">Status</th>
              <th className="py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <motion.tr
                key={r._id || i}
                whileHover={{ scale: 1.01 }}
                className="border-b border-green-100 hover:bg-green-50 transition-all"
              >
                <td className="py-3">{i + 1}</td>
                <td className="py-3 font-medium text-green-800 flex items-center gap-2">
                  <FileText className="text-green-500" size={16} /> {r.title || "Report"}
                </td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    {r.type || reportType}
                  </span>
                </td>
                <td className="py-3 flex items-center gap-2">
                  <Calendar className="text-green-400" size={16} />
                  {new Date(r.createdAt || r.generatedAt).toLocaleDateString()}
                </td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${r.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                    {r.status || "Completed"}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => downloadReport(r._id)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    <Download size={16} /> Download
                  </button>
                </td>
              </motion.tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No reports generated yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
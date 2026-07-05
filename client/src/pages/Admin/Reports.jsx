// src/pages/admin/Reports.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, CartesianGrid
} from "recharts";
import { RefreshCw, Download, FileText, Calendar, ChevronDown } from "lucide-react";

const COLORS = ["#2F855A", "#68D391", "#81E6D9", "#F6E05E", "#ED8936", "#38A169", "#4FD1C5"];

export default function Reports() {
  const [reports, setReports] = useState({
    intakeTrend: [],
    lotDistribution: [],
    gradeDistribution: {},
    topFarmers: [],
    wetmillContribution: [],
    exportVolumes: [],
    qualityMetrics: {},
    summary: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportType, setReportType] = useState("intakes");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [format, setFormat] = useState("json");
  const [generating, setGenerating] = useState(false);
  const [reportHistory, setReportHistory] = useState([]);

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `https://zesty-ktrace.up.railway.app/api/admin/reports?type=${reportType}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const fetchReportHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        "https://zesty-ktrace.up.railway.app/api/admin/reports/history?limit=10",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setReportHistory(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchReportHistory();
  }, [reportType]);

  const generateReport = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        type: reportType,
        format: format
      });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await axios.get(
        `https://zesty-ktrace.up.railway.app/api/admin/reports?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Handle download based on format
        if (format === 'json') {
          // Download as JSON
          const blob = new Blob([JSON.stringify(res.data.data, null, 2)], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `report_${reportType}_${new Date().toISOString().slice(0, 10)}.json`;
          a.click();
        }
        fetchReportHistory();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const getGradeChartData = () => {
    const distribution = reports.gradeDistribution || {};
    return Object.entries(distribution).map(([grade, data]) => ({
      name: grade,
      count: data.count || data,
      percentage: data.percentage || 0
    }));
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
        <h2 className="text-3xl font-bold text-green-900">Reports</h2>
        <button
          onClick={fetchReports}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Report Controls */}
      <div className="bg-white/90 rounded-2xl p-6 shadow border border-green-50">
        <h3 className="text-lg font-semibold text-green-800 mb-4">Generate Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="farmers">Farmers</option>
              <option value="intakes">Intakes</option>
              <option value="payouts">Payouts</option>
              <option value="gradings">Gradings</option>
              <option value="inventory">Inventory</option>
              <option value="quality">Quality</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={generating}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-green-300 flex items-center justify-center gap-2"
            >
              {generating ? "Generating..." : <><Download className="h-4 w-4" /> Generate</>}
            </button>
          </div>
        </div>
      </div>

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/90 rounded-2xl p-6 shadow border border-green-50">
          <h4 className="text-lg font-semibold text-green-800 mb-4">Intake Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={reports.intakeTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="period" stroke="#2F855A" />
              <YAxis stroke="#2F855A" />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#2F855A" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/90 rounded-2xl p-6 shadow border border-green-50">
          <h4 className="text-lg font-semibold text-green-800 mb-4">Lot Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie dataKey="value" data={reports.lotDistribution} outerRadius={90} label>
                {reports.lotDistribution.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Report History */}
      <div className="bg-white/90 rounded-2xl p-6 shadow border border-green-50">
        <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" /> Recent Reports
        </h3>
        <div className="space-y-2">
          {reportHistory.map((report) => (
            <div key={report._id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-semibold text-green-800">{report.type}</p>
                <p className="text-sm text-gray-500">{new Date(report.generatedAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">{report.format}</span>
                <button className="text-green-600 hover:text-green-800">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {reportHistory.length === 0 && (
            <p className="text-gray-500 text-center py-4">No reports generated yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
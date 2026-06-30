// src/pages/admin/Payouts.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";

export default function Payouts() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [summary, setSummary] = useState({
    totalAmount: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    rejected: 0
  });

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/admin/payouts?status=${statusFilter}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setPayouts(res.data.data.payouts || []);
        setSummary(res.data.data.summary || {});
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to fetch payouts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, [statusFilter]);

  const updatePayoutStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/payouts/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPayouts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to update payout");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="h-4 w-4 text-yellow-600" />,
      approved: <CheckCircle className="h-4 w-4 text-blue-600" />,
      completed: <CheckCircle className="h-4 w-4 text-green-600" />,
      rejected: <XCircle className="h-4 w-4 text-red-600" />
    };
    return icons[status] || null;
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
        <h2 className="text-3xl font-bold text-green-900">Payouts Management</h2>
        <button
          onClick={fetchPayouts}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/90 rounded-xl p-4 shadow">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold text-green-700">${summary.totalAmount?.toFixed(2) || 0}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 shadow">
          <p className="text-sm text-yellow-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{summary.pending || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow">
          <p className="text-sm text-blue-600">Approved</p>
          <p className="text-2xl font-bold text-blue-700">{summary.approved || 0}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow">
          <p className="text-sm text-green-600">Completed</p>
          <p className="text-2xl font-bold text-green-700">{summary.completed || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/90 rounded-xl p-4 shadow flex flex-wrap gap-3">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded-lg transition ${statusFilter === "all" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter("pending")}
          className={`px-4 py-2 rounded-lg transition ${statusFilter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          Pending
        </button>
        <button
          onClick={() => setStatusFilter("approved")}
          className={`px-4 py-2 rounded-lg transition ${statusFilter === "approved" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          Approved
        </button>
        <button
          onClick={() => setStatusFilter("completed")}
          className={`px-4 py-2 rounded-lg transition ${statusFilter === "completed" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          Completed
        </button>
        <button
          onClick={() => setStatusFilter("rejected")}
          className={`px-4 py-2 rounded-lg transition ${statusFilter === "rejected" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          Rejected
        </button>
      </div>

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Payouts List */}
      <div className="space-y-4">
        {payouts.map((payout) => (
          <motion.div
            key={payout._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow border border-green-50 hover:shadow-lg transition"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-lg text-green-900">{payout.farmerId?.name || "Unknown"}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(payout.status)}`}>
                    {payout.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Phone: {payout.farmerId?.phone || "N/A"}</p>
                <p className="text-sm text-gray-600">Grade: {payout.grade || "N/A"} | Weight: {payout.weight || 0}kg</p>
                <p className="text-sm text-gray-500">Created: {new Date(payout.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-700">${payout.amount?.toFixed(2)}</p>
                {payout.status === "pending" && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => updatePayoutStatus(payout._id, "approved")}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updatePayoutStatus(payout._id, "rejected")}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
                {payout.status === "approved" && (
                  <button
                    onClick={() => updatePayoutStatus(payout._id, "completed")}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition mt-2"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {payouts.length === 0 && (
        <div className="text-center py-12 bg-white/80 rounded-2xl">
          <p className="text-gray-500 text-lg">No payouts found</p>
        </div>
      )}
    </div>
  );
}
// src/pages/admin/Buyers.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, Eye, RefreshCw, Building, Phone, Mail } from "lucide-react";

export default function AdminBuyers() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    totalOrders: 0,
    totalValue: 0
  });

  const fetchBuyers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `https://zesty-ktrace.up.railway.app/api/admin/buyers?search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setBuyers(res.data.data.buyers || []);
        setSummary(res.data.data.summary || {});
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to fetch buyers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchBuyers, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      suspended: "bg-red-100 text-red-800"
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
        <h2 className="text-3xl font-bold text-green-900">Buyers Management</h2>
        <button
          onClick={fetchBuyers}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/90 rounded-xl p-4 shadow">
          <p className="text-sm text-gray-500">Total Buyers</p>
          <p className="text-2xl font-bold text-green-700">{summary.total || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow">
          <p className="text-sm text-blue-600">Active Buyers</p>
          <p className="text-2xl font-bold text-blue-700">{summary.active || 0}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 shadow">
          <p className="text-sm text-purple-600">Total Orders</p>
          <p className="text-2xl font-bold text-purple-700">{summary.totalOrders || 0}</p>
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
          placeholder="Search by name, email, company or phone..."
          className="flex-1 border-none focus:outline-none bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="text-sm text-gray-500">{buyers.length} buyers</span>
      </div>

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Buyers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {buyers.map((buyer) => (
          <motion.div
            key={buyer._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-5 shadow-lg hover:shadow-xl transition cursor-pointer"
            onClick={() => setSelectedBuyer(selectedBuyer === buyer._id ? null : buyer)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-lg text-green-900">{buyer.name}</p>
                <p className="text-sm text-green-700 flex items-center gap-1">
                  <Building className="h-3 w-3" /> {buyer.company || "N/A"}
                </p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {buyer.email}
                </p>
                <p className="text-sm text-green-500 flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {buyer.phone || "N/A"}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(buyer.status)}`}>
                {buyer.status || "active"}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm bg-green-50 rounded-lg p-3">
              <div>
                <p className="text-gray-500">Orders</p>
                <p className="font-bold text-green-700">{buyer.totalOrders || 0}</p>
              </div>
              <div>
                <p className="text-gray-500">Total Spent</p>
                <p className="font-bold text-green-700">${buyer.totalValue?.toFixed(2) || 0}</p>
              </div>
            </div>

            {/* Expanded details */}
            {selectedBuyer === buyer._id && buyer.lastOrder && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 pt-3 border-t border-green-100"
              >
                <p className="text-sm text-gray-500">Last Order: {new Date(buyer.lastOrder).toLocaleDateString()}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); /* Navigate to orders */ }}
                  className="mt-2 text-green-600 text-sm hover:underline flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" /> View Orders
                </button>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {buyers.length === 0 && (
        <div className="text-center py-12 bg-white/80 rounded-2xl">
          <p className="text-gray-500 text-lg">No buyers found</p>
        </div>
      )}
    </div>
  );
}
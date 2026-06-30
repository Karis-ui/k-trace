// src/pages/admin/Farmers.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, UserCheck, UserX, Search } from "lucide-react";

export default function Farmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFarmers, setTotalFarmers] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFarmer, setNewFarmer] = useState({ name: "", phone: "", station: "" });

  const fetchFarmers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/admin/farmers?search=${search}&page=${page}&limit=12`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setFarmers(res.data.data.farmers || []);
        setTotalFarmers(res.data.data.total || 0);
        setTotalPages(Math.ceil((res.data.data.total || 0) / 12));
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Could not fetch farmers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchFarmers, 300);
    return () => clearTimeout(debounce);
  }, [search, page]);

  const handleAddFarmer = async () => {
    if (!newFarmer.name || !newFarmer.phone) {
      alert("Name and phone are required");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        "http://localhost:5000/api/admin/farmers",
        newFarmer,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewFarmer({ name: "", phone: "", station: "" });
      setShowAddModal(false);
      fetchFarmers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add farmer.");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/farmers/${id}`,
        { status: currentStatus === "active" ? "inactive" : "active" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFarmers();
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  const deleteFarmer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this farmer?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/admin/farmers/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFarmers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete farmer.");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-green-900">Farmers Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Farmer
        </button>
      </div>

      {/* Search */}
      <div className="bg-white/90 p-4 rounded-xl shadow flex items-center gap-3">
        <Search className="text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by name, phone or station..."
          className="flex-1 border-none focus:outline-none bg-transparent"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <span className="text-sm text-gray-500">{totalFarmers} farmers</span>
      </div>

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <AnimatePresence>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white/80 rounded-2xl shadow-md animate-pulse h-40"></div>
            ))
            : farmers.map((farmer) => (
              <motion.div
                key={farmer._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="bg-white/90 backdrop-blur-lg p-5 rounded-2xl shadow-lg hover:shadow-xl transition"
              >
                <p className="font-semibold text-lg text-green-900">{farmer.name}</p>
                <p className="text-sm text-green-700">{farmer.phone}</p>
                <p className="text-sm text-green-500">{farmer.station || "No station"}</p>
                <p className="text-sm font-medium text-gray-600 mt-2">
                  Deliveries: {farmer.totalDeliveries || 0} |
                  Weight: {(farmer.totalWeight || 0).toFixed(2)}kg
                </p>
                <p className="text-sm font-medium">
                  Status: <span className={`font-bold ${farmer.status === "active" ? "text-green-600" : "text-red-600"}`}>
                    {farmer.status || "active"}
                  </span>
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => toggleStatus(farmer._id, farmer.status)}
                    className={`flex items-center px-3 py-1 rounded-lg text-white text-sm ${farmer.status === "active" ? "bg-orange-500 hover:bg-orange-600" : "bg-green-600 hover:bg-green-700"
                      }`}
                  >
                    {farmer.status === "active" ? <UserX className="mr-1 h-4 w-4" /> : <UserCheck className="mr-1 h-4 w-4" />}
                    {farmer.status === "active" ? "Suspend" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteFarmer(farmer._id)}
                    className="flex items-center px-3 py-1 rounded-lg text-white text-sm bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {!loading && farmers.length === 0 && (
        <div className="text-center py-12 bg-white/80 rounded-2xl">
          <p className="text-gray-500 text-lg">No farmers found</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-green-300 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <span className="px-4 py-2 font-semibold text-green-800">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-green-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Farmer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-green-900 mb-4">Add New Farmer</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name *"
                className="w-full border border-green-300 rounded-lg p-2"
                value={newFarmer.name}
                onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phone Number *"
                className="w-full border border-green-300 rounded-lg p-2"
                value={newFarmer.phone}
                onChange={(e) => setNewFarmer({ ...newFarmer, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="Station"
                className="w-full border border-green-300 rounded-lg p-2"
                value={newFarmer.station}
                onChange={(e) => setNewFarmer({ ...newFarmer, station: e.target.value })}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddFarmer}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Add Farmer
              </button>
              <button
                onClick={() => { setShowAddModal(false); setNewFarmer({ name: "", phone: "", station: "" }); }}
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
// src/pages/admin/Farmers.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, UserCheck, UserX } from "lucide-react";

const SkeletonCard = () => (
  <div className="bg-white/80 backdrop-blur-lg p-4 rounded-2xl shadow-md animate-pulse h-28"></div>
);

export default function Farmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newFarmer, setNewFarmer] = useState({ username: "", id_number: "", farm_location: "" });

  const navigate = useNavigate();

  const fetchFarmers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`http://localhost:5000/api/farmers?page=${page}&q=${query}`);
      setFarmers(res.data.farmers);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      setError("Could not fetch farmers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchFarmers, 300);
    return () => clearTimeout(debounce);
  }, [query, page]);

  const handleAddFarmer = async () => {
    if (!newFarmer.username || !newFarmer.id_number || !newFarmer.farm_location) return;
    try {
      await axios.post("http://localhost:5000/api/farmers", newFarmer);
      setNewFarmer({ username: "", id_number: "", farm_location: "" });
      fetchFarmers();
    } catch (err) {
      console.error(err);
      alert("Failed to add farmer.");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/farmers/${id}/status`, { status: currentStatus === "active" ? "suspended" : "active" });
      fetchFarmers();
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  const deleteFarmer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this farmer?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/farmers/${id}`);
      fetchFarmers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete farmer.");
    }
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <span key={i} className="bg-yellow-200 px-1 rounded">{part}</span> : part
    );
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      <h2 className="text-3xl font-bold text-green-900">Farmers Management</h2>

      {/* Add Farmer Form */}
      <div className="bg-white/90 p-6 rounded-2xl shadow-md flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Name"
          className="border border-green-300 rounded-lg p-2 flex-1"
          value={newFarmer.username}
          onChange={(e) => setNewFarmer({ ...newFarmer, username: e.target.value })}
        />
        <input
          type="text"
          placeholder="ID Number"
          className="border border-green-300 rounded-lg p-2 flex-1"
          value={newFarmer.id_number}
          onChange={(e) => setNewFarmer({ ...newFarmer, id_number: e.target.value })}
        />
        <input
          type="text"
          placeholder="Farm Location"
          className="border border-green-300 rounded-lg p-2 flex-1"
          value={newFarmer.farm_location}
          onChange={(e) => setNewFarmer({ ...newFarmer, farm_location: e.target.value })}
        />
        <button
          onClick={handleAddFarmer}
          className="bg-green-700 text-white px-4 py-2 rounded-xl flex items-center hover:bg-green-800 transition"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Farmer
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, ID or location..."
        className="border border-green-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
      />

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        <AnimatePresence>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : farmers.length > 0
              ? farmers.map((farmer) => (
                <motion.div
                  key={farmer.id_number}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white/90 backdrop-blur-lg p-5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer transition transform"
                >
                  <p className="font-semibold text-lg text-green-900">{highlightMatch(farmer.username, query)}</p>
                  <p className="text-sm text-green-700">{highlightMatch(farmer.id_number.toString(), query)}</p>
                  <p className="text-sm text-green-500">{highlightMatch(farmer.farm_location, query)}</p>
                  <p className="text-sm font-medium text-gray-600">Status: <span className={`font-bold ${farmer.status === "active" ? "text-green-600" : "text-red-600"}`}>{farmer.status}</span></p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => toggleStatus(farmer._id, farmer.status)}
                      className={`flex items-center px-3 py-1 rounded-lg text-white text-sm ${farmer.status === "active" ? "bg-orange-500 hover:bg-orange-600" : "bg-green-600 hover:bg-green-700"}`}
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
              ))
              : query && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="col-span-full text-center p-6 bg-white/80 rounded-2xl shadow-sm text-green-700"
                >
                  No farmers found.
                </motion.div>
              )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {farmers.length > 0 && (
        <div className="flex justify-center mt-6 gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-green-200"
          >
            Prev
          </button>
          <span className="px-4 py-2 font-semibold text-green-800">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-green-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

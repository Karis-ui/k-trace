// src/pages/wetmill/WetMillFarmers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, UserPlus, Phone, MapPin, Droplets, RefreshCw, Eye, User } from "lucide-react";

export default function WetMillFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFarmer, setNewFarmer] = useState({ name: "", phone: "", station: "" });
  const [summary, setSummary] = useState({
    total: 0,
    activeFarmers: 0,
    totalWeight: 0,
    totalWetMilk: 0,
    averageMoisture: 0
  });

  const fetchFarmers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/operator/wetmill/farmers?search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setFarmers(res.data.data.farmers || []);
        setSummary(res.data.data.summary || {});
      }
    } catch (err) {
      console.error("Error fetching farmers:", err);
      setError(err.response?.data?.error || "Failed to fetch farmers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchFarmers, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleAddFarmer = async () => {
    if (!newFarmer.name || !newFarmer.phone) {
      alert("Name and phone are required");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        "http://localhost:5000/api/operator/farmers",
        newFarmer,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewFarmer({ name: "", phone: "", station: "" });
      setShowAddModal(false);
      fetchFarmers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add farmer");
    }
  };

  const getMoistureStatus = (moisture) => {
    if (moisture >= 10 && moisture <= 12) return { label: "Optimal", color: "bg-green-100 text-green-800" };
    if (moisture > 12 && moisture <= 14) return { label: "Acceptable", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Critical", color: "bg-red-100 text-red-800" };
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-blue-900 flex items-center">
          <User className="h-7 w-7 mr-2 text-blue-600" /> Wetmill Farmers
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" /> Add Farmer
          </button>
          <button
            onClick={fetchFarmers}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white/90 rounded-xl p-3 shadow">
          <p className="text-xs text-gray-500">Total Farmers</p>
          <p className="text-xl font-bold text-blue-700">{summary.total || 0}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 shadow">
          <p className="text-xs text-green-600">Active</p>
          <p className="text-xl font-bold text-green-700">{summary.activeFarmers || 0}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 shadow">
          <p className="text-xs text-purple-600">Total Weight</p>
          <p className="text-xl font-bold text-purple-700">{summary.totalWeight?.toFixed(2) || 0}kg</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 shadow">
          <p className="text-xs text-blue-600">Wet Milk</p>
          <p className="text-xl font-bold text-blue-700">{summary.totalWetMilk?.toFixed(2) || 0}kg</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 shadow">
          <p className="text-xs text-amber-600">Avg Moisture</p>
          <p className="text-xl font-bold text-amber-700">{summary.averageMoisture?.toFixed(2) || 0}%</p>
        </div>
      </div>

      {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

      {/* Search */}
      <div className="bg-white/90 p-4 rounded-xl shadow mb-6 flex items-center gap-3">
        <Search className="text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by name, phone or station..."
          className="flex-1 border-none focus:outline-none bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="text-sm text-gray-500">{farmers.length} farmers</span>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {farmers.map((farmer) => {
          const moistureStatus = getMoistureStatus(farmer.averageMoisture);
          return (
            <motion.div
              key={farmer._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white/90 backdrop-blur-lg p-5 rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer"
              onClick={() => setSelectedFarmer(selectedFarmer === farmer._id ? null : farmer)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-lg text-blue-900">{farmer.name}</p>
                  <p className="text-sm text-blue-700 flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {farmer.phone}
                  </p>
                  <p className="text-sm text-blue-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {farmer.station || "No station"}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${farmer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                  {farmer.status || "Active"}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-sm bg-blue-50 rounded-lg p-3">
                <div>
                  <p className="text-gray-500">Wet Milk</p>
                  <p className="font-bold text-blue-600">{farmer.totalWetMilk?.toFixed(2) || 0}kg</p>
                </div>
                <div>
                  <p className="text-gray-500">Moisture</p>
                  <p className={`font-bold ${moistureStatus.color}`}>{farmer.averageMoisture?.toFixed(2) || 0}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Deliveries</p>
                  <p className="font-bold text-purple-600">{farmer.totalDeliveries || 0}</p>
                </div>
              </div>

              {farmer.lastDelivery && (
                <p className="text-xs text-gray-400 mt-2">
                  Last delivery: {new Date(farmer.lastDelivery).toLocaleDateString()}
                </p>
              )}

              {selectedFarmer === farmer._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 pt-3 border-t border-blue-100"
                >
                  <p className="text-sm font-semibold text-blue-800">Recent Deliveries</p>
                  <div className="space-y-1 mt-2 max-h-32 overflow-y-auto">
                    {(farmer.recentDeliveries || []).map((delivery, idx) => (
                      <div key={idx} className="flex justify-between text-xs bg-blue-50 p-2 rounded">
                        <span>{new Date(delivery.date).toLocaleDateString()}</span>
                        <span className="font-medium">{delivery.weight}kg</span>
                      </div>
                    ))}
                    {(farmer.recentDeliveries || []).length === 0 && (
                      <p className="text-xs text-gray-400">No recent deliveries</p>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {farmers.length === 0 && (
        <div className="text-center py-12 bg-white/80 rounded-2xl">
          <p className="text-gray-500 text-lg">No farmers found</p>
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
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Add New Farmer</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name *"
                className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                value={newFarmer.name}
                onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phone Number *"
                className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                value={newFarmer.phone}
                onChange={(e) => setNewFarmer({ ...newFarmer, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="Station"
                className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                value={newFarmer.station}
                onChange={(e) => setNewFarmer({ ...newFarmer, station: e.target.value })}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddFarmer}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
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
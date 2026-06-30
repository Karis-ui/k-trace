// src/pages/drymill/DryMillFarmers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, UserPlus, Award, Leaf, Phone, MapPin, RefreshCw } from "lucide-react";

export default function DryMillFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFarmer, setNewFarmer] = useState({ name: "", phone: "", station: "" });

  const fetchFarmers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        "http://localhost:5000/api/operator/farmers",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setFarmers(res.data.data.farmers || []);
      }
    } catch (err) {
      console.error("Error fetching farmers:", err);
      setError(err.response?.data?.error || "Failed to fetch farmers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

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

  const filteredFarmers = farmers.filter(f =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.phone?.includes(search) ||
    f.station?.toLowerCase().includes(search.toLowerCase())
  );

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
        <h2 className="text-3xl font-bold text-green-900 flex items-center">
          <Leaf className="h-7 w-7 mr-2 text-green-600" /> Farmer Management
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
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
        <span className="text-sm text-gray-500">{filteredFarmers.length} farmers</span>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFarmers.map((farmer) => (
          <motion.div
            key={farmer._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white/90 backdrop-blur-lg p-5 rounded-2xl shadow-lg hover:shadow-xl transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-lg text-green-900">{farmer.name}</p>
                <p className="text-sm text-green-700 flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {farmer.phone}
                </p>
                <p className="text-sm text-green-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {farmer.station || "No station"}
                </p>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                {farmer.status || "Active"}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-sm bg-green-50 rounded-lg p-3">
              <div>
                <p className="text-gray-500">Deliveries</p>
                <p className="font-bold text-green-700">{farmer.totalDeliveries || 0}</p>
              </div>
              <div>
                <p className="text-gray-500">Weight</p>
                <p className="font-bold text-blue-600">{farmer.totalWeight?.toFixed(2) || 0}kg</p>
              </div>
              <div>
                <p className="text-gray-500">Avg Grade</p>
                <p className="font-bold text-purple-600">{farmer.averageGrade?.toFixed(2) || 0}</p>
              </div>
            </div>

            {farmer.lastDelivery && (
              <p className="text-xs text-gray-400 mt-2">
                Last delivery: {new Date(farmer.lastDelivery).toLocaleDateString()}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {filteredFarmers.length === 0 && (
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
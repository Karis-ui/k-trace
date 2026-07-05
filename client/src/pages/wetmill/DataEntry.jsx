// src/pages/wetmill/WetMillIntake.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Plus, RefreshCw, Search, Save, X,
  Droplets, Thermometer, Scale, Calendar,
  User, Phone, MapPin, CheckCircle, AlertCircle,
  Clock
} from "lucide-react";

export default function WetMillIntake() {
  const [farmers, setFarmers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showFarmerModal, setShowFarmerModal] = useState(false);
  const [newFarmer, setNewFarmer] = useState({ name: "", phone: "", station: "" });

  // Form state
  const [formData, setFormData] = useState({
    farmerId: "",
    weight: "",
    moistureContent: "",
    type: "wet",
    notes: "",
    date: new Date().toISOString().slice(0, 10)
  });

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const [farmersRes, deliveriesRes] = await Promise.all([
        axios.get(
          "https://zesty-ktrace.up.railway.app/api/operator/wetmill/farmers",
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          "https://zesty-ktrace.up.railway.app/api/operator/deliveries?type=wet",
          { headers: { Authorization: `Bearer ${token}` } }
        )
      ]);

      if (farmersRes.data.success) {
        setFarmers(farmersRes.data.data.farmers || []);
      }
      if (deliveriesRes.data.success) {
        setDeliveries(deliveriesRes.data.data.deliveries || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.error || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.farmerId || !formData.weight) {
      setError("Farmer and weight are required");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem('token');
      const payload = {
        farmerId: formData.farmerId,
        weight: parseFloat(formData.weight),
        type: formData.type || "wet",
        moistureContent: parseFloat(formData.moistureContent) || 0,
        notes: formData.notes,
        date: formData.date || new Date()
      };

      const res = await axios.post(
        "https://zesty-ktrace.up.railway.app/api/operator/deliveries",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSuccess("✅ Intake recorded successfully!");
        // Reset form
        setFormData({
          farmerId: "",
          weight: "",
          moistureContent: "",
          type: "wet",
          notes: "",
          date: new Date().toISOString().slice(0, 10)
        });
        setSelectedFarmer(null);
        fetchData();
        setTimeout(() => setSuccess(""), 5000);
      }
    } catch (err) {
      console.error("Error recording intake:", err);
      setError(err.response?.data?.error || "Failed to record intake");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddFarmer = async () => {
    if (!newFarmer.name || !newFarmer.phone) {
      alert("Name and phone are required");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        "https://zesty-ktrace.up.railway.app/api/operator/farmers",
        newFarmer,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setNewFarmer({ name: "", phone: "", station: "" });
        setShowFarmerModal(false);
        fetchData();
        // Select the newly added farmer
        const newFarmerData = res.data.data;
        setFormData({ ...formData, farmerId: newFarmerData._id });
        setSelectedFarmer(newFarmerData);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add farmer");
    }
  };

  const filteredFarmers = farmers.filter(f =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.phone?.includes(search)
  );

  // Get today's stats
  const todayDeliveries = deliveries.filter(d =>
    new Date(d.date || d.createdAt).toDateString() === new Date().toDateString()
  );
  const todayWeight = todayDeliveries.reduce((sum, d) => sum + (d.weight || 0), 0);

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
          <Droplets className="h-7 w-7 text-blue-600" /> Wetmill Intake
        </h2>
        <button
          onClick={fetchData}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/90 rounded-xl p-4 shadow">
          <p className="text-sm text-gray-500">Today's Deliveries</p>
          <p className="text-2xl font-bold text-blue-700">{todayDeliveries.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow">
          <p className="text-sm text-green-600">Today's Weight</p>
          <p className="text-2xl font-bold text-green-700">{todayWeight.toFixed(2)}kg</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 shadow">
          <p className="text-sm text-purple-600">Total Farmers</p>
          <p className="text-2xl font-bold text-purple-700">{farmers.length}</p>
        </div>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-2">
          <div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-blue-50">
            <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5" /> Record New Intake
            </h3>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" /> {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" /> {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Farmer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Farmer *</label>
                <div className="flex gap-2">
                  <select
                    required
                    value={formData.farmerId}
                    onChange={(e) => {
                      const farmer = farmers.find(f => f._id === e.target.value);
                      setFormData({ ...formData, farmerId: e.target.value });
                      setSelectedFarmer(farmer || null);
                    }}
                    className="flex-1 border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a farmer...</option>
                    {filteredFarmers.map(f => (
                      <option key={f._id} value={f._id}>{f.name} - {f.phone}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowFarmerModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4 inline" /> New
                  </button>
                </div>
                {selectedFarmer && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-lg flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {selectedFarmer.name}</span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {selectedFarmer.phone}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {selectedFarmer.station || "N/A"}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full pl-10 border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter weight"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Moisture Content (%)</label>
                  <div className="relative">
                    <Thermometer className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.moistureContent}
                      onChange={(e) => setFormData({ ...formData, moistureContent: e.target.value })}
                      className="w-full pl-10 border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter moisture %"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-10 border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="2"
                  className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-blue-300"
              >
                <Save className="h-5 w-5" />
                {submitting ? "Recording..." : "Record Intake"}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Recent Deliveries */}
        <div>
          <div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-blue-50">
            <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" /> Recent Deliveries
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {deliveries.slice(0, 10).map((delivery) => (
                <div key={delivery._id} className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-blue-800">{delivery.farmerId?.name || "Unknown"}</p>
                      <p className="text-xs text-gray-500">
                        {delivery.weight}kg • {delivery.moistureContent || "N/A"}% moisture
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(delivery.date || delivery.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {deliveries.length === 0 && (
                <p className="text-center text-gray-500 py-4">No deliveries recorded</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Farmer Modal */}
      {showFarmerModal && (
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
                onClick={() => { setShowFarmerModal(false); setNewFarmer({ name: "", phone: "", station: "" }); }}
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
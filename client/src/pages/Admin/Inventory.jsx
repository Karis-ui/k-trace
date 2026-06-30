// src/pages/admin/Inventory.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, RefreshCw, Package, AlertCircle, CheckCircle, Plus, Edit, Trash2 } from "lucide-react";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [summary, setSummary] = useState({
    totalItems: 0,
    totalQuantity: 0,
    totalValue: 0,
    lowStockCount: 0
  });
  const [stockStatus, setStockStatus] = useState({
    critical: 0,
    low: 0,
    normal: 0,
    optimal: 0
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: 0,
    unit: "kg",
    price: 0,
    supplier: "",
    location: ""
  });

  const fetchInventory = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/admin/inventory?search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const data = res.data.data;
        setInventory(data.inventory || []);
        setSummary(data.summary || {});
        setStockStatus(data.stockStats || {});
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchInventory, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/admin/inventory/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete item");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingItem
        ? `http://localhost:5000/api/admin/inventory/${editingItem._id}`
        : "http://localhost:5000/api/admin/inventory";
      const method = editingItem ? "put" : "post";

      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowAddModal(false);
      setEditingItem(null);
      setFormData({ name: "", category: "", quantity: 0, unit: "kg", price: 0, supplier: "", location: "" });
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save item");
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity <= 5) return { label: "Critical", color: "bg-red-100 text-red-800" };
    if (quantity <= 20) return { label: "Low", color: "bg-yellow-100 text-yellow-800" };
    if (quantity <= 50) return { label: "Normal", color: "bg-blue-100 text-blue-800" };
    return { label: "Optimal", color: "bg-green-100 text-green-800" };
  };

  const filteredItems = inventory.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.category?.toLowerCase().includes(search.toLowerCase()) ||
    item.supplier?.toLowerCase().includes(search.toLowerCase())
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
        <h2 className="text-3xl font-bold text-green-900">Inventory Management</h2>
        <div className="flex gap-3">
          <button
            onClick={() => { setEditingItem(null); setFormData({ name: "", category: "", quantity: 0, unit: "kg", price: 0, supplier: "", location: "" }); setShowAddModal(true); }}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <Plus className="h-4 w-4" /> Add Item
          </button>
          <button
            onClick={fetchInventory}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/90 rounded-xl p-4 shadow">
          <p className="text-sm text-gray-500">Total Items</p>
          <p className="text-2xl font-bold text-green-700">{summary.totalItems || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow">
          <p className="text-sm text-blue-600">Total Quantity</p>
          <p className="text-2xl font-bold text-blue-700">{summary.totalQuantity?.toFixed(2) || 0}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 shadow">
          <p className="text-sm text-amber-600">Total Value</p>
          <p className="text-2xl font-bold text-amber-700">${summary.totalValue?.toFixed(2) || 0}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 shadow">
          <p className="text-sm text-red-600">Low Stock Items</p>
          <p className="text-2xl font-bold text-red-700">{summary.lowStockCount || 0}</p>
        </div>
      </div>

      {/* Stock Status */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <p className="text-xs text-red-600">Critical</p>
          <p className="text-xl font-bold text-red-700">{stockStatus.critical || 0}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <p className="text-xs text-yellow-600">Low</p>
          <p className="text-xl font-bold text-yellow-700">{stockStatus.low || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-xs text-blue-600">Normal</p>
          <p className="text-xl font-bold text-blue-700">{stockStatus.normal || 0}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-xs text-green-600">Optimal</p>
          <p className="text-xl font-bold text-green-700">{stockStatus.optimal || 0}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/90 p-4 rounded-xl shadow flex items-center gap-3">
        <Search className="text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by name, category or supplier..."
          className="flex-1 border-none focus:outline-none bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="text-sm text-gray-500">{filteredItems.length} items</span>
      </div>

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const status = getStockStatus(item.quantity);
          return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-5 shadow-lg hover:shadow-xl transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-lg text-green-900">{item.name}</p>
                  <p className="text-sm text-green-600">Category: {item.category}</p>
                  <p className="text-sm text-green-500">Supplier: {item.supplier || "N/A"}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                  {status.label}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-sm bg-green-50 rounded-lg p-3">
                <div>
                  <p className="text-gray-500">Quantity</p>
                  <p className="font-bold text-blue-600">{item.quantity} {item.unit}</p>
                </div>
                <div>
                  <p className="text-gray-500">Price</p>
                  <p className="font-bold text-purple-600">${item.price?.toFixed(2) || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Value</p>
                  <p className="font-bold text-amber-600">${(item.quantity * (item.price || 0)).toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => { setEditingItem(item); setFormData(item); setShowAddModal(true); }}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-sm"
                >
                  <Edit className="h-3 w-3" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition text-sm"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-white/80 rounded-2xl">
          <p className="text-gray-500 text-lg">No inventory items found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-green-900 mb-4">
              {editingItem ? "Edit Item" : "Add New Item"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                    className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="lbs">lbs</option>
                    <option value="units">units</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  {editingItem ? "Update" : "Add"} Item
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingItem(null); setFormData({ name: "", category: "", quantity: 0, unit: "kg", price: 0, supplier: "", location: "" }); }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
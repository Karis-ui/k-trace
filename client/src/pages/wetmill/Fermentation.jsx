// src/pages/wetmill/WetMillFermentation.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
    Plus, RefreshCw, Search, Droplets, Thermometer,
    Clock, CheckCircle, AlertCircle, Trash2, Edit, Eye
} from "lucide-react";

export default function WetMillFermentation() {
    const [fermentations, setFermentations] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [summary, setSummary] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        completionRate: 0
    });
    const [formData, setFormData] = useState({
        farmerId: "",
        quantity: "",
        tankNumber: "",
        temperature: 20,
        phLevel: 4.5,
        expectedEndDate: "",
        notes: ""
    });

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem('token');
            const [fermRes, farmersRes] = await Promise.all([
                axios.get(
                    `http://localhost:5000/api/operator/wetmill/fermentation`,
                    { headers: { Authorization: `Bearer ${token}` } }
                ),
                axios.get(
                    `http://localhost:5000/api/operator/wetmill/farmers`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            ]);

            if (fermRes.data.success) {
                setFermentations(fermRes.data.data.fermentations || []);
                setSummary(fermRes.data.data.summary || {});
            }
            if (farmersRes.data.success) {
                setFarmers(farmersRes.data.data.farmers || []);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.response?.data?.error || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.farmerId || !formData.quantity || !formData.tankNumber) {
            alert("Farmer, quantity and tank number are required");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const url = editingId
                ? `http://localhost:5000/api/operator/wetmill/fermentation/${editingId}`
                : "http://localhost:5000/api/operator/wetmill/fermentation";
            const method = editingId ? "put" : "post";

            const res = await axios[method](url, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setShowAddModal(false);
                setEditingId(null);
                setFormData({ farmerId: "", quantity: "", tankNumber: "", temperature: 20, phLevel: 4.5, expectedEndDate: "", notes: "" });
                fetchData();
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Failed to save fermentation");
        }
    };

    const updateStatus = async (id, status, progress) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/operator/wetmill/fermentation/${id}`,
                { status, progress },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    const deleteFermentation = async (id) => {
        if (!window.confirm("Are you sure you want to delete this fermentation batch?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `http://localhost:5000/api/operator/wetmill/fermentation/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to delete fermentation");
        }
    };

    const filteredFermentations = fermentations.filter(f => {
        const matchesSearch = f.batchNumber?.toLowerCase().includes(search.toLowerCase()) ||
            f.farmerId?.name?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || f.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        const colors = {
            completed: "bg-green-100 text-green-800",
            inProgress: "bg-blue-100 text-blue-800",
            pending: "bg-yellow-100 text-yellow-800",
            cancelled: "bg-red-100 text-red-800"
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

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
                    <Droplets className="h-7 w-7 text-blue-600" /> Fermentation Management
                </h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => { setEditingId(null); setFormData({ farmerId: "", quantity: "", tankNumber: "", temperature: 20, phLevel: 4.5, expectedEndDate: "", notes: "" }); setShowAddModal(true); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" /> New Batch
                    </button>
                    <button
                        onClick={fetchData}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white/90 rounded-xl p-4 shadow">
                    <p className="text-sm text-gray-500">Total Batches</p>
                    <p className="text-2xl font-bold text-blue-700">{summary.total || 0}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-green-600">Completed</p>
                    <p className="text-2xl font-bold text-green-700">{summary.completed || 0}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-blue-600">In Progress</p>
                    <p className="text-2xl font-bold text-blue-700">{summary.inProgress || 0}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-yellow-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-700">{summary.pending || 0}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-purple-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-purple-700">{summary.completionRate || 0}%</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white/90 p-4 rounded-xl shadow flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <Search className="text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search by batch or farmer..."
                        className="flex-1 border-none focus:outline-none bg-transparent"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {["all", "pending", "inProgress", "completed"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1 rounded-lg text-sm transition ${statusFilter === status
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {status === "all" ? "All" : status}
                        </button>
                    ))}
                </div>
            </div>

            {error && <p className="text-red-600 font-semibold">{error}</p>}

            {/* Fermentation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredFermentations.map((ferm) => (
                    <motion.div
                        key={ferm._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/90 backdrop-blur-lg rounded-2xl p-5 shadow-lg hover:shadow-xl transition"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-semibold text-lg text-blue-900">
                                    {ferm.batchNumber || ferm._id}
                                </p>
                                <p className="text-sm text-blue-700">{ferm.farmerId?.name || "Unknown"}</p>
                                <p className="text-sm text-blue-500">Tank: {ferm.tankNumber}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(ferm.status)}`}>
                                {ferm.status || "Pending"}
                            </span>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2 text-sm bg-blue-50 rounded-lg p-3">
                            <div>
                                <p className="text-gray-500">Quantity</p>
                                <p className="font-bold text-blue-600">{ferm.quantity}kg</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Temp</p>
                                <p className="font-bold text-amber-600">{ferm.temperature || 20}°C</p>
                            </div>
                            <div>
                                <p className="text-gray-500">pH</p>
                                <p className="font-bold text-purple-600">{ferm.phLevel || 4.5}</p>
                            </div>
                        </div>

                        <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Progress</span>
                                <span>{ferm.progress || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${ferm.status === 'completed' ? 'bg-green-600' :
                                        ferm.status === 'inProgress' ? 'bg-blue-600' :
                                            'bg-yellow-600'
                                        }`}
                                    style={{ width: `${ferm.progress || 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {ferm.status === 'pending' && (
                                <button
                                    onClick={() => updateStatus(ferm._id, 'inProgress', 30)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-700 transition"
                                >
                                    Start
                                </button>
                            )}
                            {ferm.status === 'inProgress' && (
                                <>
                                    <button
                                        onClick={() => updateStatus(ferm._id, 'inProgress', Math.min(100, (ferm.progress || 0) + 20))}
                                        className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-700 transition"
                                    >
                                        +20%
                                    </button>
                                    <button
                                        onClick={() => updateStatus(ferm._id, 'completed', 100)}
                                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700 transition"
                                    >
                                        Complete
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => { setEditingId(ferm._id); setFormData(ferm); setShowAddModal(true); }}
                                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-xs hover:bg-gray-300 transition"
                            >
                                <Edit className="h-3 w-3 inline" /> Edit
                            </button>
                            <button
                                onClick={() => deleteFermentation(ferm._id)}
                                className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs hover:bg-red-200 transition"
                            >
                                <Trash2 className="h-3 w-3 inline" /> Delete
                            </button>
                        </div>

                        {ferm.expectedEndDate && (
                            <p className="text-xs text-gray-400 mt-2">
                                Expected: {new Date(ferm.expectedEndDate).toLocaleDateString()}
                            </p>
                        )}
                    </motion.div>
                ))}
            </div>

            {filteredFermentations.length === 0 && (
                <div className="text-center py-12 bg-white/80 rounded-2xl">
                    <p className="text-gray-500 text-lg">No fermentation batches found</p>
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
                        <h3 className="text-2xl font-bold text-blue-900 mb-4">
                            {editingId ? "Edit Fermentation" : "New Fermentation Batch"}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Farmer *</label>
                                <select
                                    required
                                    value={formData.farmerId}
                                    onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })}
                                    className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select farmer...</option>
                                    {farmers.map(f => (
                                        <option key={f._id} value={f._id}>{f.name} - {f.phone}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg) *</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tank Number *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.tankNumber}
                                    onChange={(e) => setFormData({ ...formData, tankNumber: e.target.value })}
                                    className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.temperature}
                                        onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                                        className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">pH Level</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="14"
                                        value={formData.phLevel}
                                        onChange={(e) => setFormData({ ...formData, phLevel: parseFloat(e.target.value) })}
                                        className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expected End Date</label>
                                <input
                                    type="date"
                                    value={formData.expectedEndDate ? new Date(formData.expectedEndDate).toISOString().slice(0, 10) : ""}
                                    onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
                                    className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
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
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    {editingId ? "Update" : "Create"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowAddModal(false); setEditingId(null); setFormData({ farmerId: "", quantity: "", tankNumber: "", temperature: 20, phLevel: 4.5, expectedEndDate: "", notes: "" }); }}
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
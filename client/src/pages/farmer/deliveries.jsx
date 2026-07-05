// src/pages/farmer/FarmerDeliveries.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Package, RefreshCw, Search, Calendar, Filter, Download } from "lucide-react";

export default function FarmerDeliveries() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [summary, setSummary] = useState({
        total: 0,
        totalWeight: 0,
        averageWeight: 0
    });

    const fetchDeliveries = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                "https://zesty-ktrace.up.railway.app/api/farmer/me/deliveries",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setDeliveries(res.data.data.deliveries || []);
                setSummary(res.data.data.summary || {});
            }
        } catch (err) {
            console.error("Error fetching deliveries:", err);
            setError(err.response?.data?.error || "Failed to fetch deliveries");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const filteredDeliveries = deliveries.filter(d =>
        d.weight?.toString().includes(search) ||
        d.type?.toLowerCase().includes(search.toLowerCase())
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
                <h2 className="text-3xl font-bold text-green-900 flex items-center gap-2">
                    <Package className="h-7 w-7 text-green-600" /> My Deliveries
                </h2>
                <button
                    onClick={fetchDeliveries}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                >
                    <RefreshCw className="h-4 w-4" /> Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/90 rounded-xl p-4 shadow">
                    <p className="text-sm text-gray-500">Total Deliveries</p>
                    <p className="text-2xl font-bold text-green-700">{summary.total || 0}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-blue-600">Total Weight</p>
                    <p className="text-2xl font-bold text-blue-700">{summary.totalWeight?.toFixed(2) || 0}kg</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-purple-600">Average Weight</p>
                    <p className="text-2xl font-bold text-purple-700">{summary.averageWeight?.toFixed(2) || 0}kg</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white/90 p-4 rounded-xl shadow flex items-center gap-3">
                <Search className="text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search by weight or type..."
                    className="flex-1 border-none focus:outline-none bg-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <span className="text-sm text-gray-500">{filteredDeliveries.length} deliveries</span>
            </div>

            {error && <p className="text-red-600 font-semibold">{error}</p>}

            {/* Deliveries Table */}
            <div className="bg-white/90 rounded-2xl shadow-lg border border-green-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-green-100 text-green-900">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Weight</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Moisture</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Station</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDeliveries.map((delivery) => (
                                <motion.tr
                                    key={delivery._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="border-b border-green-50 hover:bg-green-50 transition"
                                >
                                    <td className="px-4 py-3 text-sm">
                                        {new Date(delivery.date || delivery.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 font-medium">{delivery.weight}kg</td>
                                    <td className="px-4 py-3">{delivery.moistureContent || "N/A"}%</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${delivery.type === 'wet' ? 'bg-blue-100 text-blue-800' :
                                                delivery.type === 'dry' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {delivery.type || 'both'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                            Completed
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">{delivery.station || "N/A"}</td>
                                </motion.tr>
                            ))}
                            {filteredDeliveries.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">No deliveries found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
// src/pages/finance/FinanceFarmers.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, RefreshCw, Users, DollarSign, Clock, CheckCircle, Eye } from "lucide-react";

export default function FinanceFarmers() {
    const navigate = useNavigate();
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalFarmers, setTotalFarmers] = useState(0);

    const fetchFarmers = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `https://zesty-ktrace.up.railway.app/api/finance/farmers?search=${search}&page=${page}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setFarmers(res.data.data.farmers || []);
                setTotalFarmers(res.data.data.pagination?.total || 0);
                setTotalPages(Math.ceil((res.data.data.pagination?.total || 0) / 20));
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
    }, [search, page]);

    const getPayoutStatusColor = (status) => {
        const colors = {
            pending: "text-yellow-600",
            approved: "text-blue-600",
            completed: "text-green-600",
            rejected: "text-red-600"
        };
        return colors[status] || "text-gray-600";
    };

    if (loading) {
        return (
            <div className="p-6 min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-white space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-3xl font-bold text-purple-900 flex items-center gap-2">
                    <Users className="h-7 w-7 text-purple-600" /> Farmers
                </h2>
                <button
                    onClick={fetchFarmers}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                >
                    <RefreshCw className="h-4 w-4" /> Refresh
                </button>
            </div>

            {/* Search */}
            <div className="bg-white/90 p-4 rounded-xl shadow flex items-center gap-3">
                <Search className="text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    className="flex-1 border-none focus:outline-none bg-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <span className="text-sm text-gray-500">{totalFarmers} farmers</span>
            </div>

            {error && <p className="text-red-600 font-semibold">{error}</p>}

            {/* Farmers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {farmers.map((farmer) => (
                    <motion.div
                        key={farmer._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/90 backdrop-blur-lg rounded-2xl p-5 shadow-lg hover:shadow-xl transition cursor-pointer"
                        onClick={() => navigate(`/finance/farmers/${farmer._id}`)}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-semibold text-lg text-purple-900">{farmer.name}</p>
                                <p className="text-sm text-purple-700">{farmer.phone}</p>
                                <p className="text-sm text-purple-500">{farmer.station || "No station"}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${farmer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {farmer.status || "Active"}
                            </span>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2 text-sm bg-purple-50 rounded-lg p-3">
                            <div>
                                <p className="text-gray-500">Total Payouts</p>
                                <p className="font-bold text-purple-700">{farmer.totalPayouts || 0}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Total Amount</p>
                                <p className="font-bold text-green-700">${farmer.totalAmount?.toFixed(2) || 0}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Pending</p>
                                <p className={`font-bold ${getPayoutStatusColor(farmer.pendingPayouts > 0 ? 'pending' : 'completed')}`}>
                                    {farmer.pendingPayouts || 0}
                                </p>
                            </div>
                        </div>

                        {farmer.lastPayout && (
                            <p className="text-xs text-gray-400 mt-2">
                                Last payout: {new Date(farmer.lastPayout).toLocaleDateString()}
                            </p>
                        )}

                        <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/finance/farmers/${farmer._id}`); }}
                            className="mt-3 text-purple-600 text-sm hover:underline flex items-center gap-1"
                        >
                            <Eye className="h-3 w-3" /> View Details
                        </button>
                    </motion.div>
                ))}
            </div>

            {farmers.length === 0 && (
                <div className="text-center py-12 bg-white/80 rounded-2xl">
                    <p className="text-gray-500 text-lg">No farmers found</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-purple-600 text-white rounded disabled:bg-purple-300 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-purple-600 text-white rounded disabled:bg-purple-300 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
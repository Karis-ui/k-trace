// src/pages/farmer/FarmerPayouts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { DollarSign, RefreshCw, Search, CheckCircle, Clock, XCircle } from "lucide-react";

export default function FarmerPayouts() {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [summary, setSummary] = useState({
        total: 0,
        totalAmount: 0,
        pending: 0,
        completed: 0
    });

    const fetchPayouts = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                "https://zesty-ktrace.up.railway.app/api/farmer/me/payouts",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setPayouts(res.data.data.payouts || []);
                setSummary(res.data.data.summary || {});
            }
        } catch (err) {
            console.error("Error fetching payouts:", err);
            setError(err.response?.data?.error || "Failed to fetch payouts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayouts();
    }, []);

    const filteredPayouts = payouts.filter(p =>
        p.amount?.toString().includes(search) ||
        p.status?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-blue-100 text-blue-800",
            completed: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800"
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: <Clock className="h-4 w-4 text-yellow-600" />,
            approved: <CheckCircle className="h-4 w-4 text-blue-600" />,
            completed: <CheckCircle className="h-4 w-4 text-green-600" />,
            rejected: <XCircle className="h-4 w-4 text-red-600" />
        };
        return icons[status] || null;
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
                <h2 className="text-3xl font-bold text-green-900 flex items-center gap-2">
                    <DollarSign className="h-7 w-7 text-green-600" /> My Payouts
                </h2>
                <button
                    onClick={fetchPayouts}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                >
                    <RefreshCw className="h-4 w-4" /> Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/90 rounded-xl p-4 shadow">
                    <p className="text-sm text-gray-500">Total Payouts</p>
                    <p className="text-2xl font-bold text-green-700">{summary.total || 0}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-blue-600">Total Amount</p>
                    <p className="text-2xl font-bold text-blue-700">${summary.totalAmount?.toFixed(2) || 0}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-yellow-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-700">{summary.pending || 0}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-green-600">Completed</p>
                    <p className="text-2xl font-bold text-green-700">{summary.completed || 0}</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white/90 p-4 rounded-xl shadow flex items-center gap-3">
                <Search className="text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search by amount or status..."
                    className="flex-1 border-none focus:outline-none bg-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <span className="text-sm text-gray-500">{filteredPayouts.length} payouts</span>
            </div>

            {error && <p className="text-red-600 font-semibold">{error}</p>}

            {/* Payouts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPayouts.map((payout) => (
                    <motion.div
                        key={payout._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/90 backdrop-blur-lg rounded-2xl p-5 shadow-lg hover:shadow-xl transition"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    {new Date(payout.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-2xl font-bold text-green-700 mt-1">
                                    ${payout.amount?.toFixed(2) || 0}
                                </p>
                            </div>
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(payout.status)}`}>
                                {getStatusIcon(payout.status)}
                                {payout.status || 'Pending'}
                            </span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm bg-green-50 rounded-lg p-3">
                            <div>
                                <p className="text-gray-500">Grade</p>
                                <p className="font-medium">{payout.grade || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Weight</p>
                                <p className="font-medium">{payout.weight || 0}kg</p>
                            </div>
                        </div>

                        {payout.transactionId && (
                            <p className="text-xs text-gray-400 mt-2">TXN: {payout.transactionId}</p>
                        )}
                        {payout.rejectionReason && (
                            <p className="text-xs text-red-500 mt-1">Rejected: {payout.rejectionReason}</p>
                        )}
                    </motion.div>
                ))}
            </div>

            {filteredPayouts.length === 0 && (
                <div className="text-center py-12 bg-white/80 rounded-2xl">
                    <p className="text-gray-500 text-lg">No payouts found</p>
                </div>
            )}
        </div>
    );
}
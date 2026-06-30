// src/pages/finance/FinancePayouts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
    Search, RefreshCw, Filter, DollarSign, CheckCircle,
    XCircle, Clock, Eye, Printer, Download
} from "lucide-react";

export default function FinancePayouts() {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [summary, setSummary] = useState({
        total: 0,
        totalAmount: 0,
        pending: 0,
        approved: 0,
        completed: 0,
        rejected: 0
    });
    const [selectedPayout, setSelectedPayout] = useState(null);

    const fetchPayouts = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `http://localhost:5000/api/finance/payouts?status=${statusFilter}&page=${page}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setPayouts(res.data.data.payouts || []);
                setSummary(res.data.data.summary || {});
                setTotalPages(Math.ceil((res.data.data.pagination?.total || 0) / 20));
            }
        } catch (err) {
            console.error("Error fetching payouts:", err);
            setError(err.response?.data?.error || "Failed to fetch payouts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(fetchPayouts, 300);
        return () => clearTimeout(debounce);
    }, [statusFilter, page]);

    const updateStatus = async (id, action) => {
        try {
            const token = localStorage.getItem('token');
            const endpoints = {
                approve: `/api/finance/payouts/${id}/approve`,
                process: `/api/finance/payouts/${id}/process`,
                reject: `/api/finance/payouts/${id}/reject`
            };

            const data = action === 'reject' ? { reason: prompt("Enter rejection reason:") } : {};
            if (action === 'reject' && !data.reason) return;

            await axios.put(
                `http://localhost:5000${endpoints[action]}`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchPayouts();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Failed to update payout");
        }
    };

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

    const filteredPayouts = payouts.filter(p =>
        p.farmerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.gradingId?.grade?.toLowerCase().includes(search.toLowerCase())
    );

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
                    <DollarSign className="h-7 w-7 text-purple-600" /> Payout Management
                </h2>
                <button
                    onClick={fetchPayouts}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                >
                    <RefreshCw className="h-4 w-4" /> Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white/90 rounded-xl p-4 shadow">
                    <p className="text-sm text-gray-500">Total Payouts</p>
                    <p className="text-2xl font-bold text-purple-700">{summary.total || 0}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-yellow-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-700">{summary.pending || 0}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-blue-600">Approved</p>
                    <p className="text-2xl font-bold text-blue-700">{summary.approved || 0}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-green-600">Completed</p>
                    <p className="text-2xl font-bold text-green-700">{summary.completed || 0}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-red-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-700">{summary.rejected || 0}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white/90 p-4 rounded-xl shadow flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <Search className="text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search by farmer or grade..."
                        className="flex-1 border-none focus:outline-none bg-transparent"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {["all", "pending", "approved", "completed", "rejected"].map((status) => (
                        <button
                            key={status}
                            onClick={() => { setStatusFilter(status); setPage(1); }}
                            className={`px-3 py-1 rounded-lg text-sm transition ${statusFilter === status
                                ? "bg-purple-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {error && <p className="text-red-600 font-semibold">{error}</p>}

            {/* Payouts Table */}
            <div className="bg-white/90 rounded-2xl shadow-lg border border-purple-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-purple-100 text-purple-900">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Farmer</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Grade</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Weight</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayouts.map((payout) => (
                                <motion.tr
                                    key={payout._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="border-b border-purple-50 hover:bg-purple-50 transition cursor-pointer"
                                    onClick={() => setSelectedPayout(selectedPayout === payout._id ? null : payout._id)}
                                >
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium text-gray-800">{payout.farmerId?.name || "Unknown"}</p>
                                            <p className="text-xs text-gray-500">{payout.farmerId?.phone || "N/A"}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-bold text-green-700">${payout.amount?.toFixed(2) || 0}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${payout.grade === 'specialty' ? 'bg-green-100 text-green-800' :
                                            payout.grade === 'premium' ? 'bg-blue-100 text-blue-800' :
                                                payout.grade === 'commercial' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {payout.grade || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{payout.weight || 0}kg</td>
                                    <td className="px-4 py-3">
                                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(payout.status)}`}>
                                            {getStatusIcon(payout.status)}
                                            {payout.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">{new Date(payout.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            {payout.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateStatus(payout._id, 'approve'); }}
                                                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateStatus(payout._id, 'reject'); }}
                                                        className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {payout.status === 'approved' && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); updateStatus(payout._id, 'process'); }}
                                                    className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition"
                                                >
                                                    Process
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300 transition"
                                            >
                                                <Eye className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {filteredPayouts.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500">No payouts found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 p-4">
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
        </div>
    );
}
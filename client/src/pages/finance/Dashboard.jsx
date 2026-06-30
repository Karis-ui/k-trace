// src/pages/finance/FinanceDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend, CartesianGrid
} from "recharts";
import {
    DollarSign, Clock, CheckCircle, XCircle, Users,
    TrendingUp, RefreshCw, Wallet, Calendar
} from "lucide-react";

const COLORS = ["#2F855A", "#68D391", "#81E6D9", "#F6E05E", "#ED8936", "#38A169", "#4FD1C5"];

export default function FinanceDashboard() {
    const [dashboard, setDashboard] = useState({
        summary: {
            totalPayouts: 0,
            pendingPayouts: 0,
            approvedPayouts: 0,
            completedPayouts: 0,
            rejectedPayouts: 0,
            totalAmount: 0,
            totalFarmers: 0,
            approvalRate: 0
        },
        monthlyTrend: [],
        payoutByGrade: [],
        farmersWithPending: 0,
        recentPayouts: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboard = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                "http://localhost:5000/api/finance/dashboard",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setDashboard(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching finance dashboard:", err);
            setError(err.response?.data?.error || "Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
        const interval = setInterval(fetchDashboard, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="p-6 min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
                    <p className="mt-4 text-purple-800 font-semibold">Loading finance dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-white flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
                    <h3 className="text-red-700 font-bold text-lg mb-2">⚠️ Error Loading Dashboard</h3>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={fetchDashboard}
                        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const summary = dashboard.summary || {};

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-white space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-3xl font-bold text-purple-900 flex items-center gap-2">
                    <Wallet className="h-7 w-7 text-purple-600" /> Finance Dashboard
                </h2>
                <button
                    onClick={fetchDashboard}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                    <RefreshCw className="h-4 w-4" /> Refresh
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <motion.div whileHover={{ scale: 1.03 }} className="bg-white/90 rounded-2xl p-5 shadow-lg border border-purple-50">
                    <div className="flex items-center gap-3">
                        <DollarSign className="h-6 w-6 text-green-600" />
                        <div>
                            <h4 className="text-xs font-semibold text-gray-600">Total Amount</h4>
                            <p className="text-2xl font-bold text-green-700">${summary.totalAmount?.toFixed(2) || 0}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} className="bg-white/90 rounded-2xl p-5 shadow-lg border border-purple-50">
                    <div className="flex items-center gap-3">
                        <Clock className="h-6 w-6 text-yellow-600" />
                        <div>
                            <h4 className="text-xs font-semibold text-gray-600">Pending</h4>
                            <p className="text-2xl font-bold text-yellow-700">{summary.pendingPayouts || 0}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} className="bg-white/90 rounded-2xl p-5 shadow-lg border border-purple-50">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="h-6 w-6 text-blue-600" />
                        <div>
                            <h4 className="text-xs font-semibold text-gray-600">Approved</h4>
                            <p className="text-2xl font-bold text-blue-700">{summary.approvedPayouts || 0}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} className="bg-white/90 rounded-2xl p-5 shadow-lg border border-purple-50">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <div>
                            <h4 className="text-xs font-semibold text-gray-600">Completed</h4>
                            <p className="text-2xl font-bold text-green-700">{summary.completedPayouts || 0}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} className="bg-white/90 rounded-2xl p-5 shadow-lg border border-purple-50">
                    <div className="flex items-center gap-3">
                        <XCircle className="h-6 w-6 text-red-600" />
                        <div>
                            <h4 className="text-xs font-semibold text-gray-600">Rejected</h4>
                            <p className="text-2xl font-bold text-red-700">{summary.rejectedPayouts || 0}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} className="bg-white/90 rounded-2xl p-5 shadow-lg border border-purple-50">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                        <div>
                            <h4 className="text-xs font-semibold text-gray-600">Approval Rate</h4>
                            <p className="text-2xl font-bold text-purple-700">{summary.approvalRate || 0}%</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div whileHover={{ scale: 1.01 }} className="bg-white/90 rounded-2xl p-6 shadow-lg border border-purple-50">
                    <h4 className="text-lg font-semibold text-purple-800 mb-4">Monthly Payout Trend</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={dashboard.monthlyTrend || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                            <XAxis dataKey="month" stroke="#2F855A" />
                            <YAxis stroke="#2F855A" />
                            <Tooltip />
                            <Line type="monotone" dataKey="amount" stroke="#2F855A" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div whileHover={{ scale: 1.01 }} className="bg-white/90 rounded-2xl p-6 shadow-lg border border-purple-50">
                    <h4 className="text-lg font-semibold text-purple-800 mb-4">Payout by Grade</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={dashboard.payoutByGrade || []}
                                dataKey="amount"
                                nameKey="grade"
                                outerRadius={90}
                                label={({ grade, percent }) => `${grade} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {(dashboard.payoutByGrade || []).map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Recent Payouts */}
            <motion.div whileHover={{ scale: 1.01 }} className="bg-white/90 rounded-2xl p-6 shadow-lg border border-purple-50">
                <h4 className="text-lg font-semibold text-purple-800 mb-4">Recent Payouts</h4>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-purple-100 text-purple-900">
                            <tr>
                                <th className="px-4 py-2 text-left">Farmer</th>
                                <th className="px-4 py-2 text-left">Amount</th>
                                <th className="px-4 py-2 text-left">Grade</th>
                                <th className="px-4 py-2 text-left">Status</th>
                                <th className="px-4 py-2 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(dashboard.recentPayouts || []).map((payout) => (
                                <tr key={payout._id} className="border-b border-purple-50 hover:bg-purple-50 transition">
                                    <td className="px-4 py-2">{payout.farmerId?.name || "Unknown"}</td>
                                    <td className="px-4 py-2 font-bold text-green-700">${payout.amount?.toFixed(2) || 0}</td>
                                    <td className="px-4 py-2">{payout.grade || "N/A"}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${payout.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            payout.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                                payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {payout.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-sm">{new Date(payout.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {(dashboard.recentPayouts || []).length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-500">No recent payouts</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
// src/pages/farmer/FarmerGradings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Award, RefreshCw, Search, Star, TrendingUp } from "lucide-react";

export default function FarmerGradings() {
    const [gradings, setGradings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [summary, setSummary] = useState({
        total: 0,
        averageScore: 0,
        graded: 0,
        pending: 0
    });

    const fetchGradings = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                "https://zesty-ktrace.up.railway.app/api/farmer/me/gradings",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setGradings(res.data.data.gradings || []);
                setSummary(res.data.data.summary || {});
            }
        } catch (err) {
            console.error("Error fetching gradings:", err);
            setError(err.response?.data?.error || "Failed to fetch gradings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGradings();
    }, []);

    const filteredGradings = gradings.filter(g =>
        g.grade?.toLowerCase().includes(search.toLowerCase()) ||
        g.cuppingScore?.toString().includes(search)
    );

    const getGradeColor = (grade) => {
        const colors = {
            specialty: "bg-green-100 text-green-800",
            premium: "bg-blue-100 text-blue-800",
            commercial: "bg-yellow-100 text-yellow-800",
            'below standard': "bg-red-100 text-red-800"
        };
        return colors[grade?.toLowerCase()] || "bg-gray-100 text-gray-800";
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
                    <Award className="h-7 w-7 text-green-600" /> My Gradings
                </h2>
                <button
                    onClick={fetchGradings}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                >
                    <RefreshCw className="h-4 w-4" /> Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/90 rounded-xl p-4 shadow">
                    <p className="text-sm text-gray-500">Total Gradings</p>
                    <p className="text-2xl font-bold text-green-700">{summary.total || 0}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-blue-600">Average Score</p>
                    <p className="text-2xl font-bold text-blue-700">{summary.averageScore?.toFixed(2) || 0}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-green-600">Graded</p>
                    <p className="text-2xl font-bold text-green-700">{summary.graded || 0}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-yellow-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-700">{summary.pending || 0}</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white/90 p-4 rounded-xl shadow flex items-center gap-3">
                <Search className="text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search by grade or score..."
                    className="flex-1 border-none focus:outline-none bg-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <span className="text-sm text-gray-500">{filteredGradings.length} gradings</span>
            </div>

            {error && <p className="text-red-600 font-semibold">{error}</p>}

            {/* Gradings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredGradings.map((grading) => (
                    <motion.div
                        key={grading._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/90 backdrop-blur-lg rounded-2xl p-5 shadow-lg hover:shadow-xl transition"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    {new Date(grading.date || grading.createdAt).toLocaleDateString()}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getGradeColor(grading.grade)}`}>
                                        {grading.grade || 'Pending'}
                                    </span>
                                    <span className="flex items-center gap-1 text-amber-500">
                                        <Star className="h-4 w-4 fill-current" />
                                        {grading.cuppingScore || 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-green-700">{grading.weight || 0}kg</span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm bg-green-50 rounded-lg p-3">
                            <div>
                                <p className="text-gray-500">Score</p>
                                <p className="font-bold text-purple-700">{grading.cuppingScore || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Moisture</p>
                                <p className="font-bold text-blue-600">{grading.moistureContent || 'N/A'}%</p>
                            </div>
                        </div>

                        {grading.notes && (
                            <p className="text-xs text-gray-400 mt-2">Note: {grading.notes}</p>
                        )}

                        {grading.payoutStatus && (
                            <p className="text-xs text-green-600 mt-1">Payout: {grading.payoutStatus}</p>
                        )}
                    </motion.div>
                ))}
            </div>

            {filteredGradings.length === 0 && (
                <div className="text-center py-12 bg-white/80 rounded-2xl">
                    <p className="text-gray-500 text-lg">No gradings found</p>
                </div>
            )}
        </div>
    );
}
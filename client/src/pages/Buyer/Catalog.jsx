// src/pages/buyer/BuyerCatalog.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
    Coffee, Search, RefreshCw, ShoppingCart,
    Filter, Star, ChevronDown, CheckCircle
} from "lucide-react";

export default function BuyerCatalog() {
    const [catalog, setCatalog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        grade: "",
        minPrice: "",
        maxPrice: "",
        station: ""
    });
    const [selectedLot, setSelectedLot] = useState(null);
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const fetchCatalog = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            if (filters.grade) params.append('grade', filters.grade);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.station) params.append('station', filters.station);

            const res = await axios.get(
                `https://zesty-ktrace.up.railway.app/api/buyer/catalog?${params}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setCatalog(res.data.data || []);
            }
        } catch (err) {
            console.error("Error fetching catalog:", err);
            setError(err.response?.data?.error || "Failed to load catalog");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(fetchCatalog, 300);
        return () => clearTimeout(debounce);
    }, [filters]);

    const placeOrder = async () => {
        if (!selectedLot || orderQuantity <= 0) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                "https://zesty-ktrace.up.railway.app/api/buyer/orders",
                {
                    lotId: selectedLot._id,
                    quantity: orderQuantity
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrderSuccess(true);
            setTimeout(() => {
                setOrderSuccess(false);
                setShowOrderModal(false);
                setSelectedLot(null);
                setOrderQuantity(1);
                fetchCatalog();
            }, 2000);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Failed to place order");
        }
    };

    const filteredCatalog = catalog.filter(item =>
        item.lotId?.toLowerCase().includes(search.toLowerCase()) ||
        item.grade?.toLowerCase().includes(search.toLowerCase()) ||
        item.farmerId?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const getGradeColor = (grade) => {
        const colors = {
            specialty: "bg-green-100 text-green-800",
            premium: "bg-blue-100 text-blue-800",
            commercial: "bg-yellow-100 text-yellow-800"
        };
        return colors[grade?.toLowerCase()] || "bg-gray-100 text-gray-800";
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
                    <Coffee className="h-7 w-7 text-blue-600" /> Coffee Catalog
                </h2>
                <button
                    onClick={fetchCatalog}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                >
                    <RefreshCw className="h-4 w-4" /> Refresh
                </button>
            </div>

            {/* Search & Filters */}
            <div className="bg-white/90 p-4 rounded-xl shadow space-y-4">
                <div className="flex items-center gap-3">
                    <Search className="text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search by lot ID, grade or farmer..."
                        className="flex-1 border-none focus:outline-none bg-transparent"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="text-sm text-gray-500">{filteredCatalog.length} lots</span>
                </div>
                <div className="flex flex-wrap gap-3">
                    <select
                        value={filters.grade}
                        onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
                        className="border border-blue-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Grades</option>
                        <option value="specialty">Specialty</option>
                        <option value="premium">Premium</option>
                        <option value="commercial">Commercial</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Min Price"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                        className="border border-blue-300 rounded-lg p-2 text-sm w-24 focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        placeholder="Max Price"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        className="border border-blue-300 rounded-lg p-2 text-sm w-24 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {error && <p className="text-red-600 font-semibold">{error}</p>}

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCatalog.map((lot) => (
                    <motion.div
                        key={lot._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/90 backdrop-blur-lg rounded-2xl p-5 shadow-lg hover:shadow-xl transition"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-semibold text-lg text-blue-900">{lot.lotId || "Lot"}</p>
                                <p className="text-sm text-blue-700">Grade:
                                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getGradeColor(lot.grade)}`}>
                                        {lot.grade || 'N/A'}
                                    </span>
                                </p>
                                <p className="text-sm text-blue-500">Farmer: {lot.farmerId?.name || "N/A"}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-green-700">${lot.unitPrice || 0}/kg</p>
                                <p className="text-xs text-gray-500">{lot.availableQuantity || 0}kg available</p>
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm bg-blue-50 rounded-lg p-3">
                            <div>
                                <p className="text-gray-500">Score</p>
                                <p className="font-bold text-purple-700">{lot.gradingId?.cuppingScore || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Station</p>
                                <p className="font-medium">{lot.station || lot.farmerId?.station || 'N/A'}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedLot(lot);
                                setOrderQuantity(1);
                                setShowOrderModal(true);
                            }}
                            className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="h-4 w-4" /> Order Now
                        </button>
                    </motion.div>
                ))}
            </div>

            {filteredCatalog.length === 0 && (
                <div className="text-center py-12 bg-white/80 rounded-2xl">
                    <p className="text-gray-500 text-lg">No lots available</p>
                </div>
            )}

            {/* Order Modal */}
            {showOrderModal && selectedLot && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl p-6 max-w-md w-full"
                    >
                        <h3 className="text-2xl font-bold text-blue-900 mb-4">Place Order</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Lot</p>
                                <p className="font-semibold">{selectedLot.lotId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Grade</p>
                                <p className="font-semibold">{selectedLot.grade}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Price per kg</p>
                                <p className="font-semibold text-green-700">${selectedLot.unitPrice}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={selectedLot.availableQuantity}
                                    value={orderQuantity}
                                    onChange={(e) => setOrderQuantity(Math.min(parseInt(e.target.value) || 1, selectedLot.availableQuantity))}
                                    className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-400 mt-1">Max available: {selectedLot.availableQuantity}kg</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3">
                                <p className="text-sm text-gray-600">Total Price</p>
                                <p className="text-2xl font-bold text-green-700">
                                    ${(orderQuantity * selectedLot.unitPrice).toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={placeOrder}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Confirm Order
                            </button>
                            <button
                                onClick={() => { setShowOrderModal(false); setSelectedLot(null); }}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                        </div>
                        {orderSuccess && (
                            <div className="mt-3 p-3 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" /> Order placed successfully!
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
}
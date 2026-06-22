import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const highlightMatch = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="bg-yellow-200 px-1 rounded">{part}</span>
    ) : (
      part
    )
  );
};

const SkeletonCard = () => (
  <div className="bg-white/80 backdrop-blur-lg p-4 rounded-2xl shadow-md animate-pulse h-28"></div>
);

export default function FarmerSearch() {
  const [query, setQuery] = useState("");
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchFarmers = async () => {
    if (!query) {
      setFarmers([]);
      return;
    }
    setLoading(true);
    setError("");

    try {
// FarmerSearch.jsx
const res = await axios.get(`http://localhost:5000/api/farmers/search?q=${query}&page=${page}`);
      setFarmers(res.data.farmers);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
      setFarmers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchFarmers(), 300);
    return () => clearTimeout(debounce);
  }, [query, page]);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white">
      <h2 className="text-3xl font-bold mb-6 text-green-900">Farmer Search</h2>

      <input
        type="text"
        placeholder="Search by name or ID..."
        value={query}
        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        className="border border-green-300 rounded-lg p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        <AnimatePresence>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : farmers.length > 0
            ? farmers.map((farmer) => (
                <motion.div
                  key={farmer.id_number}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white/90 backdrop-blur-lg p-5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer transition transform"
                  onClick={() => navigate(`/farmers/${farmer.id_number}`)}
                >
                  <p className="font-semibold text-lg text-green-900">
                    {highlightMatch(farmer.username, query)}
                  </p>
                  <p className="text-sm text-green-700">
                    {highlightMatch(farmer.id_number.toString(), query)}
                  </p>
                  <p className="text-sm text-green-500">{farmer.farm_location}</p>
                </motion.div>
              ))
            : query && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="col-span-full text-center p-6 bg-white/80 rounded-2xl shadow-sm text-green-700"
                >
                  No farmers found.
                </motion.div>
              )}
        </AnimatePresence>
      </div>

      {farmers.length > 0 && (
        <div className="flex justify-center mt-6 gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-green-200"
          >
            Prev
          </button>
          <span className="px-4 py-2 font-semibold text-green-800">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-green-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

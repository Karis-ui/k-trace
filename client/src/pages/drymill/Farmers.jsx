// src/pages/drymill/DryMillFarmers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, UserPlus, Award, Leaf } from "lucide-react";

export default function Farmer() {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/drymill/farmers");
        setFarmers(res.data);
      } catch (err) {
        console.error("Error fetching farmers:", err);
      }
    };
    fetchFarmers();
  }, []);

  const filteredFarmers = farmers.filter(f =>
    f.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white">
      <h2 className="text-3xl font-bold text-green-900 mb-6 flex items-center">
        <Leaf className="h-7 w-7 mr-2 text-green-600" /> Farmer Management
      </h2>

      {/* Search + Add Farmer */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-3 text-green-600 h-5 w-5" />
          <input
            type="text"
            placeholder="Search farmers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/90"
          />
        </div>
        <button className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 flex items-center">
          <UserPlus className="h-5 w-5 mr-2" /> Add Farmer
        </button>
      </div>

      {/* Table */}
      <motion.div
        className="bg-white/90 rounded-2xl shadow-lg border border-green-50 overflow-hidden"
        whileHover={{ scale: 1.01 }}
      >
        <table className="min-w-full">
          <thead className="bg-green-100 text-green-900">
            <tr>
              <th className="px-4 py-2 text-left">Farmer Name</th>
              <th className="px-4 py-2 text-left">Region</th>
              <th className="px-4 py-2 text-left">Lots Delivered</th>
              <th className="px-4 py-2 text-left">Avg Grade</th>
              <th className="px-4 py-2 text-left">Total Payout (KSh)</th>
            </tr>
          </thead>
          <tbody>
            {filteredFarmers.map((f) => (
              <motion.tr
                key={f._id}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer hover:bg-green-50 transition-colors"
              >
                <td className="px-4 py-2 border-t">{f.name}</td>
                <td className="px-4 py-2 border-t">{f.region}</td>
                <td className="px-4 py-2 border-t">{f.lots}</td>
                <td className="px-4 py-2 border-t text-green-700 font-semibold">{f.avgGrade}</td>
                <td className="px-4 py-2 border-t">{f.totalPayout?.toLocaleString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

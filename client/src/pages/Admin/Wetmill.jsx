// src/pages/admin/Wetmill.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const wetmillsSample = [
  {
    _id: "wm1",
    username: "Green Valley Wetmill",
    id_number: "WM-001",
    farm_location: "Nairobi",
    lots: [
      { _id: "lot1", lotId: "LOT-1001", weightKg: 500, farmerName: "Farmer A", payout: 25000 },
      { _id: "lot2", lotId: "LOT-1002", weightKg: 320, farmerName: "Farmer B", payout: 16000 },
    ],
  },
  {
    _id: "wm2",
    username: "Sunrise Wetmill",
    id_number: "WM-002",
    farm_location: "Kiambu",
    lots: [
      { _id: "lot3", lotId: "LOT-1003", weightKg: 450, farmerName: "Farmer C", payout: 22500 },
      { _id: "lot4", lotId: "LOT-1004", weightKg: 600, farmerName: "Farmer D", payout: 30000 },
    ],
  },
];

const SkeletonCard = () => (
  <div className="bg-white/80 backdrop-blur-lg p-4 rounded-2xl shadow-md animate-pulse h-28"></div>
);

export default function Wetmill() {
  const [selectedWetmill, setSelectedWetmill] = useState(null);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      <h2 className="text-3xl font-bold text-green-900">Wetmills</h2>

      {/* Wetmill cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {wetmillsSample.map((wm) => (
          <motion.div
            key={wm._id}
            whileHover={{ scale: 1.03 }}
            className="bg-white/90 backdrop-blur-lg p-5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer transition"
            onClick={() => setSelectedWetmill(wm)}
          >
            <p className="font-semibold text-lg text-green-900">{wm.username}</p>
            <p className="text-sm text-green-700">ID: {wm.id_number}</p>
            <p className="text-sm text-green-500">{wm.farm_location}</p>
          </motion.div>
        ))}
      </div>

      {/* Selected Wetmill details */}
      {selectedWetmill && (
        <div className="mt-6 p-6 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-green-800 mb-2">{selectedWetmill.username}</h3>
          <p className="text-green-700 mb-1">ID: {selectedWetmill.id_number}</p>
          <p className="text-green-600 mb-3">Location: {selectedWetmill.farm_location}</p>

          <h4 className="text-lg font-semibold text-green-800 mb-2">Recent Lots</h4>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {selectedWetmill.lots.map((lot) => (
              <li key={lot._id} className="p-3 bg-green-50/60 rounded-md text-green-700 shadow-sm">
                <span className="font-semibold">{lot.lotId}</span> — {lot.weightKg} kg — Farmer: {lot.farmerName} — Payout: KES {lot.payout}
              </li>
            ))}
          </ul>

          <button
            className="mt-4 bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition"
            onClick={() => setSelectedWetmill(null)}
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
}

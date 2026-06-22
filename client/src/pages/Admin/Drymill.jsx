// src/pages/admin/Drymill.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const drymillsSample = [
  {
    _id: "dm1",
    username: "Highland Drymill",
    id_number: "DM-001",
    location: "Nakuru",
    lots: [
      { _id: "lot1", lotId: "LOT-2001", weightKg: 400, wetmillName: "Green Valley Wetmill", processedDate: "2025-10-05" },
      { _id: "lot2", lotId: "LOT-2002", weightKg: 350, wetmillName: "Sunrise Wetmill", processedDate: "2025-10-06" },
    ],
  },
  {
    _id: "dm2",
    username: "Sunrise Drymill",
    id_number: "DM-002",
    location: "Kericho",
    lots: [
      { _id: "lot3", lotId: "LOT-2003", weightKg: 500, wetmillName: "Green Valley Wetmill", processedDate: "2025-10-07" },
      { _id: "lot4", lotId: "LOT-2004", weightKg: 450, wetmillName: "Sunrise Wetmill", processedDate: "2025-10-08" },
    ],
  },
];

export default function Drymill() {
  const [selectedDrymill, setSelectedDrymill] = useState(null);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      <h2 className="text-3xl font-bold text-green-900">Drymills</h2>

      {/* Drymill cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {drymillsSample.map((dm) => (
          <motion.div
            key={dm._id}
            whileHover={{ scale: 1.03 }}
            className="bg-white/90 backdrop-blur-lg p-5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer transition"
            onClick={() => setSelectedDrymill(dm)}
          >
            <p className="font-semibold text-lg text-green-900">{dm.username}</p>
            <p className="text-sm text-green-700">ID: {dm.id_number}</p>
            <p className="text-sm text-green-500">{dm.location}</p>
          </motion.div>
        ))}
      </div>

      {/* Selected Drymill details */}
      {selectedDrymill && (
        <div className="mt-6 p-6 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-green-800 mb-2">{selectedDrymill.username}</h3>
          <p className="text-green-700 mb-1">ID: {selectedDrymill.id_number}</p>
          <p className="text-green-600 mb-3">Location: {selectedDrymill.location}</p>

          <h4 className="text-lg font-semibold text-green-800 mb-2">Processed Lots</h4>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {selectedDrymill.lots.map((lot) => (
              <li key={lot._id} className="p-3 bg-green-50/60 rounded-md text-green-700 shadow-sm">
                <span className="font-semibold">{lot.lotId}</span> — {lot.weightKg} kg — Wetmill: {lot.wetmillName} — Processed: {lot.processedDate}
              </li>
            ))}
          </ul>

          <button
            className="mt-4 bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition"
            onClick={() => setSelectedDrymill(null)}
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
}

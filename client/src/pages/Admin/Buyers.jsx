// src/pages/admin/Buyer.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const buyersSample = [
  {
    _id: "b1",
    name: "Global Coffee Ltd",
    location: "Netherlands",
    totalPurchases: 1200, // kg
    lots: [
      { lotId: "LOT-2001", weightKg: 400, date: "2025-10-05" },
      { lotId: "LOT-2003", weightKg: 500, date: "2025-10-07" },
      { lotId: "LOT-2005", weightKg: 300, date: "2025-10-10" },
    ],
  },
  {
    _id: "b2",
    name: "EuroBeans",
    location: "Germany",
    totalPurchases: 950,
    lots: [
      { lotId: "LOT-2002", weightKg: 350, date: "2025-10-06" },
      { lotId: "LOT-2004", weightKg: 600, date: "2025-10-09" },
    ],
  },
];

export default function Buyer() {
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      <h2 className="text-3xl font-bold text-green-900">Buyers</h2>

      {/* Buyer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {buyersSample.map((buyer) => (
          <motion.div
            key={buyer._id}
            whileHover={{ scale: 1.03 }}
            className="bg-white/90 backdrop-blur-lg p-5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer transition"
            onClick={() => setSelectedBuyer(buyer)}
          >
            <p className="font-semibold text-lg text-green-900">{buyer.name}</p>
            <p className="text-sm text-green-700">Location: {buyer.location}</p>
            <p className="text-sm text-green-500">Total Purchases: {buyer.totalPurchases} kg</p>
          </motion.div>
        ))}
      </div>

      {/* Selected Buyer Details */}
      {selectedBuyer && (
        <div className="mt-6 p-6 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-green-800 mb-4">{selectedBuyer.name}</h3>
          <p className="text-green-700 mb-2">Location: {selectedBuyer.location}</p>
          <p className="text-green-700 mb-4">Total Purchases: {selectedBuyer.totalPurchases} kg</p>

          <h4 className="text-lg font-semibold text-green-800 mb-2">Purchased Lots</h4>
          <div className="space-y-2">
            {selectedBuyer.lots.map((lot) => (
              <div key={lot.lotId} className="bg-green-50 p-3 rounded-lg shadow-sm flex justify-between">
                <p className="text-green-700">{lot.lotId}</p>
                <p className="text-green-600">{lot.weightKg} kg</p>
                <p className="text-green-500">{lot.date}</p>
              </div>
            ))}
          </div>

          <button
            className="mt-4 bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition"
            onClick={() => setSelectedBuyer(null)}
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
}

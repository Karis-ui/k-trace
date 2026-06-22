// src/pages/admin/Exports.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const exportsSample = [
  {
    _id: "exp1",
    lotId: "LOT-2001",
    buyerName: "Global Coffee Ltd",
    weightKg: 400,
    shippingDate: "2025-10-05",
    drymillName: "Highland Drymill",
    destination: "Netherlands",
  },
  {
    _id: "exp2",
    lotId: "LOT-2002",
    buyerName: "EuroBeans",
    weightKg: 350,
    shippingDate: "2025-10-06",
    drymillName: "Sunrise Drymill",
    destination: "Germany",
  },
  {
    _id: "exp3",
    lotId: "LOT-2003",
    buyerName: "Coffee World",
    weightKg: 500,
    shippingDate: "2025-10-07",
    drymillName: "Highland Drymill",
    destination: "USA",
  },
];

export default function Exports() {
  const [selectedExport, setSelectedExport] = useState(null);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      <h2 className="text-3xl font-bold text-green-900">Exports</h2>

      {/* Export cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {exportsSample.map((exp) => (
          <motion.div
            key={exp._id}
            whileHover={{ scale: 1.03 }}
            className="bg-white/90 backdrop-blur-lg p-5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer transition"
            onClick={() => setSelectedExport(exp)}
          >
            <p className="font-semibold text-lg text-green-900">{exp.lotId}</p>
            <p className="text-sm text-green-700">Buyer: {exp.buyerName}</p>
            <p className="text-sm text-green-500">Weight: {exp.weightKg} kg</p>
            <p className="text-sm text-green-500">Shipped: {exp.shippingDate}</p>
          </motion.div>
        ))}
      </div>

      {/* Selected export details */}
      {selectedExport && (
        <div className="mt-6 p-6 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-green-800 mb-2">{selectedExport.lotId}</h3>
          <p className="text-green-700 mb-1">Buyer: {selectedExport.buyerName}</p>
          <p className="text-green-600 mb-1">Weight: {selectedExport.weightKg} kg</p>
          <p className="text-green-600 mb-1">Drymill: {selectedExport.drymillName}</p>
          <p className="text-green-600 mb-1">Destination: {selectedExport.destination}</p>
          <p className="text-green-600 mb-3">Shipping Date: {selectedExport.shippingDate}</p>

          <button
            className="mt-4 bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition"
            onClick={() => setSelectedExport(null)}
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
}

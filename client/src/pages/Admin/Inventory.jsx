// src/pages/admin/Inventory.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const sampleLots = [
  {
    lotId: "LOT-20251004-01",
    farmer: "John Mwangi",
    weightKg: 400,
    location: "Wetmill A",
    status: "Pending",
    dateReceived: "2025-10-04",
  },
  {
    lotId: "LOT-20251004-02",
    farmer: "Jane Achieng",
    weightKg: 350,
    location: "Drymill B",
    status: "Processed",
    dateReceived: "2025-10-05",
  },
  {
    lotId: "LOT-20251004-03",
    farmer: "Peter Otieno",
    weightKg: 500,
    location: "Export",
    status: "Shipped",
    dateReceived: "2025-10-06",
  },
];

export default function Inventory() {
  const [selectedLot, setSelectedLot] = useState(null);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      <h2 className="text-3xl font-bold text-green-900">Inventory</h2>

      {/* Lots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {sampleLots.map((lot) => (
          <motion.div
            key={lot.lotId}
            whileHover={{ scale: 1.03 }}
            className="bg-white/90 backdrop-blur-lg p-5 rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition"
            onClick={() => setSelectedLot(lot)}
          >
            <p className="font-semibold text-lg text-green-900">{lot.lotId}</p>
            <p className="text-green-700">Farmer: {lot.farmer}</p>
            <p className="text-green-600">Weight: {lot.weightKg} kg</p>
            <p className="text-green-500">Location: {lot.location}</p>
            <p className={`mt-1 font-semibold ${lot.status === "Shipped" ? "text-blue-600" : lot.status === "Processed" ? "text-green-700" : "text-amber-500"}`}>
              {lot.status}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Selected Lot Details */}
      {selectedLot && (
        <div className="mt-6 p-6 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-green-800 mb-4">{selectedLot.lotId}</h3>
          <p className="text-green-700 mb-2">Farmer: {selectedLot.farmer}</p>
          <p className="text-green-700 mb-2">Weight: {selectedLot.weightKg} kg</p>
          <p className="text-green-700 mb-2">Location: {selectedLot.location}</p>
          <p className="text-green-700 mb-2">Status: {selectedLot.status}</p>
          <p className="text-green-600 mb-4">Received On: {selectedLot.dateReceived}</p>

          <button
            className="mt-4 bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition"
            onClick={() => setSelectedLot(null)}
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
}

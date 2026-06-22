// src/pages/admin/Payouts.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const samplePayouts = [
  { lotId: "LOT-20251004-01", farmer: "John Mwangi", amount: 1200, status: "Pending", date: "2025-10-04" },
  { lotId: "LOT-20251004-02", farmer: "Jane Achieng", amount: 950, status: "Paid", date: "2025-10-05" },
  { lotId: "LOT-20251004-03", farmer: "Peter Otieno", amount: 1500, status: "Pending", date: "2025-10-06" },
];

export default function Payouts() {
  const [payouts, setPayouts] = useState(samplePayouts);

  const processPayout = (lotId) => {
    // Here, you would call the backend API to process the payout
    setPayouts(payouts.map(p => p.lotId === lotId ? { ...p, status: "Paid" } : p));
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      <h2 className="text-3xl font-bold text-green-900 mb-6">Payouts</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {payouts.map(payout => (
          <motion.div
            key={payout.lotId}
            whileHover={{ scale: 1.03 }}
            className="bg-white/90 backdrop-blur-lg p-5 rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition"
          >
            <p className="font-semibold text-lg text-green-900">{payout.farmer}</p>
            <p className="text-green-700">Lot: {payout.lotId}</p>
            <p className="text-green-600">Amount: KES {payout.amount}</p>
            <p className={`mt-1 font-semibold ${payout.status === "Paid" ? "text-blue-600" : "text-amber-500"}`}>
              {payout.status}
            </p>
            {payout.status === "Pending" && (
              <button
                className="mt-3 bg-green-700 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-800 transition"
                onClick={() => processPayout(payout.lotId)}
              >
                Process Payout
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

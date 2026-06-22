// src/pages/drymill/DryMillProcessing.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Package, Thermometer, Droplets } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function Processing() {
  const [processingData, setProcessingData] = useState([]);

  useEffect(() => {
    const fetchProcessing = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/drymill/processing");
        setProcessingData(res.data);
      } catch (err) {
        console.error("Error fetching processing data:", err);
      }
    };
    fetchProcessing();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      <h2 className="text-3xl font-bold text-green-900 mb-4 flex items-center">
        <Package className="h-7 w-7 mr-2 text-green-600" /> Drymill Processing Overview
      </h2>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50 flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
        >
          <Thermometer className="h-8 w-8 text-green-700" />
          <div>
            <h4 className="text-sm text-gray-600">Average Drying Temp</h4>
            <p className="text-2xl font-bold text-green-800">38°C</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50 flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
        >
          <Droplets className="h-8 w-8 text-green-700" />
          <div>
            <h4 className="text-sm text-gray-600">Avg Moisture Content</h4>
            <p className="text-2xl font-bold text-green-800">11.5%</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50 flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
        >
          <Package className="h-8 w-8 text-green-700" />
          <div>
            <h4 className="text-sm text-gray-600">Active Batches</h4>
            <p className="text-2xl font-bold text-green-800">{processingData.length}</p>
          </div>
        </motion.div>
      </div>

      {/* Batch Progress Chart */}
      <motion.div
        className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50"
        whileHover={{ scale: 1.02 }}
      >
        <h4 className="text-lg font-semibold text-green-800 mb-4">Batch Progress by Stage</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={processingData}>
            <XAxis dataKey="batchId" stroke="#2F855A" />
            <YAxis stroke="#2F855A" />
            <Tooltip />
            <Legend />
            <Bar dataKey="drying" stackId="a" fill="#68D391" />
            <Bar dataKey="grading" stackId="a" fill="#48BB78" />
            <Bar dataKey="milling" stackId="a" fill="#2F855A" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Table of Active Batches */}
      <motion.div
        className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50"
        whileHover={{ scale: 1.01 }}
      >
        <h4 className="text-lg font-semibold text-green-800 mb-4">Active Batches</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/80 rounded-2xl">
            <thead className="bg-green-100 text-green-900">
              <tr>
                <th className="px-4 py-2">Batch ID</th>
                <th className="px-4 py-2">Stage</th>
                <th className="px-4 py-2">Progress (%)</th>
                <th className="px-4 py-2">Supervisor</th>
                <th className="px-4 py-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              {processingData.map((batch) => (
                <motion.tr
                  key={batch.batchId}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer hover:bg-green-50 transition-colors"
                >
                  <td className="border px-4 py-2">{batch.batchId}</td>
                  <td className="border px-4 py-2 capitalize">{batch.stage}</td>
                  <td className="border px-4 py-2">{batch.progress}%</td>
                  <td className="border px-4 py-2">{batch.supervisor}</td>
                  <td className="border px-4 py-2">{new Date(batch.updatedAt).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

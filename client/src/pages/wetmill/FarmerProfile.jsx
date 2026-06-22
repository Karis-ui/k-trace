import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#2F855A", "#68D391", "#81E6D9", "#F6E05E", "#ED8936"];

// Sidebar
const Sidebar = ({ currentView }) => {
  const links = [
    { key: "dashboard", label: "Dashboard", path: "/dashboard" },
    { key: "farmers", label: "Farmer Search", path: "/farmers" },
    { key: "entry", label: "Data Entry", path: "/intake/dataentry" },
    { key: "payouts", label: "Payouts", path: "/payouts" }
  ];

  return (
    <div className="w-60 bg-white/30 backdrop-blur-md shadow-xl p-6 text-green-900 flex flex-col min-h-screen">
      <h2 className="text-2xl font-extrabold mb-8">Kahawa Trace</h2>
      {links.map((link) => (
        <Link
          key={link.key}
          to={link.path}
          className={`px-4 py-3 rounded-lg mb-3 transition block ${
            currentView === link.key
              ? "bg-green-600 text-white"
              : "hover:bg-green-200"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default function FarmerProfile() {
  const { farmerId } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [intake, setIntake] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/farmers/${farmerId}`)
      .then((res) => {
        setFarmer(res.data.farmer);
        setIntake(res.data.intakeHistory);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [farmerId]);

  if (loading) return <div className="p-6 text-green-800">Loading...</div>;
  if (!farmer) return <div className="p-6 text-red-600">Farmer not found</div>;

  const trendData = intake.map((i) => ({
    date: new Date(i.createdAt).toLocaleDateString(),
    weight: i.weightKg
  }));
  const payoutData = intake.map((i) => ({
    name: i.lotId,
    value: i.payout || 0
  }));
  const moistureData = intake.map((i) => ({
    x: i.moistureBefore,
    y: i.moistureAfter
  }));
  const fermentationData = intake.map((i) => ({
    hours: i.fermentationHours,
    batches: 1
  }));
  const consistencyData = intake.map((i) => ({
    lot: i.lotId,
    score: i.consistency || 0
  }));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Sidebar currentView="farmers" />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/70 shadow-md p-6">
          <h2 className="text-3xl font-bold text-green-900">
            {farmer.username}
          </h2>
          <p className="text-green-700 font-semibold">ID: {farmer.id_number}</p>
          <p className="text-green-600">Location: {farmer.farm_location}</p>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Intake Trend */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/70 rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                Intake Trend (kg over time)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <XAxis dataKey="date" stroke="#2F855A" />
                  <YAxis stroke="#2F855A" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#38A169"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Payout Distribution */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/70 rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                Payout Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={payoutData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {payoutData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Moisture Scatter */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/70 rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                Moisture Before vs After
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <XAxis dataKey="x" name="Before" stroke="#2F855A" />
                  <YAxis dataKey="y" name="After" stroke="#2F855A" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={moistureData} fill="#68D391" />
                </ScatterChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Fermentation Distribution */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/70 rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                Fermentation Hours
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fermentationData}>
                  <XAxis dataKey="hours" stroke="#2F855A" />
                  <YAxis stroke="#2F855A" />
                  <Tooltip />
                  <Bar dataKey="batches" fill="#81E6D9" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Consistency */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/70 rounded-2xl p-6 shadow-lg md:col-span-2"
            >
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                Consistency Scores
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={consistencyData}>
                  <XAxis dataKey="lot" stroke="#2F855A" />
                  <YAxis stroke="#2F855A" />
                  <Tooltip />
                  <Bar dataKey="score" fill="#F6E05E" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Action */}
          <div className="text-center mt-8">
            <button
              className="bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition"
              onClick={() =>
                navigate(`/intake/dataentry?farmerId=${farmer.id_number}`)
              }
            >
              Enter New Coffee Received
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/60 text-center p-4 text-green-700 text-sm">
          © 2025 Kahawa Trace — Empowering Farmers with Data
        </footer>
      </div>
    </div>
  );
}

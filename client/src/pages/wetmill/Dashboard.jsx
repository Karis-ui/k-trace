import React, { useState } from "react";
import { Line, Pie, Bar, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import FarmerSearch from "./FarmerSearch";
import DataEntry from "./DataEntry";
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnimatedBackground = ({ children }) => (
  <div className="bg-gradient-to-br from-white via-green-50 to-white min-h-screen flex">
    {children}
  </div>
);

const Sidebar = ({ currentView, setView }) => {
  const links = [
    { key: "dashboard", label: "Dashboard" },
    { key: "farmers", label: "Farmer Search" },
    { key: "entry", label: "Data Entry" },
  ];

  return (
    <div className="w-60 bg-white border-r border-green-100 shadow-lg p-6 flex flex-col min-h-screen">
      <h2 className="text-2xl font-extrabold mb-8 text-green-700">Wet Mill</h2>
      {links.map((link) => (
        <motion.button
          key={link.key}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setView(link.key)}
          className={`text-left px-4 py-3 rounded-lg mb-3 transition ${
            currentView === link.key
              ? "bg-green-600 text-white shadow-lg"
              : "text-gray-700 hover:bg-green-100"
          }`}
        >
          {link.label}
        </motion.button>
      ))}
    </div>
  );
};

const KPI = ({ title, value }) => (
  <motion.div
    className="bg-white rounded-2xl p-6 text-gray-800 shadow-md hover:shadow-lg transition border border-green-100"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-2xl font-bold text-green-700">{value}</p>
  </motion.div>
);

const farmers = [
  { id: "F001", name: "John Mwangi" },
  { id: "F002", name: "Jane Wanjiku" },
  { id: "F003", name: "Peter Njoroge" },
  { id: "F004", name: "Mary Wambui" },
  { id: "F005", name: "David Otieno" },
  { id: "F006", name: "Grace Chebet" },
  { id: "F007", name: "Michael Karanja" },
  { id: "F008", name: "Faith Achieng" },
  { id: "F009", name: "Samuel Kimani" },
  { id: "F010", name: "Linda Njeri" },
];

const DashboardCharts = () => {
  const intakeData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Cherry Intake (kg)",
        data: [120, 150, 100, 180, 130, 160, 200],
        backgroundColor: "rgba(34,197,94,0.6)",
        borderColor: "rgba(34,197,94,1)",
        borderWidth: 2,
      },
      {
        label: "Parchment Output (kg)",
        data: [60, 90, 70, 120, 80, 110, 140],
        backgroundColor: "rgba(59,130,246,0.6)",
        borderColor: "rgba(59,130,246,1)",
        borderWidth: 2,
      },
    ],
  };

  const defectsData = {
    labels: ["Overripe", "Underripe", "Mold", "Moisture Issues"],
    datasets: [
      {
        data: [12, 18, 5, 15],
        backgroundColor: [
          "rgba(34,197,94,0.7)",
          "rgba(132,204,22,0.7)",
          "rgba(59,130,246,0.7)",
          "rgba(203,213,225,0.7)",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const payoutData = {
    labels: ["W1", "W2", "W3", "W4"],
    datasets: [
      {
        label: "Payout (KES)",
        data: [20000, 25000, 18000, 30000],
        borderColor: "rgba(22,163,74,1)",
        backgroundColor: "rgba(22,163,74,0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const fermentationData = {
    labels: ["10h", "12h", "14h", "16h", "18h", "20h"],
    datasets: [
      {
        label: "Batches",
        data: [2, 8, 12, 6, 4, 1],
        backgroundColor: [
          "rgba(34,197,94,0.6)",
          "rgba(132,204,22,0.6)",
          "rgba(59,130,246,0.6)",
          "rgba(203,213,225,0.6)",
          "rgba(16,185,129,0.6)",
          "rgba(107,114,128,0.6)",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const moistureData = {
    datasets: [
      {
        label: "Moisture Before vs After",
        data: [
          { x: 68, y: 12 },
          { x: 70, y: 13 },
          { x: 65, y: 11 },
          { x: 72, y: 14 },
          { x: 67, y: 12 },
        ],
        backgroundColor: "rgba(34,197,94,0.8)",
      },
    ],
  };

  const contributionData = {
    labels: farmers.map((f) => f.name),
    datasets: [
      {
        data: [400, 350, 300, 250, 200, 180, 160, 140, 120, 100],
        backgroundColor: [
          "rgba(34,197,94,0.7)",
          "rgba(132,204,22,0.7)",
          "rgba(59,130,246,0.7)",
          "rgba(16,185,129,0.7)",
          "rgba(203,213,225,0.7)",
          "rgba(107,114,128,0.7)",
          "rgba(74,222,128,0.7)",
          "rgba(21,128,61,0.7)",
          "rgba(134,239,172,0.7)",
          "rgba(187,247,208,0.7)",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-8 flex-1 overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <KPI title="Total Cherry Received" value="12,540 kg" />
        <KPI title="Payouts Disbursed" value="KES 120,000" />
        <KPI title="Avg. Cupping Score" value="83.2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <motion.div
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-md border border-green-100"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Intake vs Parchment Output
          </h3>
          <Bar data={intakeData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl p-6 shadow-md border border-green-100"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Defects & Moisture Distribution
          </h3>
          <Pie data={defectsData} />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-md border border-green-100 md:col-span-2"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Farmer Payout Trend
          </h3>
          <Line data={payoutData} />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-md border border-green-100"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Fermentation Hours Distribution
          </h3>
          <Bar data={fermentationData} />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-md border border-green-100"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Moisture Before vs After
          </h3>
          <Scatter data={moistureData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl p-6 shadow-md border border-green-100 md:col-span-2"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Farmer Contribution Share
          </h3>
          <Pie data={contributionData} />
        </motion.div>
      </div>
    </div>
  );
};

const MDashboard = () => {
  const [view, setView] = useState("dashboard");

  return (
    <AnimatedBackground>
      <div className="flex w-full">
        <Sidebar currentView={view} setView={setView} />
        <div className="flex-1">
          {view === "dashboard" && <DashboardCharts />}
          {view === "farmers" && <FarmerSearch />}
          {view === "entry" && <DataEntry />}
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default MDashboard;

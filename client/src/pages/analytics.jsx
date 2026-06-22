// src/pages/Analytics.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Leaf, DollarSign, CloudRain, Thermometer, Archive, Users } from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";

/* -------------------------
   small hook: count-up animation
   ------------------------- */
function useCountUp(target = 0, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === null || target === undefined) return;
    const steps = 30;
    const stepTime = Math.max(10, Math.floor(duration / steps));
    let current = 0;
    const increment = target / steps;
    const id = setInterval(() => {
      current += increment;
      if (current >= target) {
        setValue(Math.round(target));
        clearInterval(id);
      } else {
        setValue(Math.round(current));
      }
    }, stepTime);
    return () => clearInterval(id);
  }, [target, duration]);

  return value;
}

/* -------------------------
   Mock (realistic coffee-focused) data
   ------------------------- */
const revenueSeries = [
  { month: "Jan", revenue: 85000, costs: 42000, yield: 4200 },
  { month: "Feb", revenue: 92000, costs: 48000, yield: 4600 },
  { month: "Mar", revenue: 113000, costs: 59000, yield: 5200 },
  { month: "Apr", revenue: 98000, costs: 54000, yield: 4900 },
  { month: "May", revenue: 156000, costs: 71000, yield: 6400 },
  { month: "Jun", revenue: 170000, costs: 76000, yield: 7000 },
];

const inputsData = [
  { item: "Fertilizer", cost: 42000 },
  { item: "Labor", cost: 36000 },
  { item: "Seedlings", cost: 12000 },
  { item: "Pulping", cost: 18000 },
  { item: "Drying", cost: 8000 },
];

const coffeeMix = [
  { name: "Green Beans", value: 62 },
  { name: "Roasted Beans", value: 25 },
  { name: "Processed (packaged)", value: 8 },
  { name: "By-products", value: 5 },
];

// Profit/loss area (simulate realistic spread)
const profitLoss = revenueSeries.map((r) => ({
  month: r.month,
  profit: Math.max(0, r.revenue - r.costs),
  loss: r.costs > r.revenue ? r.costs - r.revenue : 0,
}));

/* -------------------------
   Helper: small sparkline dataset derived from revenueSeries
   ------------------------- */
const sparklineData = revenueSeries.map((d) => ({ v: d.revenue / 1000 }));

/* -------------------------
   Component
   ------------------------- */
export default function Analytics() {
  // KPI numeric targets (simulate fetch)
  const KPI = useMemo(
    () => ({
      yieldKg: revenueSeries.reduce((s, r) => s + r.yield, 0), // sum yields
      revenue: revenueSeries.reduce((s, r) => s + r.revenue, 0),
      marketPrice: Math.round((revenueSeries[revenueSeries.length - 1].revenue / revenueSeries[revenueSeries.length - 1].yield) * 100) / 100 * 1, // rough Ksh/kg
      rainfall: 32, // mm weekly
      moisture: 12, // % moisture
      buyers: 48, // active buyers
    }),
    []
  );

  // count-up animated values
  const yieldCount = useCountUp(KPI.yieldKg);
  const revenueCount = useCountUp(KPI.revenue);
  const priceCount = useCountUp(Math.round(KPI.marketPrice));
  const rainCount = useCountUp(KPI.rainfall);
  const moistureCount = useCountUp(KPI.moisture);
  const buyersCount = useCountUp(KPI.buyers);

  // colors/gradients
  const PIE_COLORS = ["#16a34a", "#a3e635", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-8 p-6">
      <motion.h1
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-extrabold text-green-800"
      >
        Farmer Analytics — Kahawa Trace
      </motion.h1>

      {/* 6 KPI cards in 3 x 2 grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1: Total Yield */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-gradient-to-r from-white/60 to-white/10 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-medium text-gray-500">Total Yield (kg)</div>
                  <div className="mt-1 text-3xl font-bold text-gray-900">{yieldCount.toLocaleString()}</div>
                  <div className="mt-1 text-xs text-green-600">+8% vs last month</div>
                </div>
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-green-50">
                  <Leaf className="w-7 h-7 text-green-600" />
                </div>
              </div>

              {/* mini sparkline */}
              <div className="mt-4 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line type="monotone" dataKey="v" stroke="#16a34a" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 2: Revenue */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Card className="rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-gradient-to-r from-yellow-50 to-white/30">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-medium text-gray-500">Revenue (Ksh)</div>
                  <div className="mt-1 text-3xl font-bold text-gray-900">Ksh {revenueCount.toLocaleString()}</div>
                  <div className="mt-1 text-xs text-green-600">+14% season-to-date</div>
                </div>
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-yellow-50">
                  <DollarSign className="w-7 h-7 text-yellow-600" />
                </div>
              </div>

              <div className="mt-4 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueSeries.map(r => ({ v: r.revenue / 1000 }))}>
                    <Line type="monotone" dataKey="v" stroke="#ca8a04" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 3: Market Price */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <Card className="rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-gradient-to-r from-violet-50 to-white/30">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-medium text-gray-500">Market Price (Ksh/kg)</div>
                  <div className="mt-1 text-3xl font-bold text-gray-900">Ksh {priceCount.toLocaleString()}</div>
                  <div className="mt-1 text-xs text-red-600">-1.5% since yesterday</div>
                </div>
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-violet-50">
                  <Archive className="w-7 h-7 text-violet-600" />
                </div>
              </div>

              <div className="mt-4 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueSeries.map(r => ({ v: r.revenue / r.yield }))}>
                    <Line type="monotone" dataKey="v" stroke="#7c3aed" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 4: Rainfall */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
          <Card className="rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-gradient-to-r from-sky-50 to-white/30">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-medium text-gray-500">Rainfall (mm this week)</div>
                  <div className="mt-1 text-3xl font-bold text-gray-900">{rainCount} mm</div>
                  <div className="mt-1 text-xs text-blue-600">Moderate showers expected</div>
                </div>
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-sky-50">
                  <CloudRain className="w-7 h-7 text-sky-600" />
                </div>
              </div>

              <div className="mt-4 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueSeries.map(r => ({ v: (r.month === 'May' ? 40 : 10 + Math.random() * 20) }))}>
                    <Line type="monotone" dataKey="v" stroke="#0284c7" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 5: Moisture */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
          <Card className="rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-gradient-to-r from-cyan-50 to-white/30">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-medium text-gray-500">Bean Moisture (%)</div>
                  <div className="mt-1 text-3xl font-bold text-gray-900">{moistureCount}%</div>
                  <div className="mt-1 text-xs text-yellow-700">Optimal: 10–12%</div>
                </div>
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-cyan-50">
                  <Thermometer className="w-7 h-7 text-cyan-600" />
                </div>
              </div>

              <div className="mt-4 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueSeries.map(r => ({ v: (10 + Math.random() * 4) }))}>
                    <Line type="monotone" dataKey="v" stroke="#0891b2" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 6: Active Buyers */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-gradient-to-r from-indigo-50 to-white/30">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-medium text-gray-500">Active Buyers</div>
                  <div className="mt-1 text-3xl font-bold text-gray-900">{buyersCount}</div>
                  <div className="mt-1 text-xs text-indigo-600">Direct & coop buyers</div>
                </div>
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-indigo-50">
                  <Users className="w-7 h-7 text-indigo-600" />
                </div>
              </div>

              <div className="mt-4 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueSeries.map(r => ({ v: Math.round(30 + Math.random() * 25) }))}>
                    <Line type="monotone" dataKey="v" stroke="#4338ca" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* big charts row: Revenue vs Costs (3D-like) & Inputs (3D-like bars) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue v Costs (layered to simulate depth) */}
        <Card className="rounded-2xl shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Revenue vs Costs (monthly)</h3>
            <div style={{ width: "100%", height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueSeries}>
                  {/* Add subtle grid */}
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6e9ee" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {/* back shadow line to create depth */}
                  <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={0} dot={false} activeDot={false} />
                  <AreaChart data={revenueSeries} style={{ position: "absolute", top: 0 }}>
                    {/* Area layers not used directly; but below we draw two lines + two areas */}
                  </AreaChart>
                  {/* primary line */}
                  <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="costs" stroke="#ef4444" strokeWidth={3} dot={false} />
                  {/* filled areas to simulate 3D mass */}
                  <Area type="monotone" dataKey="revenue" fill="rgba(34,197,94,0.18)" stroke="none" />
                  <Area type="monotone" dataKey="costs" fill="rgba(239,68,68,0.12)" stroke="none" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Inputs breakdown with pseudo-3D bars */}
        <Card className="rounded-2xl shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Inputs Cost Breakdown</h3>
            <div style={{ width: "100%", height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inputsData} barCategoryGap="20%" >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="item" />
                  <YAxis />
                  <Tooltip />
                  {/* Darker offset bar to create depth behind main bar */}
                  <Bar dataKey="cost" fill="#0ea5e9" radius={[8,8,0,0]} />
                  {/* We can simulate a slight shadow by duplicating bars with slightly higher value and darker color and using barGap negative if desired */}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Tips: compare fertilizer vs pulping costs — lowering pulping waste improves margins.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pie (coffee-only) + Profit vs Loss area (layered effect) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Coffee Product Mix (Revenue share)</h3>

            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  {/* gradients for a little depth */}
                  <defs>
                    <radialGradient id="g1" cx="50%" cy="30%" r="80%">
                      <stop offset="0%" stopColor="#16a34a" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#16a34a" stopOpacity="0.6" />
                    </radialGradient>
                    <radialGradient id="g2" cx="50%" cy="30%" r="80%">
                      <stop offset="0%" stopColor="#a3e635" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#a3e635" stopOpacity="0.6" />
                    </radialGradient>
                    <radialGradient id="g3" cx="50%" cy="30%" r="80%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
                    </radialGradient>
                    <radialGradient id="g4" cx="50%" cy="30%" r="80%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.6" />
                    </radialGradient>
                  </defs>

                  <Pie
                    data={coffeeMix}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {coffeeMix.map((entry, idx) => {
                      // use gradient fills
                      const grad = ["url(#g1)", "url(#g2)", "url(#g3)", "url(#g4)"][idx % 4];
                      return <Cell key={`cell-${idx}`} fill={grad} />;
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Breakdown is coffee-only — green beans form the majority of revenue.
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Profit vs Loss (monthly)</h3>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={profitLoss}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {/* profit area (green) */}
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stackId="1"
                    stroke="#16a34a"
                    fill="rgba(34,197,94,0.25)"
                  />
                  {/* loss area (red) */}
                  <Area
                    type="monotone"
                    dataKey="loss"
                    stackId="1"
                    stroke="#ef4444"
                    fill="rgba(239,68,68,0.12)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Profit = Revenue – Costs. Aim to reduce input costs for better margins.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

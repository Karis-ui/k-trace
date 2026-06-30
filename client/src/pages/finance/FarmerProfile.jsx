// src/pages/common/FarmerProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, CartesianGrid
} from "recharts";
import {
  ArrowLeft, User, Phone, MapPin, Calendar, Package,
  Award, DollarSign, TrendingUp, Clock, CheckCircle,
  XCircle, RefreshCw, Activity, Droplets, Thermometer
} from "lucide-react";

const COLORS = ["#2F855A", "#68D391", "#81E6D9", "#F6E05E", "#ED8936", "#38A169", "#4FD1C5"];

export default function FarmerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const fetchFarmerProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/operator/farmers/${id}/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setFarmer(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching farmer profile:", err);
      setError(err.response?.data?.error || "Failed to load farmer profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerProfile();
  }, [id]);

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      suspended: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPayoutStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-green-800 font-semibold">Loading farmer profile...</p>
        </div>
      </div>
    );
  }

  if (error || !farmer) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
          <h3 className="text-red-700 font-bold text-lg mb-2">⚠️ Error</h3>
          <p className="text-red-600">{error || "Farmer not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const profile = farmer.profile || {};
  const stats = farmer.statistics || {};
  const gradeDist = farmer.gradeDistribution || {};
  const payoutStatus = farmer.payoutStatus || {};
  const monthlyTrend = farmer.monthlyTrend || [];
  const recent = farmer.recent || {};

  // Prepare chart data
  const gradeChartData = Object.entries(gradeDist).map(([grade, count]) => ({
    name: grade || 'Pending',
    value: count
  }));

  const payoutChartData = Object.entries(payoutStatus).map(([status, count]) => ({
    name: status,
    value: count
  }));

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-green-700 hover:text-green-900 transition mb-4"
      >
        <ArrowLeft className="h-5 w-5" /> Back
      </button>

      {/* Profile Header */}
      <div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <User className="h-10 w-10 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-green-900">{profile.name}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(profile.status)}`}>
                {profile.status || "Active"}
              </span>
              <span className="text-sm text-gray-500">ID: {profile.farmerId}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              <p className="text-sm text-green-700 flex items-center gap-2">
                <Phone className="h-4 w-4" /> {profile.phone || "N/A"}
              </p>
              <p className="text-sm text-green-700 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {profile.station || "N/A"}
              </p>
              <p className="text-sm text-green-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Joined: {new Date(profile.registeredAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={fetchFarmerProfile}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white/90 rounded-xl p-4 shadow">
          <p className="text-xs text-gray-500">Total Deliveries</p>
          <p className="text-2xl font-bold text-green-700">{stats.totalDeliveries || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow">
          <p className="text-xs text-blue-600">Total Weight</p>
          <p className="text-2xl font-bold text-blue-700">{stats.totalWeight?.toFixed(2) || 0}kg</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 shadow">
          <p className="text-xs text-purple-600">Total Gradings</p>
          <p className="text-2xl font-bold text-purple-700">{stats.totalGradings || 0}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 shadow">
          <p className="text-xs text-amber-600">Avg Grade</p>
          <p className="text-2xl font-bold text-amber-700">{stats.averageGrade?.toFixed(2) || 0}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow">
          <p className="text-xs text-green-600">Total Payouts</p>
          <p className="text-2xl font-bold text-green-700">${stats.totalPayouts?.toFixed(2) || 0}</p>
        </div>
        <div className="bg-teal-50 rounded-xl p-4 shadow">
          <p className="text-xs text-teal-600">Specialty Rate</p>
          <p className="text-2xl font-bold text-teal-700">{stats.specialtyRate || 0}%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white/90 p-2 rounded-xl shadow">
        {["overview", "deliveries", "gradings", "payouts", "activity"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize transition ${activeTab === tab
                ? "bg-green-600 text-white"
                : "hover:bg-green-50 text-gray-700"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Grade Distribution */}
            <div>
              <h4 className="text-lg font-semibold text-green-800 mb-4">Grade Distribution</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={gradeChartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {gradeChartData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Payout Status */}
            <div>
              <h4 className="text-lg font-semibold text-green-800 mb-4">Payout Status</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-yellow-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-700">{payoutStatus.pending || 0}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-blue-600">Approved</p>
                  <p className="text-2xl font-bold text-blue-700">{payoutStatus.approved || 0}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-green-600">Completed</p>
                  <p className="text-2xl font-bold text-green-700">{payoutStatus.completed || 0}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-red-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-700">{payoutStatus.rejected || 0}</p>
                </div>
              </div>
            </div>

            {/* Monthly Trend */}
            {monthlyTrend.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-green-800 mb-4">Monthly Trend</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#2F855A" />
                    <YAxis stroke="#2F855A" />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#2F855A" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {activeTab === "deliveries" && (
          <div>
            <h4 className="text-lg font-semibold text-green-800 mb-4">Recent Deliveries</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-green-100 text-green-900">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Weight</th>
                    <th className="px-4 py-2 text-left">Moisture</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(recent.deliveries || []).map((delivery) => (
                    <tr key={delivery._id} className="border-b border-green-50 hover:bg-green-50 transition">
                      <td className="px-4 py-2">{new Date(delivery.date || delivery.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2 font-medium">{delivery.weight}kg</td>
                      <td className="px-4 py-2">{delivery.moistureContent || "N/A"}%</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
                      </td>
                    </tr>
                  ))}
                  {(recent.deliveries || []).length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">No deliveries</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "gradings" && (
          <div>
            <h4 className="text-lg font-semibold text-green-800 mb-4">Recent Gradings</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-green-100 text-green-900">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Grade</th>
                    <th className="px-4 py-2 text-left">Score</th>
                    <th className="px-4 py-2 text-left">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {(recent.gradings || []).map((grading) => (
                    <tr key={grading._id} className="border-b border-green-50 hover:bg-green-50 transition">
                      <td className="px-4 py-2">{new Date(grading.date || grading.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${grading.grade === 'specialty' ? 'bg-green-100 text-green-800' :
                            grading.grade === 'premium' ? 'bg-blue-100 text-blue-800' :
                              grading.grade === 'commercial' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                          }`}>
                          {grading.grade || 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-2 font-medium">{grading.cuppingScore || 'N/A'}</td>
                      <td className="px-4 py-2">{grading.weight || 0}kg</td>
                    </tr>
                  ))}
                  {(recent.gradings || []).length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">No gradings</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "payouts" && (
          <div>
            <h4 className="text-lg font-semibold text-green-800 mb-4">Recent Payouts</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-green-100 text-green-900">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {(recent.payouts || []).map((payout) => (
                    <tr key={payout._id} className="border-b border-green-50 hover:bg-green-50 transition">
                      <td className="px-4 py-2">{new Date(payout.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2 font-bold text-green-700">${payout.amount?.toFixed(2) || 0}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPayoutStatusColor(payout.status)}`}>
                          {payout.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">{payout.transactionId || 'N/A'}</td>
                    </tr>
                  ))}
                  {(recent.payouts || []).length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">No payouts</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div>
            <h4 className="text-lg font-semibold text-green-800 mb-4">Recent Activity</h4>
            <div className="space-y-3">
              {(farmer.recentActivity || []).map((activity, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                  <div className={`p-2 rounded-full ${activity.type === 'delivery' ? 'bg-blue-100' :
                      activity.type === 'grading' ? 'bg-purple-100' :
                        'bg-green-100'
                    }`}>
                    {activity.type === 'delivery' ? <Package className="h-4 w-4 text-blue-600" /> :
                      activity.type === 'grading' ? <Award className="h-4 w-4 text-purple-600" /> :
                        <DollarSign className="h-4 w-4 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </p>
                    <p className="text-xs text-gray-500">{activity.details}</p>
                  </div>
                  <p className="text-xs text-gray-400">{new Date(activity.date).toLocaleDateString()}</p>
                </div>
              ))}
              {(farmer.recentActivity || []).length === 0 && (
                <p className="text-center py-4 text-gray-500">No recent activity</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
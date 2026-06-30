// src/pages/drymill/Grading.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Save, RefreshCw, Coffee, CheckCircle, AlertCircle } from "lucide-react";

export default function Grading() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    farmerId: "",
    weight: "",
    cuppingScore: "",
    grade: "",
    moistureContent: "",
    defects: {},
    notes: ""
  });

  const [scores, setScores] = useState({
    aroma: 0,
    flavor: 0,
    aftertaste: 0,
    acidity: 0,
    body: 0,
    uniformity: 0,
    balance: 0,
    cleanCup: 0,
    sweetness: 0,
    overall: 0
  });

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        "http://localhost:5000/api/operator/farmers",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setFarmers(res.data.data.farmers || []);
      }
    } catch (err) {
      console.error("Error fetching farmers:", err);
    }
  };

  const calculateTotal = () => {
    return Object.values(scores).reduce((sum, val) => sum + (Number(val) || 0), 0);
  };

  const getGrade = (score) => {
    if (score >= 80) return "Specialty";
    if (score >= 75) return "Premium";
    if (score >= 60) return "Commercial";
    return "Below Standard";
  };

  const handleScoreChange = (field, value) => {
    const num = Number(value);
    if (num >= 0 && num <= 10) {
      setScores(prev => ({ ...prev, [field]: num }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalScore = calculateTotal();
    const grade = getGrade(totalScore);

    if (!formData.farmerId || !formData.weight) {
      setMessage({ type: "error", text: "Farmer and weight are required" });
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        farmerId: formData.farmerId,
        weight: parseFloat(formData.weight),
        cuppingScore: totalScore,
        grade: grade,
        moistureContent: parseFloat(formData.moistureContent) || 0,
        defects: formData.defects || {},
        notes: formData.notes
      };

      const res = await axios.post(
        "http://localhost:5000/api/operator/gradings",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setResult(res.data.data);
        setMessage({ type: "success", text: "✅ Grading recorded successfully!" });
        // Reset form
        setFormData({ farmerId: "", weight: "", cuppingScore: "", grade: "", moistureContent: "", defects: {}, notes: "" });
        setScores({ aroma: 0, flavor: 0, aftertaste: 0, acidity: 0, body: 0, uniformity: 0, balance: 0, cleanCup: 0, sweetness: 0, overall: 0 });
      }
    } catch (err) {
      console.error("Grading error:", err);
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to record grading" });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const totalScore = calculateTotal();
  const grade = getGrade(totalScore);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-900 flex items-center gap-2">
            <Coffee className="h-7 w-7 text-green-600" /> Coffee Grading
          </h2>
          <button
            onClick={fetchFarmers}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-4 flex items-center gap-2 ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
            {message.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50">
          {/* Farmer Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Farmer *</label>
            <select
              value={formData.farmerId}
              onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })}
              className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select a farmer...</option>
              {farmers.map(f => (
                <option key={f._id} value={f._id}>{f.name} - {f.phone}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Moisture Content (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.moistureContent}
                onChange={(e) => setFormData({ ...formData, moistureContent: e.target.value })}
                className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* SCAA Cupping Scores */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-green-800 mb-3">SCAA Cupping Scores (0-10)</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(scores).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 capitalize">{key}</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="10"
                    value={value}
                    onChange={(e) => handleScoreChange(key, e.target.value)}
                    className="w-full border border-green-300 rounded-lg p-1 text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Total Score & Grade */}
          <div className="mt-6 grid grid-cols-2 gap-4 bg-green-50 rounded-xl p-4">
            <div>
              <p className="text-sm text-gray-600">Total Score</p>
              <p className="text-3xl font-bold text-green-700">{totalScore.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Grade</p>
              <p className={`text-3xl font-bold ${grade === "Specialty" ? "text-green-700" :
                grade === "Premium" ? "text-blue-700" :
                  grade === "Commercial" ? "text-yellow-700" :
                    "text-red-700"
                }`}>{grade}</p>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="2"
              className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
              placeholder="Additional notes..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:bg-green-300"
          >
            {submitting ? "Submitting..." : <><Save className="h-4 w-4" /> Record Grading</>}
          </button>
        </form>

        {/* Result Display */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white/90 rounded-2xl p-6 shadow-lg border border-green-50"
          >
            <h3 className="text-lg font-bold text-green-800 mb-3">✅ Grading Result</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Lot ID</p>
                <p className="font-bold text-green-700">{result.lotId || "N/A"}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Grade</p>
                <p className="font-bold text-green-700">{result.grade || "N/A"}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Cupping Score</p>
                <p className="font-bold text-green-700">{result.cuppingScore || "N/A"}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-bold text-green-700">{result.payoutStatus || "Pending"}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
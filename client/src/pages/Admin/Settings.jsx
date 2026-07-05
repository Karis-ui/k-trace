// src/pages/admin/Settings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Save, RefreshCw } from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState({
    profile: { name: "", email: "", phone: "" },
    system: { name: "", version: "", timezone: "", currency: "", language: "" },
    grading: { specialtyThreshold: 80, premiumThreshold: 75, commercialThreshold: 60 },
    payouts: { basePricePerKg: 2.00, defaultPaymentTerms: 30 },
    notifications: { smsEnabled: true, emailEnabled: true }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(
        "https://zesty-ktrace.up.railway.app/api/admin/settings",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSettings(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      const token = localStorage.getItem('token');

      await axios.put(
        "https://zesty-ktrace.up.railway.app/api/admin/settings",
        settings,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Settings saved successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to save settings");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "system", label: "System" },
    { id: "grading", label: "Grading" },
    { id: "payouts", label: "Payouts" },
    { id: "notifications", label: "Notifications" }
  ];

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-green-900">Admin Settings</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-green-300"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      {message && <p className="text-green-600 font-semibold">{message}</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white/90 p-2 rounded-xl shadow">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg transition ${activeTab === tab.id ? "bg-green-600 text-white" : "hover:bg-green-50 text-gray-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 rounded-2xl p-6 shadow border border-green-50"
      >
        {activeTab === "profile" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-green-800">Profile Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={settings.profile?.name || ""}
                  onChange={(e) => handleChange("profile", "name", e.target.value)}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={settings.profile?.email || ""}
                  onChange={(e) => handleChange("profile", "email", e.target.value)}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={settings.profile?.phone || ""}
                  onChange={(e) => handleChange("profile", "phone", e.target.value)}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-green-800">System Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">System Name</label>
                <input
                  type="text"
                  value={settings.system?.name || ""}
                  onChange={(e) => handleChange("system", "name", e.target.value)}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                <input
                  type="text"
                  value={settings.system?.version || ""}
                  onChange={(e) => handleChange("system", "version", e.target.value)}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                <input
                  type="text"
                  value={settings.system?.timezone || ""}
                  onChange={(e) => handleChange("system", "timezone", e.target.value)}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <input
                  type="text"
                  value={settings.system?.currency || ""}
                  onChange={(e) => handleChange("system", "currency", e.target.value)}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "grading" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-green-800">Grading Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty Threshold</label>
                <input
                  type="number"
                  value={settings.grading?.specialtyThreshold || 80}
                  onChange={(e) => handleChange("grading", "specialtyThreshold", parseInt(e.target.value))}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Premium Threshold</label>
                <input
                  type="number"
                  value={settings.grading?.premiumThreshold || 75}
                  onChange={(e) => handleChange("grading", "premiumThreshold", parseInt(e.target.value))}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commercial Threshold</label>
                <input
                  type="number"
                  value={settings.grading?.commercialThreshold || 60}
                  onChange={(e) => handleChange("grading", "commercialThreshold", parseInt(e.target.value))}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "payouts" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-green-800">Payout Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price per KG ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.payouts?.basePricePerKg || 2.00}
                  onChange={(e) => handleChange("payouts", "basePricePerKg", parseFloat(e.target.value))}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Payment Terms (days)</label>
                <input
                  type="number"
                  value={settings.payouts?.defaultPaymentTerms || 30}
                  onChange={(e) => handleChange("payouts", "defaultPaymentTerms", parseInt(e.target.value))}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-green-800">Notification Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.notifications?.smsEnabled !== false}
                  onChange={(e) => handleChange("notifications", "smsEnabled", e.target.checked)}
                  className="h-5 w-5 text-green-600 rounded"
                />
                <span className="text-gray-700">SMS Notifications</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.notifications?.emailEnabled !== false}
                  onChange={(e) => handleChange("notifications", "emailEnabled", e.target.checked)}
                  className="h-5 w-5 text-green-600 rounded"
                />
                <span className="text-gray-700">Email Notifications</span>
              </label>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
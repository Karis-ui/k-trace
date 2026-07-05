// src/pages/buyer/BuyerSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Save, Bell, UserCog, Shield, RefreshCw, Building, Mail, Phone } from "lucide-react";

export default function BuyerSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [settings, setSettings] = useState({
        profile: {
            name: "",
            email: "",
            phone: "",
            company: "",
            status: "active"
        },
        preferences: {
            notifications: { sms: true, email: true },
            language: "en",
            currency: "USD"
        }
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                "https://zesty-ktrace.up.railway.app/api/buyer/settings",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setSettings(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching settings:", err);
            setMessage({ type: "error", text: err.response?.data?.error || "Failed to load settings" });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage("");
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(
                "https://zesty-ktrace.up.railway.app/api/buyer/settings",
                settings,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setMessage({ type: "success", text: "Settings saved successfully!" });
            }
        } catch (err) {
            console.error("Error saving settings:", err);
            setMessage({ type: "error", text: err.response?.data?.error || "Failed to save settings" });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const handleProfileChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            profile: { ...prev.profile, [field]: value }
        }));
    };

    const handlePreferencesChange = (category, field, value) => {
        setSettings(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [category]: {
                    ...prev.preferences[category],
                    [field]: value
                }
            }
        }));
    };

    if (loading) {
        return (
            <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
                        <UserCog className="text-blue-600" /> Settings
                    </h1>
                    <button
                        onClick={fetchSettings}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" /> Refresh
                    </button>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg mb-4 ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Profile Settings */}
                    <motion.div whileHover={{ scale: 1.01 }} className="bg-white/90 p-6 rounded-xl shadow-lg border border-blue-50">
                        <h2 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                            <UserCog className="text-blue-500" /> Profile Settings
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={settings.profile?.name || ""}
                                    onChange={(e) => handleProfileChange("name", e.target.value)}
                                    className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={settings.profile?.email || ""}
                                    onChange={(e) => handleProfileChange("email", e.target.value)}
                                    className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="text"
                                    value={settings.profile?.phone || ""}
                                    onChange={(e) => handleProfileChange("phone", e.target.value)}
                                    className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                <input
                                    type="text"
                                    value={settings.profile?.company || ""}
                                    onChange={(e) => handleProfileChange("company", e.target.value)}
                                    className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Notification Settings */}
                    <motion.div whileHover={{ scale: 1.01 }} className="bg-white/90 p-6 rounded-xl shadow-lg border border-blue-50">
                        <h2 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                            <Bell className="text-blue-500" /> Notification Preferences
                        </h2>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={settings.preferences?.notifications?.email !== false}
                                    onChange={(e) => handlePreferencesChange("notifications", "email", e.target.checked)}
                                    className="accent-blue-600 w-5 h-5"
                                />
                                <span className="text-blue-800">Email Notifications</span>
                            </label>
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={settings.preferences?.notifications?.sms !== false}
                                    onChange={(e) => handlePreferencesChange("notifications", "sms", e.target.checked)}
                                    className="accent-blue-600 w-5 h-5"
                                />
                                <span className="text-blue-800">SMS Notifications</span>
                            </label>
                        </div>
                    </motion.div>

                    {/* Language & Currency */}
                    <motion.div whileHover={{ scale: 1.01 }} className="bg-white/90 p-6 rounded-xl shadow-lg border border-blue-50">
                        <h2 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                            <Shield className="text-blue-500" /> Language & Currency
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                <select
                                    value={settings.preferences?.language || "en"}
                                    onChange={(e) => handlePreferencesChange("", "language", e.target.value)}
                                    className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="en">English</option>
                                    <option value="sw">Swahili</option>
                                    <option value="fr">French</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                <select
                                    value={settings.preferences?.currency || "USD"}
                                    onChange={(e) => handlePreferencesChange("", "currency", e.target.value)}
                                    className="w-full border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="USD">USD</option>
                                    <option value="KES">KES</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-blue-300"
                    >
                        <Save className="h-5 w-5" />
                        {saving ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </div>
        </div>
    );
}
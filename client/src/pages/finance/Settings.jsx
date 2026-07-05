// src/pages/finance/FinanceSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Save, Bell, UserCog, Shield, DollarSign, RefreshCw } from "lucide-react";

export default function FinanceSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [settings, setSettings] = useState({
        profile: { name: "", email: "", phone: "", station: "" },
        financeDetails: {
            maxPayoutLimit: 10000,
            requiresApproval: true,
            permissions: {
                canApprovePayouts: true,
                canProcessPayouts: true,
                canGenerateReports: true,
                canViewAllPayouts: true
            }
        },
        preferences: {
            notifications: { email: true, sms: true },
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
                "https://zesty-ktrace.up.railway.app/api/finance/settings",
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
                "https://zesty-ktrace.up.railway.app/api/finance/settings",
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

    const handleChange = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleNestedChange = (section, subsection, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [subsection]: {
                    ...prev[section][subsection],
                    [field]: value
                }
            }
        }));
    };

    if (loading) {
        return (
            <div className="p-6 min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-white">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-purple-900 flex items-center gap-2">
                        <UserCog className="text-purple-600" /> Settings
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
                    <motion.div whileHover={{ scale: 1.01 }} className="bg-white/90 p-6 rounded-xl shadow-lg border border-purple-50">
                        <h2 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
                            <UserCog className="text-purple-500" /> Profile Settings
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={settings.profile?.name || ""}
                                    onChange={(e) => handleChange("profile", "name", e.target.value)}
                                    className="w-full border border-purple-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={settings.profile?.email || ""}
                                    onChange={(e) => handleChange("profile", "email", e.target.value)}
                                    className="w-full border border-purple-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="text"
                                    value={settings.profile?.phone || ""}
                                    onChange={(e) => handleChange("profile", "phone", e.target.value)}
                                    className="w-full border border-purple-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Station</label>
                                <input
                                    type="text"
                                    value={settings.profile?.station || ""}
                                    onChange={(e) => handleChange("profile", "station", e.target.value)}
                                    className="w-full border border-purple-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Finance Settings */}
                    <motion.div whileHover={{ scale: 1.01 }} className="bg-white/90 p-6 rounded-xl shadow-lg border border-purple-50">
                        <h2 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
                            <DollarSign className="text-purple-500" /> Finance Settings
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Payout Limit ($)</label>
                                <input
                                    type="number"
                                    value={settings.financeDetails?.maxPayoutLimit || 10000}
                                    onChange={(e) => handleChange("financeDetails", "maxPayoutLimit", parseFloat(e.target.value))}
                                    className="w-full border border-purple-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Requires Approval</label>
                                <select
                                    value={settings.financeDetails?.requiresApproval ? "yes" : "no"}
                                    onChange={(e) => handleChange("financeDetails", "requiresApproval", e.target.value === "yes")}
                                    className="w-full border border-purple-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Permissions */}
                    <motion.div whileHover={{ scale: 1.01 }} className="bg-white/90 p-6 rounded-xl shadow-lg border border-purple-50">
                        <h2 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
                            <Shield className="text-purple-500" /> Permissions
                        </h2>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={settings.financeDetails?.permissions?.canApprovePayouts !== false}
                                    onChange={(e) => handleNestedChange("financeDetails", "permissions", "canApprovePayouts", e.target.checked)}
                                    className="accent-purple-600 w-5 h-5"
                                />
                                <span className="text-purple-800">Can Approve Payouts</span>
                            </label>
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={settings.financeDetails?.permissions?.canProcessPayouts !== false}
                                    onChange={(e) => handleNestedChange("financeDetails", "permissions", "canProcessPayouts", e.target.checked)}
                                    className="accent-purple-600 w-5 h-5"
                                />
                                <span className="text-purple-800">Can Process Payouts</span>
                            </label>
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={settings.financeDetails?.permissions?.canGenerateReports !== false}
                                    onChange={(e) => handleNestedChange("financeDetails", "permissions", "canGenerateReports", e.target.checked)}
                                    className="accent-purple-600 w-5 h-5"
                                />
                                <span className="text-purple-800">Can Generate Reports</span>
                            </label>
                        </div>
                    </motion.div>

                    {/* Notification Settings */}
                    <motion.div whileHover={{ scale: 1.01 }} className="bg-white/90 p-6 rounded-xl shadow-lg border border-purple-50">
                        <h2 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
                            <Bell className="text-purple-500" /> Notification Preferences
                        </h2>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={settings.preferences?.notifications?.email !== false}
                                    onChange={(e) => handleNestedChange("preferences", "notifications", "email", e.target.checked)}
                                    className="accent-purple-600 w-5 h-5"
                                />
                                <span className="text-purple-800">Email Notifications</span>
                            </label>
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={settings.preferences?.notifications?.sms !== false}
                                    onChange={(e) => handleNestedChange("preferences", "notifications", "sms", e.target.checked)}
                                    className="accent-purple-600 w-5 h-5"
                                />
                                <span className="text-purple-800">SMS Notifications</span>
                            </label>
                        </div>
                    </motion.div>

                    {/* Language & Currency */}
                    <motion.div whileHover={{ scale: 1.01 }} className="bg-white/90 p-6 rounded-xl shadow-lg border border-purple-50">
                        <h2 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
                            <Shield className="text-purple-500" /> Language & Currency
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                <select
                                    value={settings.preferences?.language || "en"}
                                    onChange={(e) => handleChange("preferences", "language", e.target.value)}
                                    className="w-full border border-purple-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
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
                                    onChange={(e) => handleChange("preferences", "currency", e.target.value)}
                                    className="w-full border border-purple-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
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
                        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2 disabled:bg-purple-300"
                    >
                        <Save className="h-5 w-5" />
                        {saving ? "Saving..." : "Save All Settings"}
                    </button>
                </div>
            </div>
        </div>
    );
}
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: "Kahawa Trace",
    logoUrl: "",
    notifyEmail: true,
    notifySMS: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/admin/settings");
        setSettings(res.data.settings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put("http://localhost:5000/api/admin/settings", settings);
      setMessage("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) return <div className="p-8 text-green-700 font-semibold">Loading settings...</div>;

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      <h2 className="text-3xl font-bold text-green-900 mb-6">Admin Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-2xl p-6 shadow border border-green-50">
          <h3 className="text-xl font-semibold text-green-800 mb-4">General</h3>
          <label className="block mb-3">
            <span className="text-green-700 font-medium">Site Name</span>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="mt-1 block w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </label>
          <label className="block mb-3">
            <span className="text-green-700 font-medium">Logo URL</span>
            <input
              type="text"
              name="logoUrl"
              value={settings.logoUrl}
              onChange={handleChange}
              className="mt-1 block w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </label>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-6 shadow border border-green-50">
          <h3 className="text-xl font-semibold text-green-800 mb-4">Notifications</h3>
          <label className="flex items-center mb-3">
            <input
              type="checkbox"
              name="notifyEmail"
              checked={settings.notifyEmail}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-green-700 font-medium">Email Notifications</span>
          </label>
          <label className="flex items-center mb-3">
            <input
              type="checkbox"
              name="notifySMS"
              checked={settings.notifySMS}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-green-700 font-medium">SMS Notifications</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="text-center mt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {message && <p className="mt-3 text-green-800 font-medium">{message}</p>}
      </div>
    </div>
  );
}

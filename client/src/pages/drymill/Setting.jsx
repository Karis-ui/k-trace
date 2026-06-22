import React, { useState } from "react";
import { Save, Bell, UserCog, Shield } from "lucide-react";

export default function Settingss() {
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");
  const [password, setPassword] = useState("");

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="p-6 animate-fadeIn">
      <h1 className="text-2xl font-semibold text-green-800 mb-6 flex items-center gap-2">
        <UserCog className="text-green-600" /> Account & System Settings
      </h1>

      {/* Notification Settings */}
      <div className="bg-white p-6 rounded-xl mb-6 shadow-md border border-green-100 hover:shadow-lg transition">
        <h2 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
          <Bell className="text-green-500" /> Notifications
        </h2>
        <label className="flex items-center gap-3 text-green-800">
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            className="accent-green-600 w-5 h-5"
          />
          Enable email and SMS alerts for payouts and grading reports
        </label>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white p-6 rounded-xl mb-6 shadow-md border border-green-100 hover:shadow-lg transition">
        <h2 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
          <Shield className="text-green-500" /> Appearance
        </h2>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="border border-green-300 rounded-lg px-3 py-2 text-green-800 bg-white shadow-sm"
        >
          <option value="light">Light Theme</option>
          <option value="dark">Dark Theme</option>
        </select>
      </div>

      {/* Password Reset */}
      <div className="bg-white p-6 rounded-xl mb-6 shadow-md border border-green-100 hover:shadow-lg transition">
        <h2 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
          <Shield className="text-green-500" /> Security
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-green-300 rounded-lg px-3 py-2 w-full text-green-800 focus:ring-2 focus:ring-green-400 outline-none"
          />
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

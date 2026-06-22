// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import logo from "../assets/1.jpg";

export default function ResetPassword() {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [rules, setRules] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // token comes from verify-code response, e.g., /reset-password?token=xxxxx
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  const handlePasswordChange = (value) => {
    setPassword1(value);
    setRules({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[^A-Za-z0-9]/.test(value),
    });
  };

  const isPasswordValid = Object.values(rules).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password1 !== password2) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        newPassword: password1,
      });

      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const Rule = ({ valid, text }) => (
    <p className={`flex items-center text-sm ${valid ? "text-green-500" : "text-red-500"}`}>
      {valid ? <CheckCircle size={16} className="mr-1" /> : <XCircle size={16} className="mr-1" />}
      {text}
    </p>
  );

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-300 via-white to-green-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="backdrop-blur-lg bg-white/40 shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="KahawaTrace Logo" className="h-16 w-16 mb-3" />
          <h2 className="text-2xl font-bold text-green-700">Reset Your Password</h2>
          <p className="text-gray-600 text-sm text-center mt-2">
            Enter your new password below.
          </p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password 1 */}
          <div className="flex items-center border rounded-lg bg-white/60 focus-within:ring-2 focus-within:ring-green-500">
            <Lock className="ml-3 text-gray-400" size={20} />
            <input
              type={showPassword1 ? "text" : "password"}
              placeholder="New Password"
              value={password1}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
              className="flex-1 px-3 py-2 bg-transparent outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword1(!showPassword1)}
              className="pr-3 text-gray-500 hover:text-green-600"
            >
              {showPassword1 ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Password 2 */}
          <div className="flex items-center border rounded-lg bg-white/60 focus-within:ring-2 focus-within:ring-green-500">
            <Lock className="ml-3 text-gray-400" size={20} />
            <input
              type={showPassword2 ? "text" : "password"}
              placeholder="Confirm New Password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              className="flex-1 px-3 py-2 bg-transparent outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword2(!showPassword2)}
              className="pr-3 text-gray-500 hover:text-green-600"
            >
              {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Password Rules */}
          <div className="mb-2">
            <Rule valid={rules.length} text="At least 8 characters" />
            <Rule valid={rules.uppercase} text="At least one uppercase letter" />
            <Rule valid={rules.lowercase} text="At least one lowercase letter" />
            <Rule valid={rules.number} text="At least one number" />
            <Rule valid={rules.special} text="At least one special character" />
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={!isPasswordValid || loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 rounded-lg transition duration-300 shadow-lg disabled:bg-gray-400"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

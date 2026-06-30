// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, Phone, Key } from "lucide-react";
import logo from "../../assets/1.jpg";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [method, setMethod] = useState("email"); // email or phone
  const [value, setValue] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!value) {
        setError("Please provide a number or email.");
        setLoading(false);
        return;
      }

      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email: method === "email" ? value : undefined,
        phone: method === "phone" ? value : undefined,
      });

      setCodeSent(true);
      setSuccess(`Verification code sent to your ${method}.`);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to send verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        identifier: value,
        code: verificationCode,
      });

      const { token } = res.data;
      setSuccess("Code verified. Redirecting to reset password...");

      // Redirect to your existing ResetPassword page with token
      navigate(`/reset-password?token=${token}`);
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-2xl font-bold text-green-700">Forgot Password</h2>
          <p className="text-gray-600 text-sm text-center mt-2">
            Select how you want to receive your verification code.
          </p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}

        {!codeSent ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="flex items-center border rounded-lg bg-white/60 px-3">
              {method === "email" ? <Mail className="text-gray-400" size={20} /> : <Phone className="text-gray-400" size={20} />}
              <select
                name="method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="flex-1 px-3 py-2 bg-transparent outline-none"
              >
                <option value="email">Email</option>
                <option value="phone">Phone Number</option>
              </select>
            </div>

            <div className="flex items-center border rounded-lg bg-white/60 focus-within:ring-2 focus-within:ring-green-500">
              {method === "email" ? <Mail className="ml-3 text-gray-400" size={20} /> : <Phone className="ml-3 text-gray-400" size={20} />}
              <input
                type={method === "email" ? "email" : "text"}
                placeholder={method === "email" ? "Enter your email" : "Enter your phone number"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex-1 px-3 py-2 bg-transparent outline-none"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 rounded-lg transition duration-300 shadow-lg"
            >
              {loading ? "Sending..." : "Send Code"}
            </motion.button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="flex items-center border rounded-lg bg-white/60 focus-within:ring-2 focus-within:ring-green-500">
              <Key className="ml-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="flex-1 px-3 py-2 bg-transparent outline-none"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 rounded-lg transition duration-300 shadow-lg"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Briefcase } from "lucide-react";
import {ReactTyped} from "react-typed";
import logo from "../assets/2.jpg";
import SocialLogin from "../social/socialLogin";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "farmer",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      const { token, user } = res.data;

      if (formData.rememberMe) {
        localStorage.setItem("authToken", token);
      } else {
        sessionStorage.setItem("authToken", token);
      }

      setSuccess(`Welcome back, ${user.username}!`);

      setTimeout(() => {
        switch (user.role) {
          case "farmer":
            navigate("/farmer/dashboard");
            break;
          case "buyer":
            navigate("/buyer/dashboard");
            break;
          case "wetmill":
            navigate("/wetmill/dashboard");
            break;
          case "drymill":
            navigate("/drymill/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/dashboard");
        }
      }, 1500);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email, password, or role.");
      } else if (err.response?.data?.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-green-100 via-green-50 to-white">
      <div className="flex-1 flex justify-center items-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-lg bg-white/60 shadow-xl rounded-2xl p-8 w-full max-w-md border border-green-100"
        >
          <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
            Login to KahawaTrace
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-600 text-center mb-4">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center border rounded-lg bg-white/70 px-3">
              <Briefcase className="text-gray-400" size={20} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="flex-1 px-3 py-2 bg-transparent outline-none"
                required
              >
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
                <option value="wetmill">Wet Mill</option>
                <option value="drymill">Dry Mill</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <div className="flex items-center border rounded-lg bg-white/70 focus-within:ring-2 focus-within:ring-green-500">
                <Mail className="ml-3 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 bg-transparent outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <div className="flex items-center border rounded-lg bg-white/70 focus-within:ring-2 focus-within:ring-green-500">
                <Lock className="ml-3 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 bg-transparent outline-none"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-3 text-gray-500 hover:text-green-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-gray-600 text-sm">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="mr-2"
                />
                Remember Me
              </label>
              <a href="/forgot-password" className="text-green-600 hover:underline text-sm">
                Forgot Password?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 rounded-lg transition duration-300 shadow-lg"
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  ></path>
                </svg>
              )}
              {loading ? "Logging in..." : "Login"}
            </motion.button>

            <SocialLogin />

            <p className="text-center text-gray-600 text-sm mt-3">
              Don't have an account?{" "}
              <a href="/signup" className="text-green-600 hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </motion.div>
      </div>

      <div className="hidden md:flex flex-1 flex-col justify-center items-center bg-green-200 p-8 text-center">
        <motion.img
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          src={logo}
          alt="KahawaTrace Logo"
          className="h-48 w-48 mb-4 rounded-full shadow-xl border-4 border-white"
        />
        <h3 className="text-3xl font-bold text-green-800 mb-4">KahawaTrace</h3>
        <ReactTyped
          strings={[
            "Welcome back to KahawaTrace ",
            "Track your coffee journey seamlessly ",
            "Empowering farmers and buyers alike ",
            "Transparency from farm to cup ",
          ]}
          typeSpeed={60}
          backSpeed={40}
          loop
          className="text-xl text-green-900 max-w-md"
        />
      </div>
    </div>
  );
}

// src/pages/Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ReactTyped } from "react-typed";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Hash,
  Briefcase,
  CheckCircle,
  XCircle,
  Building,
} from "lucide-react";
import logo from "../../assets/2.jpg";
import SocialLogin from "../../social/socialLogin";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    station: "",
    idNumber: "",
    company: "",      // ✅ Added for buyer
    role: "farmer",
    password: "",
    confirmPassword: "",
  });

  const [rules, setRules] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      setRules({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[^A-Za-z0-9]/.test(value),
      });
    }
  };

  const isPasswordValid = Object.values(rules).every(Boolean);

  // Get API URL from environment or use deployed URL
  const API_URL = process.env.REACT_APP_API_URL || 'https://zesty-ktrace.up.railway.app/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Validate required fields based on role
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Name, email and phone are required.");
      setLoading(false);
      return;
    }

    // Station required for farmers and operators
    if (['farmer', 'drymill', 'wetmill', 'finance'].includes(formData.role) && !formData.station) {
      setError("Station is required for farmers and operators.");
      setLoading(false);
      return;
    }

    // Company required for buyers
    if (formData.role === 'buyer' && !formData.company) {
      setError("Company name is required for buyers.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        ...(formData.station && { station: formData.station }),
        ...(formData.company && { company: formData.company }),
        ...(formData.idNumber && { id: formData.idNumber }),
      };

      console.log("📤 Sending registration payload:", payload);

      const res = await axios.post(`${API_URL}/auth/register`, payload);

      console.log("✅ Registration response:", res.data);

      if (res.data.success) {
        if (res.data.data?.token) {
          localStorage.setItem("token", res.data.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.data.user));
          localStorage.setItem("role", res.data.data.role);
        }

        setSuccess("Registration successful! Redirecting...");

        setTimeout(() => {
          const role = res.data.data?.role || formData.role;
          const rolePaths = {
            farmer: "/farmer",
            buyer: "/buyer",
            wetmill: "/wetmill",
            drymill: "/drymill",
            finance: "/finance",
            admin: "/admin",
          };
          navigate(rolePaths[role] || "/login");
        }, 1500);
      }
    } catch (err) {
      console.error("❌ Registration error:", err.response?.data);
      setError(err.response?.data?.error || "Registration failed. Please try again.");
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-green3 via-white to-green3">
      {/* LEFT SIDE */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="hidden md:flex md:w-1/2 flex-col items-center bg-gradient-to-br from-green2 via-[#A3DBC5FF] to-green1 text-white p-10 relative overflow-hidden animate-glow"
      >
        <motion.img
          src={logo}
          alt="KahawaTrace Logo"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="h-70 w-80 rounded-2xl shadow-2xl mb-4 mt-[-2rem]"
        />

        <h1 className="text-5xl font-extrabold mb-4 tracking-wide text-center drop-shadow-md">
          KahawaTrace
        </h1>

        <ReactTyped
          strings={[
            "Join KahawaTrace and grow your coffee network ",
            "Transparency and trust in every bean ",
            "Empowering farmers and buyers across Kenya 🇰🇪",
          ]}
          typeSpeed={60}
          backSpeed={30}
          loop
          className="text-2xl md:text-3xl text-white/100 text-center font-semibold max-w-lg leading-snug"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent pointer-events-none"></div>
      </motion.div>

      {/* RIGHT SIDE (SIGNUP FORM) */}
      <div className="flex-1 flex justify-center items-center p-8 bg-gradient-to-br from-white via-green-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-xl bg-white/85 shadow-2xl rounded-2xl p-8 w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-green1 text-center mb-6">
            Create Your KahawaTrace Account
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-600 text-center mb-4">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4 text-lg">
            {/* Name */}
            <div className="flex items-center border rounded-lg bg-white/70 focus-within:ring-2 focus-within:ring-green2">
              <User className="ml-3 text-gray-400" size={22} />
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleChange}
                required
                className="flex-1 px-3 py-2 bg-transparent outline-none text-gray-700"
              />
            </div>

            {/* Email */}
            <div className="flex items-center border rounded-lg bg-white/70 focus-within:ring-2 focus-within:ring-green2">
              <Mail className="ml-3 text-gray-400" size={22} />
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                required
                className="flex-1 px-3 py-2 bg-transparent outline-none text-gray-700"
              />
            </div>

            {/* Phone */}
            <div className="flex items-center border rounded-lg bg-white/70 focus-within:ring-2 focus-within:ring-green2">
              <Phone className="ml-3 text-gray-400" size={22} />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={handleChange}
                required
                className="flex-1 px-3 py-2 bg-transparent outline-none text-gray-700"
              />
            </div>

            {/* Station - shown for farmers and operators */}
            {(formData.role === 'farmer' || formData.role === 'drymill' || formData.role === 'wetmill' || formData.role === 'finance') && (
              <div className="flex items-center border rounded-lg bg-white/70 focus-within:ring-2 focus-within:ring-green2">
                <MapPin className="ml-3 text-gray-400" size={22} />
                <input
                  type="text"
                  name="station"
                  placeholder="Station / Location *"
                  value={formData.station}
                  onChange={handleChange}
                  required
                  className="flex-1 px-3 py-2 bg-transparent outline-none text-gray-700"
                />
              </div>
            )}

            {/* Company - shown for buyers */}
            {formData.role === 'buyer' && (
              <div className="flex items-center border rounded-lg bg-white/70 focus-within:ring-2 focus-within:ring-green2">
                <Building className="ml-3 text-gray-400" size={22} />
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name *"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="flex-1 px-3 py-2 bg-transparent outline-none text-gray-700"
                />
              </div>
            )}

            {/* ID Number - Optional */}
            <div className="flex items-center border rounded-lg bg-white/70 focus-within:ring-2 focus-within:ring-green2">
              <Hash className="ml-3 text-gray-400" size={22} />
              <input
                type="text"
                name="idNumber"
                placeholder="ID Number (Optional)"
                value={formData.idNumber}
                onChange={handleChange}
                className="flex-1 px-3 py-2 bg-transparent outline-none text-gray-700"
              />
            </div>

            {/* Role */}
            <div className="flex items-center border rounded-lg bg-white/70 px-3">
              <Briefcase className="text-gray-400" size={22} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="flex-1 px-3 py-2 bg-transparent outline-none text-gray-700"
                required
              >
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
                <option value="wetmill">Wet Mill</option>
                <option value="drymill">Dry Mill</option>
                <option value="finance">Finance</option>
              </select>
            </div>

            {/* Password */}
            <div className="flex items-center border rounded-lg bg-white/70 focus-within:ring-2 focus-within:ring-green2">
              <Lock className="ml-3 text-gray-400" size={22} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password *"
                value={formData.password}
                onChange={handleChange}
                required
                className="flex-1 px-3 py-2 bg-transparent outline-none text-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="mr-3 text-gray-500 hover:text-green2"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="flex items-center border rounded-lg bg-white/70 focus-within:ring-2 focus-within:ring-green2">
              <Lock className="ml-3 text-gray-400" size={22} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password *"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="flex-1 px-3 py-2 bg-transparent outline-none text-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="mr-3 text-gray-500 hover:text-green2"
              >
                {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            <div className="pl-8 space-y-1 text-base">
              <Rule valid={rules.length} text="At least 8 characters" />
              <Rule valid={rules.uppercase} text="Contains uppercase letter" />
              <Rule valid={rules.lowercase} text="Contains lowercase letter" />
              <Rule valid={rules.number} text="Contains number" />
              <Rule valid={rules.special} text="Contains special character" />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={!isPasswordValid || loading}
              className="w-full flex justify-center items-center bg-gradient-to-r from-green1 to-green2 hover:from-green2 hover:to-green1 text-white py-3 rounded-lg transition duration-300 shadow-lg disabled:bg-gray-400 text-lg font-semibold"
            >
              {loading ? "Signing up..." : "Signup"}
            </motion.button>

            <SocialLogin />

            <p className="mt-4 text-center text-gray-600 text-base">
              Already have an account?{" "}
              <a href="/login" className="text-green1 hover:underline">
                Login
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
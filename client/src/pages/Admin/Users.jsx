import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trash2, UserPlus, UserCheck, UserX } from "lucide-react";

const roleColors = {
  admin: "bg-green-600 text-white",
  wetmill: "bg-green-400 text-white",
  drymill: "bg-emerald-500 text-white",
  exporter: "bg-amber-500 text-white",
  buyer: "bg-blue-400 text-white",
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  const handleSuspend = async (id, currentStatus) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/users/${id}/suspend`, {
        suspend: !currentStatus,
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, suspended: res.data.suspended } : u))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update user status.");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-green-900">System Users</h2>
        <button
          onClick={() => navigate("/admin/users/add")}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <UserPlus className="w-5 h-5" /> Add User
        </button>
      </div>

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-white/80 backdrop-blur-lg rounded-2xl shadow-md animate-pulse"
              ></div>
            ))
          : users.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-5 hover:shadow-xl transition transform"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${roleColors[user.role] || "bg-gray-400 text-white"}`}>
                    {user.role.toUpperCase()}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      user.suspended ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
                    }`}
                  >
                    {user.suspended ? "Suspended" : "Active"}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-green-900">{user.username}</h3>
                <p className="text-sm text-green-700">{user.email}</p>
                <p className="text-sm text-green-500">ID: {user.id_number}</p>

                <div className="flex justify-end mt-3 gap-2">
                  <button
                    onClick={() => handleSuspend(user._id, user.suspended)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-yellow-300 text-yellow-900 hover:bg-yellow-400"
                  >
                    {user.suspended ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                    {user.suspended ? "Activate" : "Suspend"}
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-300 text-red-900 hover:bg-red-400"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
      </div>
    </div>
  );
}

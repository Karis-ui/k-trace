// src/pages/admin/Users.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Trash2, UserPlus, UserCheck, UserX, Search } from "lucide-react";

const roleColors = {
  admin: "bg-purple-600 text-white",
  drymill: "bg-emerald-500 text-white",
  wetmill: "bg-green-400 text-white",
  finance: "bg-blue-500 text-white",
  farmer: "bg-amber-500 text-white",
  buyer: "bg-cyan-500 text-white"
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "farmer",
    station: "",
    company: ""
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/admin/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data) {
        // Combine all users from different collections
        const allUsers = [
          ...(res.data.farmers || []).map(u => ({ ...u, type: "farmer" })),
          ...(res.data.operators || []).map(u => ({ ...u, type: u.role || "operator" })),
          ...(res.data.buyers || []).map(u => ({ ...u, type: "buyer" }))
        ];
        setUsers(allUsers);
      }
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

  const handleDelete = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/admin/${type}/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete user.");
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Name, email and password are required");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        "http://localhost:5000/api/auth/register",
        newUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewUser({ name: "", email: "", phone: "", password: "", role: "farmer", station: "", company: "" });
      setShowAddModal(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add user.");
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-green-900">System Users</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <UserPlus className="w-5 h-5" /> Add User
          </button>
          <button
            onClick={fetchUsers}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/90 p-4 rounded-xl shadow flex items-center gap-3">
        <Search className="text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          className="flex-1 border-none focus:outline-none bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="text-sm text-gray-500">{filteredUsers.length} users</span>
      </div>

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-white/80 rounded-2xl shadow-md animate-pulse"></div>
          ))
          : filteredUsers.map((user) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-5 hover:shadow-xl transition"
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${roleColors[user.type] || "bg-gray-400 text-white"}`}>
                  {user.type?.toUpperCase() || user.role?.toUpperCase() || "USER"}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${user.status === "active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                  {user.status || "Active"}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-green-900">{user.name}</h3>
              <p className="text-sm text-green-700">{user.email}</p>
              <p className="text-sm text-green-500">{user.phone || "No phone"}</p>
              {user.station && <p className="text-xs text-green-400">Station: {user.station}</p>}
              {user.company && <p className="text-xs text-green-400">Company: {user.company}</p>}

              <div className="flex justify-end mt-3 gap-2">
                <button
                  onClick={() => handleDelete(user._id, user.type)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-300 text-red-900 hover:bg-red-400 transition"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-green-900 mb-4">Add New User</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name *"
                className="w-full border border-green-300 rounded-lg p-2"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email *"
                className="w-full border border-green-300 rounded-lg p-2"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full border border-green-300 rounded-lg p-2"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password *"
                className="w-full border border-green-300 rounded-lg p-2"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
              <select
                className="w-full border border-green-300 rounded-lg p-2"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
                <option value="drymill">Drymill Operator</option>
                <option value="wetmill">Wetmill Operator</option>
                <option value="finance">Finance Operator</option>
                <option value="admin">Admin</option>
              </select>
              {(newUser.role === "farmer" || newUser.role === "drymill" || newUser.role === "wetmill" || newUser.role === "finance") && (
                <input
                  type="text"
                  placeholder="Station"
                  className="w-full border border-green-300 rounded-lg p-2"
                  value={newUser.station}
                  onChange={(e) => setNewUser({ ...newUser, station: e.target.value })}
                />
              )}
              {newUser.role === "buyer" && (
                <input
                  type="text"
                  placeholder="Company"
                  className="w-full border border-green-300 rounded-lg p-2"
                  value={newUser.company}
                  onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
                />
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddUser}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Add User
              </button>
              <button
                onClick={() => { setShowAddModal(false); setNewUser({ name: "", email: "", phone: "", password: "", role: "farmer", station: "", company: "" }); }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
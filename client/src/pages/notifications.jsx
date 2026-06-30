// src/pages/common/Notifications.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Bell, CheckCircle, AlertCircle, Clock, Package,
  DollarSign, Award, RefreshCw, Mail, MessageSquare,
  ChevronRight, Filter, CheckCheck
} from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      // This endpoint would need to be created
      const res = await axios.get(
        "http://localhost:5000/api/notifications",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setNotifications(res.data.data || []);
        setUnreadCount(res.data.data.filter(n => !n.read).length || 0);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err.response?.data?.error || "Failed to load notifications");
      // Fallback: Use sample data for demo
      setNotifications(getSampleNotifications());
    } finally {
      setLoading(false);
    }
  };

  const getSampleNotifications = () => {
    return [
      {
        id: "1",
        type: "payout",
        title: "Payout Completed",
        message: "Your payout of $450.00 has been processed successfully.",
        date: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
        icon: "💰",
        link: "/farmer/payouts"
      },
      {
        id: "2",
        type: "grading",
        title: "Coffee Graded",
        message: "Your coffee has been graded as Specialty with a score of 85.5.",
        date: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: false,
        icon: "⭐",
        link: "/farmer/gradings"
      },
      {
        id: "3",
        type: "delivery",
        title: "Delivery Recorded",
        message: "Your delivery of 500kg has been recorded successfully.",
        date: new Date(Date.now() - 1000 * 60 * 60 * 5),
        read: true,
        icon: "📦",
        link: "/farmer/deliveries"
      },
      {
        id: "4",
        type: "price",
        title: "Price Update",
        message: "New coffee price: $4.50 per kg for Specialty grade.",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24),
        read: true,
        icon: "📈",
        link: "/farmer/dashboard"
      },
      {
        id: "5",
        type: "system",
        title: "System Update",
        message: "System maintenance scheduled for tomorrow at 2:00 AM.",
        date: new Date(Date.now() - 1000 * 60 * 60 * 48),
        read: true,
        icon: "⚙️",
        link: "#"
      }
    ];
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        "http://localhost:5000/api/notifications/read-all",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const filteredNotifications = filter === "all"
    ? notifications
    : filter === "unread"
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter);

  const getTypeIcon = (type) => {
    const icons = {
      payout: <DollarSign className="h-5 w-5 text-green-600" />,
      grading: <Award className="h-5 w-5 text-purple-600" />,
      delivery: <Package className="h-5 w-5 text-blue-600" />,
      price: <AlertCircle className="h-5 w-5 text-amber-600" />,
      system: <Bell className="h-5 w-5 text-gray-600" />
    };
    return icons[type] || <Bell className="h-5 w-5 text-gray-600" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      payout: "bg-green-50 border-green-200",
      grading: "bg-purple-50 border-purple-200",
      delivery: "bg-blue-50 border-blue-200",
      price: "bg-amber-50 border-amber-200",
      system: "bg-gray-50 border-gray-200"
    };
    return colors[type] || "bg-gray-50 border-gray-200";
  };

  const getTimeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="h-7 w-7 text-gray-700" /> Notifications
            </h2>
            <p className="text-sm text-gray-500">
              {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "All caught up! 🎉"}
            </p>
          </div>
          <div className="flex gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <CheckCheck className="h-4 w-4" /> Mark All Read
              </button>
            )}
            <button
              onClick={fetchNotifications}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/90 rounded-xl p-4 shadow mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm transition ${filter === "all" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg text-sm transition ${filter === "unread" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter("payout")}
            className={`px-4 py-2 rounded-lg text-sm transition ${filter === "payout" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            Payouts
          </button>
          <button
            onClick={() => setFilter("grading")}
            className={`px-4 py-2 rounded-lg text-sm transition ${filter === "grading" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            Gradings
          </button>
          <button
            onClick={() => setFilter("delivery")}
            className={`px-4 py-2 rounded-lg text-sm transition ${filter === "delivery" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            Deliveries
          </button>
          <button
            onClick={() => setFilter("price")}
            className={`px-4 py-2 rounded-lg text-sm transition ${filter === "price" ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            Price Updates
          </button>
        </div>

        {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl p-5 shadow border-l-4 transition hover:shadow-lg ${notification.read ? "border-gray-300" : "border-blue-500"
                } ${getTypeColor(notification.type)}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.read ? "bg-gray-100" : "bg-blue-100"
                    }`}>
                    {getTypeIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h4 className={`font-semibold ${notification.read ? "text-gray-700" : "text-gray-900"}`}>
                        {notification.title}
                      </h4>
                      <p className={`text-sm ${notification.read ? "text-gray-500" : "text-gray-700"}`}>
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {getTimeAgo(notification.date)}
                      </span>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    {notification.link && notification.link !== "#" && (
                      <a
                        href={notification.link}
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        View Details <ChevronRight className="h-3 w-3" />
                      </a>
                    )}
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12 bg-white/80 rounded-2xl">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-lg">No notifications</p>
              <p className="text-sm text-gray-400">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
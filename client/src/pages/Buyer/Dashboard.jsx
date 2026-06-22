// src/pages/farmer/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  CloudRain, TrendingUp, Sprout, Users,
  ArrowRight, Thermometer, Droplets, Wind, Sun,
  AlertTriangle, Plus, Eye
} from "lucide-react";
import {
  mockProducts, mockOrders, mockForumPosts, mockAlerts,
} from "../../data/mockData";

export default function BuyerDashboard() {
  const [greeting, setGreeting] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
  }, []);

  // Weather data
  const weatherData = {
    today: { temperature: "26°C", humidity: "65%", windSpeed: "12 km/h", rainfall: "2mm" },
    forecast: [
      { day: "Tomorrow", temp: "28°C", condition: "Sunny", icon: Sun },
      { day: "Wednesday", temp: "24°C", condition: "Light Rain", icon: CloudRain },
      { day: "Thursday", temp: "27°C", condition: "Cloudy", icon: CloudRain },
    ],
  };

  // Quick Stats
  const quickStats = [
    { title: "Active Crops", value: "3", subtitle: "Maize, Beans, Tomatoes", icon: Sprout, color: "text-green-600" },
    { title: "Market Listings", value: "2", subtitle: "1 active, 1 sold", icon: TrendingUp, color: "text-blue-500" },
    { title: "Weather Alerts", value: "1", subtitle: "Rain expected tomorrow", icon: CloudRain, color: "text-yellow-500" },
    { title: "Community Posts", value: "12", subtitle: "New discussions", icon: Users, color: "text-purple-600" },
  ];

  // Mock data
  const recentProducts = mockProducts.slice(0, 3);
  const recentOrders = mockOrders.slice(0, 3);
  const recentPosts = mockForumPosts.slice(0, 2);
  const urgentAlerts = mockAlerts.filter((a) => a.severity === "high" || a.severity === "medium");

  return (
    <main className="p-6 container mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-lg p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">
          {greeting}, {username || "Farmer"} 🌱
        </h2>
        <p className="text-white/90">
          Here’s your daily overview — monitor crops, check weather, and stay connected.
        </p>
        <div className="flex gap-3 mt-4">
          <Button className="bg-white text-green-700 hover:bg-gray-100">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-green-700">
            <Eye className="w-4 h-4 mr-2" /> View Orders
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="hover:shadow-lg transition bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-gray-100 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weather + Alerts */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-r from-green-400 to-green-600 text-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <CloudRain className="h-5 w-5" />
                <span>Today's Weather</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center"><Thermometer className="h-6 w-6 mx-auto mb-2 text-white/80" /><p className="text-2xl">{weatherData.today.temperature}</p></div>
                <div className="text-center"><Droplets className="h-6 w-6 mx-auto mb-2 text-white/80" /><p className="text-2xl">{weatherData.today.humidity}</p></div>
                <div className="text-center"><Wind className="h-6 w-6 mx-auto mb-2 text-white/80" /><p className="text-2xl">{weatherData.today.windSpeed}</p></div>
                <div className="text-center"><CloudRain className="h-6 w-6 mx-auto mb-2 text-white/80" /><p className="text-2xl">{weatherData.today.rainfall}</p></div>
              </div>
              <div className="border-t border-white/30 pt-4">
                <h4 className="font-semibold mb-3 text-white">3-Day Forecast</h4>
                <div className="grid grid-cols-3 gap-4">
                  {weatherData.forecast.map((day, idx) => {
                    const Icon = day.icon;
                    return (
                      <div key={idx} className="text-center bg-white/20 rounded-lg p-3">
                        <p className="text-sm text-white/80 mb-1">{day.day}</p>
                        <Icon className="h-5 w-5 mx-auto mb-1 text-white/80" />
                        <p className="font-semibold text-white">{day.temp}</p>
                        <p className="text-xs text-white/70">{day.condition}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader><CardTitle>Urgent Alerts</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {urgentAlerts.length > 0 ? urgentAlerts.map((alert) => (
                  <li key={alert.id} className="flex items-center gap-3 border-b py-2">
                    <AlertTriangle className={`w-5 h-5 ${alert.severity === "high" ? "text-red-600" : "text-yellow-600"}`} />
                    <span>{alert.message}</span>
                  </li>
                )) : <p className="text-sm text-gray-500">No urgent alerts 🎉</p>}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Products */}
      <Card>
        <CardHeader><CardTitle>Recent Products</CardTitle><CardDescription>Latest products you added</CardDescription></CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentProducts.map((p) => (
              <li key={p.id} className="flex justify-between border-b py-2">
                <span>{p.name}</span><Badge variant="outline">${p.price}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader><CardTitle>Recent Orders</CardTitle><CardDescription>Your last 3 customer orders</CardDescription></CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentOrders.map((o) => (
              <li key={o.id} className="flex justify-between border-b py-2">
                <span>Order #{o.id}</span>
                <Badge variant={o.status === "Completed" ? "success" : "warning"}>{o.status}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Forum Posts */}
      <Card>
        <CardHeader><CardTitle>Community Forum</CardTitle><CardDescription>Recent discussions</CardDescription></CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentPosts.map((post) => (
              <li key={post.id} className="border-b py-2">
                <p className="font-semibold">{post.author}</p>
                <p className="text-sm text-muted-foreground">{post.content}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}

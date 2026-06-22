import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { WiDaySunny, WiRain, WiSnow, WiStrongWind } from "react-icons/wi";

// ✅ Use env variable
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const DEFAULT_LOCATION = { lat: -1.286389, lon: 36.817223 }; // Nairobi fallback

export default function Weather() {
  const [notifications, setNotifications] = useState({
    weather: true,
    pest: true,
    disease: false,
    market: true,
  });

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleNotificationToggle = (type) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${DEFAULT_LOCATION.lat}&lon=${DEFAULT_LOCATION.lon}&units=metric&appid=${API_KEY}`,
        );
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error("Weather API error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  // 🔹 Dynamic background based on weather
  const getBackground = () => {
    if (!weather) return "from-gray-200 to-gray-400";
    const condition = weather.weather[0].main.toLowerCase();
    if (condition.includes("rain")) return "from-blue-400 to-blue-700";
    if (condition.includes("cloud")) return "from-gray-400 to-gray-600";
    if (condition.includes("clear")) return "from-yellow-300 to-orange-500";
    if (weather.main.temp < 15) return "from-blue-300 to-blue-600";
    return "from-green-300 to-green-500";
  };

  // 🔹 Weather visuals component
  const WeatherVisuals = ({ weather }) => {
    if (!weather) return null;
    const condition = weather.weather[0].main.toLowerCase();
    const temp = weather.main.temp;

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 🌞 Sunny */}
        {condition.includes("clear") && (
          <motion.div
            className="absolute top-8 right-8 text-yellow-300"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            <WiDaySunny size={120} />
          </motion.div>
        )}

        {/* 🌧 Rain */}
        {condition.includes("rain") &&
          Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-10 bg-blue-300 opacity-70 rounded-full"
              initial={{ y: -50, x: Math.random() * window.innerWidth }}
              animate={{ y: window.innerHeight }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
            />
          ))}

        {/* ❄️ Cold/Snow */}
        {temp < 15 &&
          Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white"
              initial={{ y: -20, x: Math.random() * window.innerWidth }}
              animate={{ y: window.innerHeight }}
              transition={{ repeat: Infinity, duration: 4, delay: i * 0.3 }}
            >
              <WiSnow size={40} />
            </motion.div>
          ))}

        {/* 🌬 Wind */}
        {weather.wind.speed > 3 && (
          <motion.div
            className="absolute bottom-10 left-10 text-blue-400"
            animate={{ x: [0, 80, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <WiStrongWind size={100} />
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 relative">
      <h1 className="text-3xl font-extrabold">🌍 Weather & Alerts</h1>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Weather Overview */}
        <TabsContent value="overview">
          <Card className={`shadow-xl bg-gradient-to-br ${getBackground()} text-white relative overflow-hidden`}>
            <WeatherVisuals weather={weather} />
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">Today’s Weather</CardTitle>
              <CardDescription className="text-lg">Stay updated with today’s forecast</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              {loading ? (
                <p className="text-lg">Fetching latest weather...</p>
              ) : weather ? (
                <>
                  <p className="text-2xl font-bold capitalize">
                    {weather.weather[0].description}
                  </p>
                  <p className="text-xl">
                    🌡️ Temp: <span className="font-semibold">{weather.main.temp}°C</span> • 💧 Humidity:{" "}
                    {weather.main.humidity}%
                  </p>
                  <p className="text-lg">🌬️ Wind: {weather.wind.speed} m/s</p>
                  {weather.rain && (
                    <p className="text-lg">🌧️ Rain: {weather.rain["1h"]}mm</p>
                  )}

                  {/* Example alert logic */}
                  {weather.main.humidity > 70 && (
                    <div className="mt-4 flex items-center gap-2 bg-yellow-600 p-3 rounded-lg">
                      <AlertTriangle className="w-6 h-6" />
                      <span className="text-sm">
                        High humidity may increase coffee rust risk. Monitor your crops.
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-red-300">Failed to load weather data.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-xl">Notification Settings</CardTitle>
              <CardDescription className="text-base">
                Manage your alert preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.keys(notifications).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor={`${key}-notifications`} className="text-base font-medium">
                      {key.charAt(0).toUpperCase() + key.slice(1)} Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {key === "weather"
                        ? "Get daily weather forecasts and warnings"
                        : key === "pest"
                        ? "Stay informed on pest outbreaks"
                        : key === "disease"
                        ? "Plant disease warnings and treatment suggestions"
                        : "Price changes, demand updates, and market trends"}
                    </p>
                  </div>
                  <Switch
                    id={`${key}-notifications`}
                    checked={notifications[key]}
                    onCheckedChange={() => handleNotificationToggle(key)}
                  />
                </div>
              ))}

              <div className="pt-4 border-t border-border">
                <h4 className="font-medium mb-3">Delivery Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="email-delivery" defaultChecked className="rounded" />
                    <Label htmlFor="email-delivery">Email notifications</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="sms-delivery" defaultChecked className="rounded" />
                    <Label htmlFor="sms-delivery">SMS notifications</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="push-delivery" defaultChecked className="rounded" />
                    <Label htmlFor="push-delivery">Push notifications</Label>
                  </div>
                </div>
              </div>

              <Button className="w-full md:w-auto">Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

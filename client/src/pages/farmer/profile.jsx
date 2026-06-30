import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from '../../components/ui/label';
import axios from "axios";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [farmer, setFarmer] = useState(null);
  const [tempFarmer, setTempFarmer] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("http://localhost:5000/api/farmer/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFarmer(res.data);
        setTempFarmer(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [token]);

  // Save updates
  const handleSave = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/farmer/my/update",
        tempFarmer,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFarmer(res.data); // update state with new data
      setIsEditing(false);
      alert("Profile updated successfully ✅");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile ❌");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!farmer) return <p>No profile found</p>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-green-800">My Profile</h1>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Profile Info</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        {/* Profile Info */}
        <TabsContent value="info">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your profile details</CardDescription>
            </CardHeader>
            <CardContent>
              {!isEditing ? (
                <div className="space-y-3">
                  <p><strong>Name:</strong> {farmer.name}</p>
                  <p><strong>Email:</strong> {farmer.email}</p>
                  <p><strong>Phone:</strong> {farmer.phone}</p>
                  <p><strong>Land Size:</strong> {farmer.landSize}</p>
                  <p><strong>Location:</strong> {farmer.location}</p>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={tempFarmer.name || ""}
                      onChange={(e) => setTempFarmer({ ...tempFarmer, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={tempFarmer.email || ""}
                      onChange={(e) => setTempFarmer({ ...tempFarmer, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={tempFarmer.phone || ""}
                      onChange={(e) => setTempFarmer({ ...tempFarmer, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="landSize">Land Size</Label>
                    <Input
                      id="landSize"
                      value={tempFarmer.landSize || ""}
                      onChange={(e) => setTempFarmer({ ...tempFarmer, landSize: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={tempFarmer.location || ""}
                      onChange={(e) => setTempFarmer({ ...tempFarmer, location: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Map */}
              <h2 className="text-xl font-bold text-green-700 mt-6 mb-2">Farm Location</h2>
              <div className="w-full h-96 border rounded-lg shadow">
                <iframe
                  title="Farm Location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    farmer.location || "Kenya"
                  )}&output=embed`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Activity */}
        <TabsContent value="activity">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* TODO: Replace with real activity logs from backend */}
                <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-foreground">Listed new product: Organic Corn</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

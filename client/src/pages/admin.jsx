import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { 
  Users, 
  ShoppingCart, 
  MessageSquare, 
  Settings,
  CheckCircle,
  XCircle,
  BarChart3,
  DollarSign,
  AlertTriangle,
  Search,
  Edit,
  Trash2
} from "lucide-react";
import { mockUsers, mockProducts, mockForumPosts, mockOrders } from "../data/mockData";
import { useToast } from "../hooks/use-toast";

export default function Admin() {
  const { toast } = useToast();
  const [users] = useState(mockUsers);
  const [products] = useState(mockProducts);
  const [posts] = useState(mockForumPosts);
  const [orders] = useState(mockOrders);

  const stats = [
    {
      title: "Total Users",
      value: "1,247",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Products",
      value: "856",
      change: "+8%", 
      icon: ShoppingCart,
      color: "text-green-600"
    },
    {
      title: "Forum Posts",
      value: "423",
      change: "+15%",
      icon: MessageSquare,
      color: "text-purple-600"
    },
    {
      title: "Monthly Revenue",
      value: "$45,230",
      change: "+23%",
      icon: DollarSign,
      color: "text-primary"
    }
  ];

  const recentActivities = [
    { id: 1, action: "New user registration", user: "Sarah Johnson", time: "2 minutes ago" },
    { id: 2, action: "Product listing approved", user: "Mike Wilson", time: "5 minutes ago" },
    { id: 3, action: "Forum post moderated", user: "Admin", time: "10 minutes ago" },
    { id: 4, action: "Order completed", user: "Jane Smith", time: "15 minutes ago" },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-soft">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg">{stat.title}</CardTitle>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs for Management */}
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="forum">Forum</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
              <CardDescription>View and edit user information</CardDescription>
            </CardHeader>
            <CardContent>
              <Input placeholder="Search users..." className="mb-4" />
              <ul className="space-y-2">
                {users.map((user) => (
                  <li key={user.id} className="flex justify-between items-center border-b py-2">
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline"><Edit className="w-4 h-4" /></Button>
                      <Button size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Manage Products</CardTitle>
              <CardDescription>Approve or remove farmer listings</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {products.map((product) => (
                  <li key={product.id} className="flex justify-between items-center border-b py-2">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-muted-foreground">${product.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="success">Approved</Badge>
                      <Button size="sm" variant="outline"><Edit className="w-4 h-4" /></Button>
                      <Button size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Manage Orders</CardTitle>
              <CardDescription>Track and update order statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {orders.map((order) => (
                  <li key={order.id} className="flex justify-between items-center border-b py-2">
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={order.status === "Completed" ? "success" : "warning"}>
                        {order.status}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forum Tab */}
        <TabsContent value="forum">
          <Card>
            <CardHeader>
              <CardTitle>Manage Forum Posts</CardTitle>
              <CardDescription>Moderate user discussions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {posts.map((post) => (
                  <li key={post.id} className="flex justify-between items-center border-b py-2">
                    <div>
                      <p className="font-semibold">{post.author}</p>
                      <p className="text-sm text-muted-foreground">{post.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline"><CheckCircle className="w-4 h-4" /></Button>
                      <Button size="sm" variant="destructive"><XCircle className="w-4 h-4" /></Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activities */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentActivities.map((activity) => (
              <li key={activity.id} className="flex justify-between items-center border-b py-2">
                <span>{activity.action} by <strong>{activity.user}</strong></span>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

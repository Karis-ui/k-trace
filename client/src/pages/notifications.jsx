import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Bell, Trash2, AlertTriangle, Info, CheckCircle } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "alert",
      title: "Weather Warning",
      description: "Heavy rains expected tomorrow. Protect your crops.",
      timestamp: Date.now() - 3600000,
      status: "unread",
    },
    {
      id: 2,
      type: "info",
      title: "New Forum Reply",
      description: "You have a reply to your pest control question.",
      timestamp: Date.now() - 7200000,
      status: "read",
    },
    {
      id: 3,
      type: "success",
      title: "Order Shipped",
      description: "Your order #1234 has been shipped.",
      timestamp: Date.now() - 10800000,
      status: "unread",
    },
  ]);

  const typeConfigMap = {
    alert: { label: "Alert", color: "bg-red-100 text-red-700", icon: AlertTriangle },
    info: { label: "Info", color: "bg-blue-100 text-blue-700", icon: Info },
    success: { label: "Success", color: "bg-green-100 text-green-700", icon: CheckCircle },
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getFilteredNotifications = (status) =>
    notifications.filter((n) => n.status === status);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <Tabs defaultValue="unread">
        <TabsList>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>

        {/* Unread Notifications */}
        <TabsContent value="unread" className="space-y-4">
          {getFilteredNotifications("unread").length > 0 ? (
            getFilteredNotifications("unread").map((notification) => {
              const typeConfig = typeConfigMap[notification.type] || typeConfigMap.info;
              const TypeIcon = typeConfig.icon;
              return (
                <Card key={notification.id} className="shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg ${typeConfig.color} flex items-center justify-center`}
                      >
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {notification.description}
                            </p>
                          </div>
                          <Badge variant="outline" className={typeConfig.color}>
                            {typeConfig.label}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="shadow-soft">
              <CardContent className="text-center py-12">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Unread Notifications</h3>
                <p className="text-muted-foreground">You're all caught up!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Read Notifications */}
        <TabsContent value="read" className="space-y-4">
          {getFilteredNotifications("read").length > 0 ? (
            getFilteredNotifications("read").map((notification) => {
              const typeConfig = typeConfigMap[notification.type] || typeConfigMap.info;
              const TypeIcon = typeConfig.icon;
              return (
                <Card key={notification.id} className="shadow-soft opacity-75">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg ${typeConfig.color} flex items-center justify-center`}
                      >
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-muted-foreground">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {notification.description}
                            </p>
                          </div>
                          <Badge variant="outline" className={typeConfig.color}>
                            {typeConfig.label}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="shadow-soft">
              <CardContent className="text-center py-12">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Read Notifications</h3>
                <p className="text-muted-foreground">You haven't read any notifications yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

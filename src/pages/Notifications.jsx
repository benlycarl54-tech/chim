import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Bell, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const user = await base44.auth.me();
      const allNotifications = await base44.entities.Notification.filter(
        { user_email: user.email },
        "-created_date"
      );
      setNotifications(allNotifications);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notification) => {
    if (!notification.is_read) {
      await base44.entities.Notification.update(notification.id, { is_read: true });
      loadNotifications();
    }
  };

  const markAllAsRead = async () => {
    const user = await base44.auth.me();
    const unread = notifications.filter(n => !n.is_read);
    
    for (const notification of unread) {
      await base44.entities.Notification.update(notification.id, { is_read: true });
    }
    
    loadNotifications();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5]">
        <DashboardHeader title="Notifications" />
        <div className="p-5 text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-8">
      <div className="bg-[#003087] pt-12 pb-6 px-5 flex items-center gap-4">
        <button onClick={() => navigate(createPageUrl("Home"))}>
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-xl font-semibold tracking-wide">Notifications</h1>
      </div>
      
      <div className="p-5">
        {unreadCount > 0 && (
          <div className="mb-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="text-[#003087]"
            >
              Mark all as read
            </Button>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification)}
                className={`bg-white rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)] border cursor-pointer ${
                  notification.is_read ? "border-gray-100" : "border-[#003087] bg-blue-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{notification.title}</h3>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-[#003087] rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.created_date).toLocaleString()}
                    </p>
                  </div>
                  {notification.is_read && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
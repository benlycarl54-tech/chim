import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { ChevronRight, LogOut, Shield, User, ArrowLeft, Edit2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [theme, setTheme] = useState("blue");

  useEffect(() => {
    loadUser();
    const savedTheme = localStorage.getItem("appTheme") || "blue";
    setTheme(savedTheme);
  }, []);

  const loadUser = async () => {
    const currentUser = await base44.auth.me();
    setUser(currentUser);

    const notifications = await base44.entities.Notification.filter({ 
      user_email: currentUser.email, 
      is_read: false 
    });
    setNotificationCount(notifications.length);
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  const handleEditName = async () => {
    if (!newName || newName.trim().length === 0) {
      toast.error("Please enter a valid name");
      return;
    }

    try {
      await base44.auth.updateMe({ full_name: newName });
      toast.success("Name updated successfully");
      setEditingName(false);
      loadUser();
    } catch (error) {
      toast.error("Failed to update name");
      console.error(error);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("appTheme", newTheme);
    toast.success("Theme updated successfully");
    window.location.reload();
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-8">
      <div className="bg-[#003087] pt-12 pb-6 px-5 flex items-center gap-4">
        <button onClick={() => navigate(createPageUrl("Home"))}>
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-xl font-semibold tracking-wide">Settings</h1>
      </div>
      
      <div className="p-5">
        <div className="bg-white rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#003087] rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">{user?.full_name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              {isAdmin && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-[#003087] text-white text-xs rounded-full">
                  Admin
                </span>
              )}
            </div>
            <Button
              onClick={() => {
                setEditingName(true);
                setNewName(user?.full_name || "");
              }}
              variant="outline"
              size="sm"
              className="h-8"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>

          {editingName && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <Label className="text-xs">Full Name</Label>
              <Input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter your full name"
                className="h-9 mt-1 mb-2"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleEditName}
                  className="flex-1 bg-[#003087] hover:bg-[#002266] h-8 text-xs"
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setEditingName(false);
                    setNewName("");
                  }}
                  variant="outline"
                  className="flex-1 h-8 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#003087] rounded-full flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">Theme</p>
              <p className="text-xs text-gray-500">Customize your app appearance</p>
            </div>
          </div>
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blue">Halifax Blue (Default)</SelectItem>
              <SelectItem value="dark">Dark Mode</SelectItem>
              <SelectItem value="green">Forest Green</SelectItem>
              <SelectItem value="purple">Royal Purple</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {isAdmin && (
            <Link
              to={createPageUrl("AdminPanel")}
              className="bg-white rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#003087]" />
                <span className="font-semibold text-gray-900">Admin Panel</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="w-full bg-white rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="font-semibold text-red-500">Logout</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
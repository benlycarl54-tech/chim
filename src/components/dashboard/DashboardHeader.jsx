import { Mail, Settings, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function DashboardHeader({ title = "Home", notificationCount = 0 }) {
  return (
    <div className="bg-white pt-12 pb-6 px-5 flex items-center justify-between border-b border-gray-100">
      <Link to={createPageUrl("Settings")} className="relative">
        <Settings className="w-6 h-6 text-gray-700" />
      </Link>
      <h1 className="text-[#25D366] text-2xl font-bold tracking-tight">chime</h1>
      <Link to={createPageUrl("Notifications")} className="relative">
        <Bell className="w-6 h-6 text-gray-700" />
        {notificationCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </Link>
    </div>
  );
}
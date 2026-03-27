import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Bell, FileText, HelpCircle, Shield, LogOut } from "lucide-react";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";

export default function More() {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Settings, label: "Settings", page: "Settings" },
    { icon: Bell, label: "Notifications", page: "Notifications" },
    { icon: FileText, label: "Transaction History", page: "History" },
    { icon: HelpCircle, label: "Help & Support", page: null },
    { icon: Shield, label: "Security", page: null },
  ];

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-8">
      <div className="bg-[#003087] pt-12 pb-6 px-5 flex items-center gap-4">
        <button onClick={() => navigate(createPageUrl("Home"))}>
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-xl font-semibold tracking-wide">More</h1>
      </div>

      <div className="p-5">
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => item.page && navigate(createPageUrl(item.page))}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f0f2f5] flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[#003087]" />
                </div>
                <span className="text-gray-900 font-medium">{item.label}</span>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-4 flex items-center justify-center gap-3 p-4 bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-5 h-5 text-red-600" />
          <span className="text-red-600 font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
}
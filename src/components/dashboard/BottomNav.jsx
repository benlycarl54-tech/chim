import { Home, Send, Download, Bell, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function BottomNav({ active }) {
  const navItems = [
    { icon: Home, label: "Home", page: "Home" },
    { icon: Send, label: "Move Money", page: "Transfer" },
    { icon: Bell, label: "Pay Anyone", page: "Transfer" },
    { icon: Download, label: "Cash Map", page: "Withdrawal" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={createPageUrl(item.page)}
            className="flex flex-col items-center gap-1"
          >
            <item.icon
              className={`w-6 h-6 ${
                active === item.page ? "text-gray-900" : "text-gray-400"
              }`}
            />
            <span
              className={`text-xs ${
                active === item.page ? "text-gray-900 font-medium" : "text-gray-400"
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
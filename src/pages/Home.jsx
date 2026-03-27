import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SearchBar from "@/components/dashboard/SearchBar";
import BottomNav from "@/components/dashboard/BottomNav";
import ChimeLogo from "@/components/dashboard/ChimeLogo";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import QuickActions from "@/components/dashboard/QuickActions";
import { ChevronRight, MoreVertical } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function Home() {
  const navigate = useNavigate();
  const [account, setAccount] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const notifications = await base44.entities.Notification.filter({ 
        user_email: currentUser.email, 
        is_read: false 
      });
      setNotificationCount(notifications.length);

      let accounts = await base44.entities.Account.filter({ 
        user_email: currentUser.email 
      });

      if (accounts.length === 0) {
        const account1 = await base44.entities.Account.create({
          account_number: Math.floor(10000000 + Math.random() * 90000000).toString(),
          sort_code: "30-13-54",
          balance: 0,
          account_type: "Lloyds Current Account",
          user_email: currentUser.email,
        });

        const account2 = await base44.entities.Account.create({
          account_number: Math.floor(10000000 + Math.random() * 90000000).toString(),
          sort_code: "80-46-35",
          balance: 0,
          account_type: "Halifax Current Account",
          user_email: currentUser.email,
        });

        const account3 = await base44.entities.Account.create({
          account_number: "0000 0000 0000 0000",
          sort_code: "",
          balance: 0,
          account_type: "MBNA Credit Card",
          user_email: currentUser.email,
        });

        accounts = [account1, account2, account3];
      }

      setAccount(accounts);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-[#25D366] font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24">
      <DashboardHeader title="Home" notificationCount={notificationCount} />
      
      <WelcomeBanner userName={user?.full_name} />
      
      <div className="px-5 space-y-4 pb-8">
        {account.map((acc) => {
          const formattedBalance = acc?.balance?.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) || "0.00";
          const [whole, decimal] = formattedBalance.split('.');
          const isNegative = acc?.balance < 0;
          const accountLabel = acc.account_type?.includes("Credit") ? "Credit Builder" : "Checking Account";

          return (
            <div 
              key={acc.id} 
              onClick={() => navigate(createPageUrl("AccountDetails") + "?id=" + acc.id)}
              className="bg-white rounded-2xl p-5 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-gray-900">{accountLabel}</h3>
                <button className="p-1">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  {isNegative ? '-' : ''}${whole}
                </span>
              </div>

              <button className="text-[#25D366] font-semibold text-sm flex items-center gap-1 hover:text-[#20b858]">
                View Transactions
                <ChevronRight className="w-4 h-4" />
              </button>
              
              {accountLabel === "Credit Builder" && (
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  Increase your credit score by an average of 30 points with no interest or annual fees!¹
                </p>
              )}
            </div>
          );
        })}
      </div>

      <BottomNav active="Home" />
    </div>
  );
}
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function Cards() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const user = await base44.auth.me();
      const userAccounts = await base44.entities.Account.filter({ user_email: user.email });
      setAccounts(userAccounts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getLogoType = (accountType) => {
    if (accountType?.includes("Lloyds")) return "lloyds";
    if (accountType?.includes("Halifax")) return "halifax";
    if (accountType?.includes("MBNA")) return "mbna";
    return "halifax";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-[#003087] font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-8">
      <div className="bg-[#003087] pt-12 pb-6 px-5 flex items-center gap-4">
        <button onClick={() => navigate(createPageUrl("Home"))}>
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-xl font-semibold tracking-wide">My Cards</h1>
      </div>

      <div className="p-5 space-y-4">
        {accounts.map((account) => {
          const isCard = account.account_type?.includes("Credit Card");
          return (
            <div
              key={account.id}
              onClick={() => navigate(createPageUrl("AccountDetails") + "?id=" + account.id)}
              className="bg-gradient-to-br from-[#003087] to-[#1e2875] rounded-2xl p-6 text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-xs text-white/70 mb-1">
                    {getLogoType(account.account_type) === "lloyds" ? "LLOYDS" :
                     getLogoType(account.account_type) === "halifax" ? "HALIFAX" : "MBNA"}
                  </p>
                  <p className="text-sm font-medium">
                    {account.account_type?.includes("Credit Card") ? "Credit Card" : "Debit Card"}
                  </p>
                </div>
                <CreditCard className="w-10 h-10 text-white/30" />
              </div>

              <div className="mb-6">
                <p className="font-mono text-lg tracking-wider">
                  {isCard ? account.account_number : `•••• •••• •••• ${account.account_number.slice(-4)}`}
                </p>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-white/70 mb-1">Available Balance</p>
                  <p className="text-2xl font-bold">£{account.balance?.toFixed(2) || "0.00"}</p>
                </div>
                {!isCard && (
                  <div>
                    <p className="text-xs text-white/70">Sort Code</p>
                    <p className="font-mono text-sm">{account.sort_code}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
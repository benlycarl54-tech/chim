import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Download, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

export default function AccountDetails() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const accountId = urlParams.get("id");
      
      if (!accountId) {
        navigate(createPageUrl("Home"));
        return;
      }

      const accountData = await base44.entities.Account.filter({ id: accountId });
      if (accountData.length > 0) {
        setAccount(accountData[0]);
        
        const txns = await base44.entities.Transaction.filter({ 
          from_account: accountData[0].account_number 
        }, "-created_date", 10);
        setTransactions(txns);
      }
    } catch (error) {
      console.error("Error loading account:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-[#003087] font-semibold">Loading...</div>
      </div>
    );
  }

  if (!account) {
    return null;
  }

  const getLogoType = (accountType) => {
    if (accountType?.includes("Lloyds")) return "lloyds";
    if (accountType?.includes("Halifax")) return "halifax";
    if (accountType?.includes("MBNA")) return "mbna";
    return "halifax";
  };

  const formattedBalance = account.balance?.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) || "0.00";
  const [whole, decimal] = formattedBalance.split('.');
  const isNegative = account.balance < 0;

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="bg-[#003087] pt-12 pb-6 px-5">
        <button onClick={() => navigate(createPageUrl("Home"))} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-xl font-semibold tracking-wide">Account Details</h1>
      </div>

      <div className="p-5">
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              {getLogoType(account.account_type) === "lloyds" && (
                <div className="w-full h-full bg-white flex items-center justify-center">
                  <svg viewBox="0 0 40 40" className="w-10 h-10">
                    <path d="M20 5 C15 10, 8 15, 8 22 C8 28, 13 33, 20 33 C27 33, 32 28, 32 22 C32 15, 25 10, 20 5Z" fill="none" stroke="#000" strokeWidth="1.5"/>
                    <path d="M12 20 Q16 16, 20 20 Q24 24, 28 20" fill="none" stroke="#000" strokeWidth="1.5"/>
                    <path d="M14 24 Q18 20, 22 24 Q26 28, 30 24" fill="none" stroke="#000" strokeWidth="1.2"/>
                  </svg>
                </div>
              )}
              {getLogoType(account.account_type) === "halifax" && (
                <div className="w-full h-full bg-white flex items-center justify-center">
                  <svg viewBox="0 0 40 40" className="w-9 h-9">
                    <line x1="12" y1="12" x2="28" y2="28" stroke="#003087" strokeWidth="3"/>
                    <line x1="28" y1="12" x2="12" y2="28" stroke="#003087" strokeWidth="3"/>
                    <line x1="20" y1="8" x2="20" y2="32" stroke="#003087" strokeWidth="3"/>
                    <line x1="8" y1="20" x2="32" y2="20" stroke="#003087" strokeWidth="3"/>
                  </svg>
                </div>
              )}
              {getLogoType(account.account_type) === "mbna" && (
                <div className="w-full h-full bg-[#1a2744] rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold tracking-wide">mbna</span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {account.account_type?.includes("Lloyds") ? "Lloyds Current Account" : 
                 account.account_type?.includes("Halifax") ? "Halifax Current Account" : 
                 "MBNA Credit Card"}
              </h2>
              <p className="text-gray-500 text-sm">
                {account.sort_code} {account.account_number}
              </p>
            </div>
          </div>

          <div className="mt-6 mb-6">
            <p className="text-sm text-gray-500 mb-1">Available Balance</p>
            <span className="text-3xl font-bold text-gray-900">
              {isNegative ? '-' : ''}£{whole}
              <span className="text-2xl font-semibold text-gray-500">.{decimal}</span>
            </span>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => navigate(createPageUrl("Transfer"))}
              className="flex-1 bg-[#003087] hover:bg-[#002266]"
            >
              <Send className="w-4 h-4 mr-2" />
              Transfer
            </Button>
            <Button 
              onClick={() => navigate(createPageUrl("Withdrawal"))}
              className="flex-1 bg-[#003087] hover:bg-[#002266]"
            >
              <Download className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Recent Transactions</h3>
          {transactions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
              <p className="text-gray-500">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((txn) => (
                <div key={txn.id} className="bg-white rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{txn.transaction_type}</p>
                      <p className="text-sm text-gray-500">To: {txn.to_account}</p>
                      {txn.reference && <p className="text-xs text-gray-400">{txn.reference}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">-£{txn.amount.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        txn.status === "completed" ? "bg-green-100 text-green-700" :
                        txn.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {txn.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
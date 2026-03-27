import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BottomNav from "@/components/dashboard/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import ChimeTransferReceipt from "@/components/ChimeTransferReceipt";

export default function Withdrawal() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [authCode, setAuthCode] = useState("");
  const [userAuthCode, setUserAuthCode] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  useEffect(() => {
    loadAccount();
  }, []);

  const loadAccount = async () => {
    try {
      const user = await base44.auth.me();
      const accounts = await base44.entities.Account.filter({ user_email: user.email });
      const halifaxAccount = accounts.find(a => a.account_type?.includes("Halifax"));
      if (halifaxAccount) {
        setAccount(halifaxAccount);
      } else if (accounts.length > 0) {
        setAccount(accounts[0]);
      }

      const notifications = await base44.entities.Notification.filter({ 
        user_email: user.email, 
        is_read: false 
      });
      setNotificationCount(notifications.length);

      const userDetails = await base44.entities.User.filter({ email: user.email });
      if (userDetails.length > 0) {
        setUserAuthCode(userDetails[0].authentication_code || "");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) > account.balance) {
      toast.error("Insufficient balance");
      return;
    }

    if (userAuthCode && authCode !== userAuthCode) {
      toast.error("Invalid authentication code");
      return;
    }

    setLoading(true);

    try {
      const user = await base44.auth.me();

      const transaction = await base44.entities.Transaction.create({
        transaction_type: "Withdrawal",
        amount: parseFloat(amount),
        from_account: account.account_number,
        to_account: "Cash Withdrawal",
        status: "completed",
        user_email: user.email,
        reference: "ATM Withdrawal",
      });

      await base44.entities.Account.update(account.id, {
        balance: account.balance - parseFloat(amount),
      });

      await base44.entities.Notification.create({
        title: "Cash Withdrawal",
        message: `£${amount} has been withdrawn from your account`,
        user_email: user.email,
        type: "transaction",
      });

      await base44.functions.invoke('sendDebitAlert', {
        transaction_type: "Withdrawal",
        amount: parseFloat(amount),
        account_number: account.account_number,
        recipient: null
      });

      setLastTransaction(transaction);
      toast.success("Withdrawal completed successfully");
      setAmount("");
      setAuthCode("");
      loadAccount();
    } catch (error) {
      toast.error("Withdrawal failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24">
      <div className="bg-white pt-12 pb-6 px-5 flex items-center gap-4 border-b border-gray-200">
        <button onClick={() => navigate(createPageUrl("Home"))}>
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-gray-900 text-xl font-semibold tracking-tight">Cash Withdrawal</h1>
      </div>
      
      <div className="p-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Withdraw Cash</h2>
          
          <form onSubmit={handleWithdrawal} className="space-y-4">
            <div>
              <Label>Amount ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            {userAuthCode && (
              <div>
                <Label>Authentication Code</Label>
                <Input
                  type="password"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  placeholder="Enter authentication code"
                />
              </div>
            )}

            <div className="pt-2">
              <p className="text-sm text-gray-600 mb-2">
                Available Balance: ${account?.balance?.toFixed(2) || "0.00"}
              </p>
              <Button
                type="submit"
                className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-semibold py-6 rounded-full"
                disabled={loading}
              >
                {loading ? "Processing..." : "Withdraw Cash"}
              </Button>
              {lastTransaction && (
                <Button
                  type="button"
                  onClick={() => setShowReceipt(true)}
                  variant="outline"
                  className="w-full mt-2 rounded-full"
                >
                  View Receipt
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      <BottomNav active="Withdrawal" />
      {showReceipt && lastTransaction && (
        <ChimeTransferReceipt
          transaction={lastTransaction}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
}
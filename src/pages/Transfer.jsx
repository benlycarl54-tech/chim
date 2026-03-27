import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BottomNav from "@/components/dashboard/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import ChimeTransferReceipt from "@/components/ChimeTransferReceipt";
import ZelleTransferReceipt from "@/components/ZelleTransferReceipt";

export default function Transfer() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [transferType, setTransferType] = useState("Zelle Transfer");
  const [amount, setAmount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const user = await base44.auth.me();
      const userAccounts = await base44.entities.Account.filter({ user_email: user.email });
      setAccounts(userAccounts);
      
      const halifaxAccount = userAccounts.find(a => a.account_type?.includes("Halifax"));
      if (halifaxAccount) {
        setSelectedAccountId(halifaxAccount.id);
      } else if (userAccounts.length > 0) {
        setSelectedAccountId(userAccounts[0].id);
      }

      const notifications = await base44.entities.Notification.filter({ 
        user_email: user.email, 
        is_read: false 
      });
      setNotificationCount(notifications.length);
    } catch (error) {
      console.error(error);
    }
  };

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);

  const handleTransfer = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!toAccount) {
      toast.error("Please enter recipient account details");
      return;
    }

    if (parseFloat(amount) > selectedAccount.balance) {
      toast.error("Insufficient balance");
      return;
    }

    setLoading(true);

    try {
      const user = await base44.auth.me();

      const transaction = await base44.entities.Transaction.create({
        transaction_type: transferType,
        amount: parseFloat(amount),
        from_account: selectedAccount.account_number,
        to_account: toAccount,
        status: "completed",
        user_email: user.email,
        reference: reference || "Transfer",
      });

      await base44.entities.Account.update(selectedAccount.id, {
        balance: selectedAccount.balance - parseFloat(amount),
      });

      await base44.entities.Notification.create({
        title: `${transferType} Sent`,
        message: `£${amount} has been transferred to ${toAccount}`,
        user_email: user.email,
        type: "transaction",
      });

      await base44.functions.invoke('sendDebitAlert', {
        transaction_type: transferType,
        amount: parseFloat(amount),
        account_number: selectedAccount.account_number,
        recipient: toAccount
      });

      setLastTransaction(transaction);
      toast.success("Transfer completed successfully");
      setAmount("");
      setToAccount("");
      setReference("");
      loadAccounts();
    } catch (error) {
      toast.error("Transfer failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isZelleTransfer = transferType === "Zelle Transfer";

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24">
      <div className="bg-white pt-12 pb-6 px-5 flex items-center gap-4 border-b border-gray-200">
        <button onClick={() => navigate(createPageUrl("Home"))}>
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-gray-900 text-xl font-semibold tracking-tight">Transfer Money</h1>
      </div>
      
      <div className="p-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Send Money</h2>
          
          <form onSubmit={handleTransfer} className="space-y-4">
            <div>
              <Label>From Account</Label>
              <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(acc => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.account_type} - {acc.account_number} (${acc.balance?.toFixed(2) || "0.00"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Transfer Type</Label>
              <Select value={transferType} onValueChange={setTransferType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Zelle Transfer">Zelle Transfer</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

            <div>
              <Label>Recipient {isZelleTransfer ? "Email/Phone" : "Account"}</Label>
              <Input
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                placeholder={isZelleTransfer ? "email@example.com" : "Account number"}
              />
            </div>

            <div>
              <Label>Reference (Optional)</Label>
              <Input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Payment reference"
              />
            </div>

            <div className="pt-2">
              <p className="text-sm text-gray-600 mb-2">
                Available Balance: ${selectedAccount?.balance?.toFixed(2) || "0.00"}
              </p>
              <Button
                type="submit"
                className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-semibold py-6 rounded-full"
                disabled={loading}
              >
                {loading ? "Processing..." : "Send Money"}
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

      <BottomNav active="Transfer" />
      {showReceipt && lastTransaction && (
        isZelleTransfer ? (
          <ZelleTransferReceipt
            transaction={lastTransaction}
            onClose={() => setShowReceipt(false)}
          />
        ) : (
          <ChimeTransferReceipt
            transaction={lastTransaction}
            onClose={() => setShowReceipt(false)}
          />
        )
      )}
    </div>
  );
}
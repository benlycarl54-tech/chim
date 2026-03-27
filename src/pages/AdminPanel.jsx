import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Search, ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [fundingAccount, setFundingAccount] = useState(null);
  const [fundAmount, setFundAmount] = useState("");
  const [settingAuthCode, setSettingAuthCode] = useState(null);
  const [authCode, setAuthCode] = useState("");
  const [users, setUsers] = useState([]);
  const [editingName, setEditingName] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const user = await base44.auth.me();
      if (user.role !== "admin") {
        window.location.href = "/";
        return;
      }
      loadAccounts();
    } catch (error) {
      window.location.href = "/";
    }
  };

  const loadAccounts = async () => {
    try {
      const allAccounts = await base44.entities.Account.list("-created_date");
      const groupedAccounts = {};
      
      allAccounts.forEach(account => {
        if (!groupedAccounts[account.user_email]) {
          groupedAccounts[account.user_email] = [];
        }
        groupedAccounts[account.user_email].push(account);
      });
      
      setAccounts(groupedAccounts);

      const allUsers = await base44.entities.User.list();
      setUsers(allUsers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFund = async (account) => {
    if (!fundAmount || parseFloat(fundAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const newBalance = account.balance + parseFloat(fundAmount);
      await base44.entities.Account.update(account.id, { balance: newBalance });

      await base44.entities.Notification.create({
        title: "Account Funded",
        message: `Your account has been credited with £${fundAmount}`,
        user_email: account.user_email,
        type: "system",
      });

      toast.success("Account funded successfully");
      setFundingAccount(null);
      setFundAmount("");
      loadAccounts();
    } catch (error) {
      toast.error("Failed to fund account");
      console.error(error);
    }
  };

  const handleSetAuthCode = async (userEmail) => {
    if (!authCode || authCode.length < 4) {
      toast.error("Please enter a valid authentication code (minimum 4 characters)");
      return;
    }

    try {
      const user = users.find(u => u.email === userEmail);
      if (user) {
        await base44.entities.User.update(user.id, { authentication_code: authCode });
        toast.success("Authentication code set successfully");
        setSettingAuthCode(null);
        setAuthCode("");
        loadAccounts();
      }
    } catch (error) {
      toast.error("Failed to set authentication code");
      console.error(error);
    }
  };

  const getUserAuthCode = (userEmail) => {
    const user = users.find(u => u.email === userEmail);
    return user?.authentication_code || "Not Set";
  };

  const handleEditName = async (userEmail) => {
    if (!newName || newName.trim().length === 0) {
      toast.error("Please enter a valid name");
      return;
    }

    try {
      const user = users.find(u => u.email === userEmail);
      if (user) {
        await base44.entities.User.update(user.id, { full_name: newName });
        toast.success("Name updated successfully");
        setEditingName(null);
        setNewName("");
        loadAccounts();
      }
    } catch (error) {
      toast.error("Failed to update name");
      console.error(error);
    }
  };

  const getUserName = (userEmail) => {
    const user = users.find(u => u.email === userEmail);
    return user?.full_name || "No Name";
  };

  const filteredAccounts = Object.keys(accounts).filter(email =>
    email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5]">
        <DashboardHeader title="Admin Panel" />
        <div className="p-5 text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-8">
      <div className="bg-[#003087] pt-12 pb-6 px-5 flex items-center gap-4">
        <button onClick={() => navigate(createPageUrl("Settings"))}>
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-xl font-semibold tracking-wide">Admin Panel</h1>
      </div>
      
      <div className="p-5">
        <div className="bg-white rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by email or account number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredAccounts.map((userEmail) => (
            <div
              key={userEmail}
              className="bg-white rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Name: <span className="font-bold text-gray-900">{getUserName(userEmail)}</span></p>
                  <p className="text-sm text-gray-600 mt-1">Email: <span className="font-semibold">{userEmail}</span></p>
                  <p className="text-xs text-gray-500 mt-1">
                    Auth Code: <span className="font-mono font-semibold">{getUserAuthCode(userEmail)}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setEditingName(userEmail);
                      setNewName(getUserName(userEmail));
                    }}
                    variant="outline"
                    className="h-8 text-xs"
                  >
                    Edit Name
                  </Button>
                  <Button
                    onClick={() => setSettingAuthCode(userEmail)}
                    variant="outline"
                    className="h-8 text-xs"
                  >
                    Set Code
                  </Button>
                </div>
              </div>

              {editingName === userEmail && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <Label className="text-xs">Full Name</Label>
                  <Input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter full name"
                    className="h-9 mt-1 mb-2"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditName(userEmail)}
                      className="flex-1 bg-[#003087] hover:bg-[#002266] h-8 text-xs"
                    >
                      Save Name
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingName(null);
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

              {settingAuthCode === userEmail && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <Label className="text-xs">Authentication Code</Label>
                  <Input
                    type="text"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    placeholder="Enter 4-digit code"
                    className="h-9 mt-1 mb-2"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSetAuthCode(userEmail)}
                      className="flex-1 bg-[#003087] hover:bg-[#002266] h-8 text-xs"
                    >
                      Save Code
                    </Button>
                    <Button
                      onClick={() => {
                        setSettingAuthCode(null);
                        setAuthCode("");
                      }}
                      variant="outline"
                      className="flex-1 h-8 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                {accounts[userEmail].map((account) => (
                  <div key={account.id} className="border-t pt-3 first:border-t-0 first:pt-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          {account.account_type?.includes("Lloyds") ? "Lloyds Current Account" : 
                           account.account_type?.includes("Halifax") ? "Halifax Current Account" : 
                           "MBNA Credit Card"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {account.sort_code} {account.account_number}
                        </p>
                        <p className="text-base font-bold text-[#003087] mt-1">
                          £{account.balance?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                    </div>

                    {fundingAccount?.id === account.id ? (
                      <div className="space-y-2 mt-2">
                        <div>
                          <Label className="text-xs">Amount to Fund (£)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={fundAmount}
                            onChange={(e) => setFundAmount(e.target.value)}
                            placeholder="0.00"
                            className="h-9"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleFund(account)}
                            className="flex-1 bg-[#003087] hover:bg-[#002266] h-9 text-sm"
                          >
                            Confirm
                          </Button>
                          <Button
                            onClick={() => {
                              setFundingAccount(null);
                              setFundAmount("");
                            }}
                            variant="outline"
                            className="flex-1 h-9 text-sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setFundingAccount(account)}
                        className="w-full bg-[#003087] hover:bg-[#002266] h-9 text-sm"
                      >
                        Fund Account
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
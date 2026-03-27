import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Filter } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TransactionReceipt from "@/components/TransactionReceipt";

export default function History() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const user = await base44.auth.me();
      const allTransactions = await base44.entities.Transaction.filter(
        { user_email: user.email },
        "-created_date"
      );
      setTransactions(allTransactions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = filterType === "all" 
    ? transactions 
    : transactions.filter(t => t.transaction_type === filterType);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
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
        <h1 className="text-white text-xl font-semibold tracking-wide">Transaction History</h1>
      </div>

      <div className="p-5">
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#003087]" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Wise Transfer">Wise Transfer</SelectItem>
                <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                <SelectItem value="Withdrawal">Withdrawal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100">
              <p className="text-gray-500">No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => {
                  setSelectedTransaction(transaction);
                  setShowReceipt(true);
                }}
                className="bg-white rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.transaction_type === "Withdrawal" 
                        ? "bg-orange-100" 
                        : "bg-blue-100"
                    }`}>
                      {transaction.transaction_type === "Withdrawal" ? (
                        <ArrowDownLeft className="w-5 h-5 text-orange-600" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{transaction.transaction_type}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {transaction.to_account || "Cash Withdrawal"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(transaction.created_date)}
                      </p>
                      {transaction.reference && (
                        <p className="text-xs text-gray-500 mt-0.5">Ref: {transaction.reference}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">
                      -£{transaction.amount?.toFixed(2)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === "completed" 
                        ? "bg-green-100 text-green-700" 
                        : transaction.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showReceipt && selectedTransaction && (
        <TransactionReceipt
          transaction={selectedTransaction}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
}
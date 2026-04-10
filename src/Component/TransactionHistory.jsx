// TransactionHistory.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaHistory, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaArrowLeft,
  FaSync,
  FaInfoCircle
} from "react-icons/fa";
import useUser from "../hooks/useUsers";

const TransactionHistory = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected

  useEffect(() => {
    if (user?._id) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://backend-project-invest.vercel.app/api/transactions/user/${user._id}`);
      const data = await response.json();
      
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          label: "অনুমোদিত",
          color: "text-green-400",
          bg: "bg-green-500/20",
          border: "border-green-500/30",
          icon: FaCheckCircle
        };
      case "rejected":
        return {
          label: "বাতিল",
          color: "text-red-400",
          bg: "bg-red-500/20",
          border: "border-red-500/30",
          icon: FaTimesCircle
        };
      default:
        return {
          label: "পেন্ডিং",
          color: "text-yellow-400",
          bg: "bg-yellow-500/20",
          border: "border-yellow-500/30",
          icon: FaClock
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('bn-BD', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredTransactions = transactions.filter(trx => {
    if (filter === "all") return true;
    return trx.status === filter;
  });

  const getStatusCount = (status) => {
    if (status === "all") return transactions.length;
    return transactions.filter(trx => trx.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-4 px-3">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button 
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition"
          >
            <FaArrowLeft className="text-white text-lg" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">ট্রানজেকশন ইতিহাস</h1>
            <p className="text-slate-400 text-xs">আপনার সকল লেনদেনের তথ্য</p>
          </div>
          <button 
            onClick={fetchTransactions}
            className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition"
          >
            <FaSync className={`text-white text-sm ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">
            <p className="text-amber-400 text-lg font-bold">{getStatusCount("pending")}</p>
            <p className="text-white/50 text-[10px]">পেন্ডিং</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">
            <p className="text-green-400 text-lg font-bold">{getStatusCount("approved")}</p>
            <p className="text-white/50 text-[10px]">অনুমোদিত</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">
            <p className="text-red-400 text-lg font-bold">{getStatusCount("rejected")}</p>
            <p className="text-white/50 text-[10px]">বাতিল</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { id: "all", label: "সব", icon: FaHistory },
            { id: "pending", label: "পেন্ডিং", icon: FaClock },
            { id: "approved", label: "অনুমোদিত", icon: FaCheckCircle },
            { id: "rejected", label: "বাতিল", icon: FaTimesCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 ${
                filter === tab.id
                  ? "bg-amber-500 text-white shadow-lg"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              <tab.icon className="text-xs" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-white/50 text-sm">লোড হচ্ছে...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-white/5 rounded-xl p-8 text-center border border-white/10">
            <FaHistory className="text-4xl text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">কোনো ট্রানজেকশন পাওয়া যায়নি</p>
            <button 
              onClick={() => navigate("/recharge")}
              className="mt-3 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-medium"
            >
              রিচার্জ করুন
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => {
              const StatusIcon = getStatusConfig(transaction.status).icon;
              const statusConfig = getStatusConfig(transaction.status);
              
              return (
                <div
                  key={transaction._id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 ${statusConfig.bg} rounded-lg flex items-center justify-center`}>
                        <StatusIcon className={`${statusConfig.color} text-sm`} />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">
                          ৳ {transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-white/40 text-[10px]">
                          {transaction.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <div className={`${statusConfig.bg} px-2 py-1 rounded-full`}>
                      <p className={`${statusConfig.color} text-[10px] font-medium`}>
                        {statusConfig.label}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-[10px]">ট্রানজেকশন আইডি</span>
                      <span className="text-white/70 text-[10px] font-mono">
                        {transaction.transactionId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-[10px]">তারিখ</span>
                      <span className="text-white/70 text-[10px]">
                        {formatDate(transaction.createdAt)}
                      </span>
                    </div>
                    {transaction.status === "rejected" && (
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <p className="text-red-400/70 text-[9px] text-center">
                          আপনার ট্রানজেকশনটি বাতিল করা হয়েছে
                        </p>
                      </div>
                    )}
                    {transaction.status === "approved" && (
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <p className="text-green-400/70 text-[9px] text-center flex items-center justify-center gap-1">
                          <FaCheckCircle className="text-[8px]" />
                          আপনার ব্যালেন্সে যুক্ত হয়েছে
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-[9px] flex items-center justify-center gap-1">
            <FaInfoCircle className="text-[8px]" />
            সর্বশেষ আপডেট: {new Date().toLocaleDateString('bn-BD')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
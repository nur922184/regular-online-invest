// WithdrawHistory.jsx - AgroFund Green Theme
import React, { useEffect, useState, useRef } from "react";
import {
  FaArrowLeft,
  FaSync,
  FaSearch,
  FaCopy,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaWallet,
  FaMoneyBillWave,
  FaLeaf,
  FaTractor,
  FaSeedling
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUsers";

const WithdrawHistory = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const hasFetched = useRef(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user?._id && !hasFetched.current) {
      fetchWithdraws(true);
      hasFetched.current = true;
    }
  }, [user]);

  const fetchWithdraws = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setRefreshing(true);

      const res = await fetch(
        `https://investify-backend.vercel.app/api/withdrawals/user/${user._id}`
      );
      const json = await res.json();

      setData(json.withdrawals || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusConfig = (status) => {
    if (status === "approved")
      return { color: "text-green-500", bg: "bg-green-500/10", icon: FaCheckCircle, label: "অনুমোদিত" };
    if (status === "rejected")
      return { color: "text-red-500", bg: "bg-red-500/10", icon: FaTimesCircle, label: "বাতিল" };
    return { color: "text-yellow-500", bg: "bg-yellow-500/10", icon: FaClock, label: "পেন্ডিং" };
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("bn-BD", {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ফিল্টার + সার্চ
  let filtered = data.filter((item) => {
    const matchFilter = filter === "all" || item.status === filter;
    const matchSearch = item.accountNumber?.toLowerCase().includes(search.toLowerCase()) ||
                       item.accountType?.toLowerCase().includes(search.toLowerCase()) ||
                       item.amount?.toString().includes(search);
    return matchFilter && matchSearch;
  });

  // সর্ট - নতুন প্রথমে
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // টোটাল উত্তোলন
  const totalApproved = data
    .filter((d) => d.status === "approved")
    .reduce((sum, d) => sum + d.amount, 0);

  const totalPending = data
    .filter((d) => d.status === "pending")
    .reduce((sum, d) => sum + d.amount, 0);

  const getFilterCount = (status) => {
    if (status === "all") return data.length;
    return data.filter(d => d.status === status).length;
  };

  // অ্যাকাউন্ট টাইপ বাংলা
  const getAccountName = (type) => {
    switch(type) {
      case "bkash": return "বিকাশ";
      case "nagad": return "নগদ";
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="max-w-md mx-auto px-4 py-5">
        
        {/* হেডার */}
        <div className="flex items-center justify-between mb-5">
          <button 
            onClick={() => navigate(-1)} 
            className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center active:bg-green-200 transition"
          >
            <FaArrowLeft className="text-green-700 text-sm" />
          </button>
          
          <div className="flex items-center gap-2">
            <FaMoneyBillWave className="text-green-600 text-lg" />
            <h1 className="text-lg font-bold text-green-800">উত্তোলন ইতিহাস</h1>
          </div>
          
          <button
            onClick={() => fetchWithdraws(false)}
            className={`w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center transition ${
              refreshing ? "animate-spin" : "active:bg-green-200"
            }`}
          >
            <FaSync className="text-green-600 text-sm" />
          </button>
        </div>

        {/* সামারি কার্ড */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-3 shadow-md">
            <p className="text-white/70 text-[10px]">মোট অনুমোদিত উত্তোলন</p>
            <p className="text-white font-bold text-lg">৳ {totalApproved.toLocaleString()}</p>
          </div>
          <div className="bg-yellow-500 rounded-xl p-3 shadow-md">
            <p className="text-white/70 text-[10px]">পেন্ডিং উত্তোলন</p>
            <p className="text-white font-bold text-lg">৳ {totalPending.toLocaleString()}</p>
          </div>
        </div>

        {/* সার্চ বার */}
        <div className="mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 text-xs" />
            <input
              type="text"
              placeholder="অ্যাকাউন্ট নম্বর বা টাকার পরিমাণ খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-green-200 rounded-lg text-green-800 text-sm placeholder:text-green-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ফিল্টার বাটন */}
        <div className="flex gap-2 mb-4">
          {[
            { id: "all", label: "সব", count: getFilterCount("all") },
            { id: "pending", label: "পেন্ডিং", count: getFilterCount("pending") },
            { id: "approved", label: "অনুমোদিত", count: getFilterCount("approved") },
            { id: "rejected", label: "বাতিল", count: getFilterCount("rejected") }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition ${
                filter === f.id
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white border border-green-200 text-green-700 hover:bg-green-50"
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* লিস্ট */}
        {loading ? (
          <div className="text-center py-10">
            <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-green-600 text-sm">উত্তোলন লোড হচ্ছে...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-green-100">
            <FaMoneyBillWave className="text-green-300 text-4xl mx-auto mb-2" />
            <p className="text-green-500 text-sm">কোন উত্তোলন পাওয়া যায়নি</p>
            <p className="text-green-400 text-[10px] mt-1">উত্তোলন করতে নিচের বাটনে ক্লিক করুন</p>
            <button
              onClick={() => navigate("/withdraw")}
              className="mt-3 px-4 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition"
            >
              উত্তোলন করুন
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const { icon: Icon, color, bg, label } = getStatusConfig(item.status);

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl p-4 border border-green-100 shadow-sm hover:shadow-md transition-all"
                >
                  {/* হেডার */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg}`}>
                        <Icon className={color} size={14} />
                      </div>
                      <div>
                        <p className="text-green-800 font-bold text-base">
                          ৳ {item.amount?.toLocaleString()}
                        </p>
                        <p className="text-green-500 text-[10px]">উত্তোলন</p>
                      </div>
                    </div>
                    <span className={`${color} text-[10px] font-medium px-2 py-0.5 rounded-full ${bg}`}>
                      {label}
                    </span>
                  </div>

                  {/* ডিটেইলস */}
                  <div className="space-y-2 text-xs border-t border-green-100 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">অ্যাকাউন্ট:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-green-700">
                          {getAccountName(item.accountType)} - {item.accountNumber}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.accountNumber);
                            const toast = document.createElement('div');
                            toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-lg text-xs z-50';
                            toast.innerText = 'কপি হয়েছে!';
                            document.body.appendChild(toast);
                            setTimeout(() => toast.remove(), 1500);
                          }}
                          className="p-1 hover:bg-green-100 rounded transition"
                        >
                          <FaCopy className="text-green-500 text-[10px]" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">তারিখ ও সময়:</span>
                      <span className="text-green-700">{formatDate(item.createdAt)}</span>
                    </div>
                    {item.serviceCharge && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">সার্ভিস চার্জ (৫%):</span>
                        <span className="text-yellow-600">৳ {item.serviceCharge?.toFixed(2)}</span>
                      </div>
                    )}
                    {item.totalDeduction && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">মোট কাটা:</span>
                        <span className="text-red-500 font-medium">৳ {item.totalDeduction?.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* অ্যাকশন বাটন */}
        <div className="mt-5">
          <button
            onClick={() => navigate("/withdraw")}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2.5 rounded-lg font-semibold text-sm transition active:scale-95"
          >
            + নতুন উত্তোলন করুন
          </button>
        </div>

        {/* ফুটার */}
        <div className="text-center mt-6 pt-4 border-t border-green-100">
          <div className="flex justify-center gap-2 mb-1">
            <FaLeaf className="text-green-400 text-xs" />
            <FaSeedling className="text-green-500 text-xs" />
            <FaTractor className="text-green-600 text-xs" />
          </div>
          <p className="text-gray-400 text-[10px]">AgroFund - আপনার কৃষি সঙ্গী</p>
        </div>

      </div>
    </div>
  );
};

export default WithdrawHistory;
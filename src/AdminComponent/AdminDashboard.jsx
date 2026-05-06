// AdminDashboard.jsx - Complete Professional Dashboard
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaMoneyBillWave,
  FaWallet,
  FaChartLine,
  FaArrowLeft,
  FaLeaf,
  FaTractor,
  FaSeedling,
  FaSpinner,
  FaCalendarAlt,
  FaDollarSign,
  FaShoppingCart,
  FaHandHoldingUsd,
  FaExchangeAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUserPlus,
  FaRocket,
  FaGift
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    blockedUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0
  });
  const [financials, setFinancials] = useState({
    totalDeposit: 0,
    totalWithdraw: 0,
    totalInvestments: 0,
    totalBonus: 0,
    pendingDeposit: 0,
    pendingWithdraw: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [topInvestors, setTopInvestors] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // ইউজার স্ট্যাটস
      const userRes = await fetch("https://investify-backend.vercel.app/api/users/admin/dashboard");
      const userData = await userRes.json();
      
      if (userData.success) {
        setStats(userData.data);
      }
      
      // ট্রানজেকশন স্ট্যাটস
      const transRes = await fetch("https://investify-backend.vercel.app/api/transactions/all");
      const transData = await transRes.json();
      const transactions = transData.transactions || [];
      
      // উইথড্র স্ট্যাটস
      const withdrawRes = await fetch("https://investify-backend.vercel.app/api/withdrawals/admin/all");
      const withdrawData = await withdrawRes.json();
      const withdrawals = withdrawData.withdrawals || [];
      
      // ইনভেস্টমেন্ট স্ট্যাটস
      const investRes = await fetch("https://investify-backend.vercel.app/api/investments/all");
      const investData = await investRes.json();
      const investments = investData.investments || [];
      
      // ফাইন্যান্সিয়াল ক্যালকুলেশন
      const totalDeposit = transactions.filter(t => t.status === "approved").reduce((sum, t) => sum + t.amount, 0);
      const pendingDeposit = transactions.filter(t => t.status === "pending").reduce((sum, t) => sum + t.amount, 0);
      const totalWithdraw = withdrawals.filter(w => w.status === "approved").reduce((sum, w) => sum + w.amount, 0);
      const pendingWithdraw = withdrawals.filter(w => w.status === "pending").reduce((sum, w) => sum + w.amount, 0);
      const totalInvestments = investments.reduce((sum, i) => sum + i.amount, 0);
      
      setFinancials({
        totalDeposit,
        totalWithdraw,
        totalInvestments,
        totalBonus: totalDeposit * 0.05,
        pendingDeposit,
        pendingWithdraw
      });
      
      // সাম্প্রতিক কার্যক্রম
      const recent = [...transactions.slice(0, 5), ...withdrawals.slice(0, 5)]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentActivities(recent);
      
      // শীর্ষ বিনিয়োগকারী
      const investorMap = new Map();
      investments.forEach(inv => {
        const userId = inv.userId?._id || inv.userId;
        if (userId) {
          const current = investorMap.get(userId) || { name: inv.userId?.name || "ইউজার", amount: 0 };
          current.amount += inv.amount;
          investorMap.set(userId, current);
        }
      });
      const topInvestorsList = Array.from(investorMap.values())
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);
      setTopInvestors(topInvestorsList);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return "০";
    return new Intl.NumberFormat("bn-BD").format(num);
  };

  const statCards = [
    { label: "মোট ইউজার", value: stats.totalUsers, icon: FaUsers, color: "from-blue-600 to-blue-700", bg: "bg-blue-100" },
    { label: "সক্রিয় ইউজার", value: stats.activeUsers, icon: FaUserCheck, color: "from-green-600 to-green-700", bg: "bg-green-100" },
    { label: "ব্লক ইউজার", value: stats.blockedUsers, icon: FaUserTimes, color: "from-red-600 to-red-700", bg: "bg-red-100" },
    { label: "নতুন ইউজার (এই মাস)", value: stats.newUsersThisMonth || 0, icon: FaUserPlus, color: "from-purple-600 to-purple-700", bg: "bg-purple-100" }
  ];

  const financeCards = [
    { label: "মোট ডিপোজিট", value: financials.totalDeposit, icon: FaWallet, color: "from-emerald-600 to-green-700", prefix: "৳" },
    { label: "মোট উত্তোলন", value: financials.totalWithdraw, icon: FaHandHoldingUsd, color: "from-orange-600 to-red-700", prefix: "৳" },
    { label: "মোট বিনিয়োগ", value: financials.totalInvestments, icon: FaChartLine, color: "from-cyan-600 to-blue-700", prefix: "৳" },
    { label: "পেন্ডিং ডিপোজিট", value: financials.pendingDeposit, icon: FaClock, color: "from-yellow-600 to-amber-700", prefix: "৳" },
    { label: "পেন্ডিং উত্তোলন", value: financials.pendingWithdraw, icon: FaClock, color: "from-yellow-600 to-amber-700", prefix: "৳" },
    { label: "বোনাস বিতরণ", value: financials.totalBonus, icon: FaGift, color: "from-pink-600 to-rose-700", prefix: "৳" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-3" />
          <p className="text-green-600 text-sm">ড্যাশবোর্ড লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-md mx-auto px-4 py-5 pb-20">
        
        {/* হেডার */}
        <div className="flex items-center gap-3 mb-5">
          <button 
            onClick={() => navigate(-1)} 
            className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center active:bg-green-200 transition"
          >
            <FaArrowLeft className="text-green-700 text-sm" />
          </button>
          <div className="flex items-center gap-2">
            <FaChartLine className="text-green-600 text-lg" />
            <h1 className="text-lg font-bold text-green-800">এডমিন ড্যাশবোর্ড</h1>
          </div>
          <FaUsers className="text-green-600 ml-auto text-sm" />
        </div>

        {/* স্ট্যাটিসটিক্স গ্রিড - 2 কলাম */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {statCards.map((card, idx) => (
            <div key={idx} className={`bg-gradient-to-r ${card.color} rounded-xl p-3 shadow-md`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-[10px]">{card.label}</p>
                  <p className="text-white font-bold text-lg">{formatNumber(card.value)}</p>
                </div>
                <card.icon className="text-white/40 text-2xl" />
              </div>
            </div>
          ))}
        </div>

        {/* ফাইন্যান্সিয়াল সেকশন */}
        <div className="bg-white rounded-xl shadow-md border border-green-100 p-4 mb-5">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-green-100">
            <FaBangladeshiTakaSign className="text-green-600 text-sm" />
            <h2 className="text-green-800 font-semibold text-sm">আর্থিক সারাংশ</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {financeCards.map((card, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <card.icon className="text-green-500 text-xs" />
                  <span className="text-gray-500 text-[9px]">{card.label}</span>
                </div>
                <p className="text-green-700 font-bold text-sm">{card.prefix}{formatNumber(card.value)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* শীর্ষ বিনিয়োগকারী */}
        {topInvestors.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-green-100 p-4 mb-5">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-green-100">
              <FaRocket className="text-green-600 text-sm" />
              <h2 className="text-green-800 font-semibold text-sm">শীর্ষ বিনিয়োগকারী</h2>
            </div>
            <div className="space-y-2">
              {topInvestors.map((investor, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs font-bold">#{idx + 1}</span>
                    </div>
                    <span className="text-gray-700 text-sm">{investor.name}</span>
                  </div>
                  <span className="text-green-600 font-bold text-sm">৳{formatNumber(investor.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* সাম্প্রতিক কার্যক্রম */}
        {recentActivities.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-green-100 p-4 mb-5">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-green-100">
              <FaExchangeAlt className="text-green-600 text-sm" />
              <h2 className="text-green-800 font-semibold text-sm">সাম্প্রতিক কার্যক্রম</h2>
            </div>
            <div className="space-y-2">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2">
                    {activity.status === "approved" ? (
                      <FaCheckCircle className="text-green-500 text-xs" />
                    ) : activity.status === "rejected" ? (
                      <FaTimesCircle className="text-red-500 text-xs" />
                    ) : (
                      <FaClock className="text-yellow-500 text-xs" />
                    )}
                    <div>
                      <p className="text-gray-700 text-xs">
                        {activity.amount ? `৳${formatNumber(activity.amount)}` : "লেনদেন"}
                      </p>
                      <p className="text-gray-400 text-[8px]">
                        {activity.transactionId || activity.accountNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[8px] px-2 py-0.5 rounded-full ${
                    activity.status === "approved" ? "bg-green-100 text-green-600" :
                    activity.status === "rejected" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"
                  }`}>
                    {activity.status === "approved" ? "অনুমোদিত" :
                     activity.status === "rejected" ? "বাতিল" : "পেন্ডিং"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* কুইক অ্যাকশন */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={() => navigate("/admin/users")}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:shadow-md transition"
          >
            <FaUsers className="inline mr-1" /> ইউজার ব্যবস্থাপনা
          </button>
          <button
            onClick={() => navigate("/admin/transactions")}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 rounded-lg text-sm font-medium hover:shadow-md transition"
          >
            <FaExchangeAlt className="inline mr-1" /> লেনদেন দেখুন
          </button>
        </div>

        {/* ফুটার */}
        <div className="text-center pt-4 border-t border-green-100">
          <div className="flex justify-center gap-2 mb-1">
            <FaLeaf className="text-green-400 text-xs" />
            <FaSeedling className="text-green-500 text-xs" />
            <FaTractor className="text-green-600 text-xs" />
          </div>
          <p className="text-gray-400 text-[10px]">AgroFund - এডমিন প্যানেল</p>
          <p className="text-gray-300 text-[8px] mt-1">সর্বশেষ আপডেট: {new Date().toLocaleString("bn-BD")}</p>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
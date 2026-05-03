// UserProfile.jsx - Professional Clean Design
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaWallet,
  FaUserFriends,
  FaChartLine,
  FaGift,
  FaSignOutAlt,
  FaSyncAlt,
  FaArrowRight,
  FaCopy,
  FaHistory,
  FaUsers,
  FaHandHoldingUsd,
  FaLock,
  FaQuestionCircle,
  FaHeadset,
  FaUserPlus,
  FaLeaf,
  FaTractor,
  FaSeedling,
  FaCheckCircle,
  FaShieldAlt,
  FaDatabase,
  FaMoneyCheckAlt,
  FaProductHunt,
  FaUserShield,
  FaFileInvoiceDollar,
  FaArrowLeft,
  FaBoxOpen
} from "react-icons/fa";
import Swal from "sweetalert2";
import useUser from "../hooks/useUsers";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, loading, refresh } = useUser();
  const [copying, setCopying] = useState(false);

  const isAdmin = user?.role === "admin";

  const copyReferralCode = async () => {
    if (!user?.refCode) return;
    setCopying(true);
    await navigator.clipboard.writeText(user.refCode);
    Swal.fire({
      icon: "success",
      title: "কপি হয়েছে!",
      timer: 1200,
      showConfirmButton: false,
      background: "#fff",
      iconColor: "#16a34a"
    });
    setCopying(false);
  };

  const handleLogout = async () => {
    const res = await Swal.fire({
      title: "লগআউট করবেন?",
      text: "আপনি কি নিশ্চিত?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, লগআউট",
      cancelButtonText: "না",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280"
    });

    if (res.isConfirmed) {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-green-600 text-sm">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const totalReferrals = (user?.level1Count || 0) + (user?.level2Count || 0) + (user?.level3Count || 0);

  // ইউজার মেনু আইটেম
  const userMenuItems = [
    { icon: FaUserPlus, label: "অ্যাকাউন্ট সমূহ", path: "/account_list", color: "text-emerald-600" },
    { icon: FaSyncAlt, label: "রিচার্জ", path: "/topup", color: "text-blue-600" },
    { icon: FaHandHoldingUsd, label: "উত্তোলন", path: "/withdraw", color: "text-orange-600" },
    { icon: FaUsers, label: "আমার দল", path: "/refer", color: "text-purple-600" },
    { icon: FaHistory, label: "রিচার্জ ইতিহাস", path: "/transition_history", color: "text-cyan-600" },
    { icon: FaHistory, label: "উত্তোলন ইতিহাস", path: "/withdrawHistory", color: "text-pink-600" },
    { icon: FaLock, label: "পাসওয়ার্ড পরিবর্তন", path: "/password_change", color: "text-amber-600" }
  ];

  // এডমিন মেনু আইটেম
  const adminMenuItems = [
    { icon: FaProductHunt, label: "পণ্য ব্যবস্থাপনা", path: "/admin/product_manage", color: "text-emerald-600" },
    { icon: FaUserShield, label: "ইউজার ব্যবস্থাপনা", path: "/admin/users", color: "text-blue-600" },
    { icon: FaBoxOpen, label: "বোনাস ব্যবস্থাপনা", path: "/admin/bonus", color: "text-blue-600" },
    { icon: FaDatabase, label: "ডিপোজিট কন্ট্রোল", path: "/admin/deposit", color: "text-orange-600" },
    { icon: FaMoneyCheckAlt, label: "উত্তোলন অনুমোদন", path: "/admin/withdraw", color: "text-purple-600" },
    { icon: FaChartLine, label: "এনালিটিক্স", path: "/admin/analytics", color: "text-cyan-600" },
    { icon: FaFileInvoiceDollar, label: "সব লেনদেন", path: "/admin/transactions", color: "text-pink-600" }
  ];

  // স্ট্যাটিসটিক্স ডাটা
  const stats = [
    { icon: FaWallet, label: "ব্যালেন্স", value: user?.balance || 0, color: "from-green-600 to-emerald-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
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
            <FaLeaf className="text-green-600 text-lg" />
            <h1 className="text-lg font-bold text-green-800">
              {isAdmin ? "এডমিন প্যানেল" : "আমার প্রোফাইল"}
            </h1>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={refresh} 
              className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center active:bg-green-200 transition"
              title="রিফ্রেশ"
            >
              <FaSyncAlt className="text-green-600 text-sm" />
            </button>
            <button 
              onClick={handleLogout} 
              className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center active:bg-red-200 transition"
              title="লগআউট"
            >
              <FaSignOutAlt className="text-red-600 text-sm" />
            </button>
          </div>
        </div>

        {/* প্রোফাইল কার্ড */}
        <div className="bg-white rounded-xl shadow-md border border-green-100 p-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <FaUserCircle className="text-white text-4xl" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-800">{user?.name || "ইউজার"}</h2>
              <p className="text-gray-500 text-xs">{user?.phone || "নম্বর নেই"}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-green-700 text-xs font-mono bg-green-50 px-2 py-0.5 rounded">
                  {user?.refCode || "N/A"}
                </span>
                <button onClick={copyReferralCode} className="text-green-500 hover:text-green-700">
                  <FaCopy size={12} />
                </button>
              </div>
            </div>
            {isAdmin && (
              <div className="bg-red-100 px-2 py-1 rounded-lg">
                <FaShieldAlt className="text-red-600 text-sm" />
                <span className="text-red-600 text-[8px] font-bold">এডমিন</span>
              </div>
            )}
          </div>
        </div>

        {/* স্ট্যাটিসটিক্স গ্রিড */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          {stats.map((stat, idx) => (
            <div key={idx} className={`bg-gradient-to-r ${stat.color} rounded-xl p-3 shadow-md`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-[10px]">{stat.label}</p>
                  <p className="text-white font-bold text-lg">৳ {stat.value.toLocaleString()}</p>
                </div>
                <stat.icon className="text-white/40 text-2xl" />
              </div>
            </div>
          ))}
        </div>

        {/* ইউজার মেনু */}
        {!isAdmin && (
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden mb-5">
            <div className="bg-green-50 px-4 py-2 border-b border-green-100">
              <h3 className="text-green-800 font-semibold text-sm flex items-center gap-2">
                <FaUserCircle className="text-green-600" />
                ইউজার মেনু
              </h3>
            </div>
            <div className="divide-y divide-green-50">
              {userMenuItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className="flex items-center justify-between w-full p-3 hover:bg-green-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`${item.color} text-sm`} />
                    <span className="text-gray-700 text-sm">{item.label}</span>
                  </div>
                  <FaArrowRight className="text-gray-300 text-xs group-hover:text-green-500 transition" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* এডমিন মেনু */}
        {isAdmin && (
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden mb-5">
            <div className="bg-red-50 px-4 py-2 border-b border-red-100">
              <h3 className="text-red-800 font-semibold text-sm flex items-center gap-2">
                <FaShieldAlt className="text-red-600" />
                এডমিন প্যানেল
              </h3>
            </div>
            <div className="divide-y divide-green-50">
              {adminMenuItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className="flex items-center justify-between w-full p-3 hover:bg-red-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`${item.color} text-sm`} />
                    <span className="text-gray-700 text-sm">{item.label}</span>
                  </div>
                  <FaArrowRight className="text-gray-300 text-xs group-hover:text-red-500 transition" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* সাপোর্ট সেকশন */}
        <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden mb-5">
          <div className="bg-green-50 px-4 py-2 border-b border-green-100">
            <h3 className="text-green-800 font-semibold text-sm flex items-center gap-2">
              <FaHeadset className="text-green-600" />
              সাপোর্ট
            </h3>
          </div>
          <div className="divide-y divide-green-50">
            <button
              onClick={() => navigate("/support")}
              className="flex items-center justify-between w-full p-3 hover:bg-green-50 transition group"
            >
              <div className="flex items-center gap-3">
                <FaQuestionCircle className="text-blue-600 text-sm" />
                <span className="text-gray-700 text-sm">সহায়তা কেন্দ্র</span>
              </div>
              <FaArrowRight className="text-gray-300 text-xs group-hover:text-green-500 transition" />
            </button>
            <button
              onClick={() => navigate("/support")}
              className="flex items-center justify-between w-full p-3 hover:bg-green-50 transition group"
            >
              <div className="flex items-center gap-3">
                <FaHeadset className="text-green-600 text-sm" />
                <span className="text-gray-700 text-sm">যোগাযোগ করুন</span>
              </div>
              <FaArrowRight className="text-gray-300 text-xs group-hover:text-green-500 transition" />
            </button>
            <button
              onClick={handleLogout} 
              className="flex items-center justify-between w-full p-3 hover:bg-green-50 transition group"
            >
              <div className="flex items-center gap-3">
                <FaSignOutAlt className="text-red-600 text-sm" />
                <span className="text-red-700 text-sm">লগ আউট</span>
              </div>
              <FaArrowRight className="text-gray-300 text-xs group-hover:text-green-500 transition" />
            </button>
          </div>
        </div>

        {/* ফুটার */}
        <div className="text-center">
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

export default UserProfile;
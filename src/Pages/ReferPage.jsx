// ReferPage.jsx - আপডেটেড ডাইরেক্ট রেফারেল লিস্ট সহ
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaCopy, 
  FaShare, 
  FaWhatsapp, 
  FaFacebook, 
  FaEnvelope, 
  FaUserFriends,
  FaCrown,
  FaStar,
  FaChartLine,
  FaGift,
  FaArrowLeft,
  FaUsers,
  FaMoneyBillWave,
  FaLink,
  FaUserCircle,
  FaWallet,
  FaTrophy,
  // FaBangladeshiTakaSign,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const ReferPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(false);
  const [stats, setStats] = useState({
    refCode: "",
    name: "",
    phone: "",
    balance: 0,
    level1Count: 0,
    level2Count: 0,
    level3Count: 0,
    level1Earnings: 0,
    level2Earnings: 0,
    level3Earnings: 0,
    totalEarnings: 0,
    referredUsers: []
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId") || JSON.parse(localStorage.getItem("user"))?._id;
      
      if (!userId) {
        Swal.fire("লগইন প্রয়োজন", "দয়া করে লগইন করুন", "warning").then(() => navigate("/login"));
        return;
      }

      // সব ইউজার লোড
      const res = await axios.get("https://backend-project-invest.vercel.app/api/users/all");
      const users = res.data?.users || [];
      const currentUser = users.find(u => u._id === userId) || JSON.parse(localStorage.getItem("user"));

      if (currentUser) {
        const level1 = users.filter(u => u.referredBy === currentUser.refCode);
        const level2 = users.filter(u => level1.some(l1 => u.referredBy === l1.refCode));
        const level3 = users.filter(u => level2.some(l2 => u.referredBy === l2.refCode));
        
        // প্রতিটি রেফারেলের ডিপোজিট তথ্য নেওয়ার চেষ্টা
        const referredUsersWithDeposits = await Promise.all(
          level1.map(async (refUser) => {
            try {
              // ইউজারের ট্রানজেকশন তথ্য নেওয়া
              const txRes = await axios.get(`https://backend-project-invest.vercel.app/api/transactions/user/${refUser._id}`);
              const transactions = txRes.data?.transactions || [];
              const approvedDeposits = transactions.filter(t => t.status === "approved");
              const totalDeposit = approvedDeposits.reduce((sum, t) => sum + t.amount, 0);
              const lastDeposit = approvedDeposits[approvedDeposits.length - 1];
              
              return {
                ...refUser,
                totalDeposit: totalDeposit,
                lastDepositAmount: lastDeposit?.amount || 0,
                lastDepositDate: lastDeposit?.createdAt || null,
                transactionCount: approvedDeposits.length
              };
            } catch (error) {
              console.error("Error fetching transactions for user:", refUser.name, error);
              return {
                ...refUser,
                totalDeposit: 0,
                lastDepositAmount: 0,
                lastDepositDate: null,
                transactionCount: 0
              };
            }
          })
        );
        
        setStats({
          refCode: currentUser.refCode,
          name: currentUser.name,
          phone: currentUser.phone,
          balance: currentUser.balance || 0,
          level1Count: level1.length,
          level2Count: level2.length,
          level3Count: level3.length,
          level1Earnings: level1.length * 250,
          level2Earnings: level2.length * 30,
          level3Earnings: level3.length * 20,
          totalEarnings: (level1.length * 250) + (level2.length * 30) + (level3.length * 20),
          referredUsers: referredUsersWithDeposits
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const referLink = `${window.location.origin}/signup?ref=${stats.refCode}`;

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    Swal.fire({ icon: "success", title: "কপি হয়েছে!", timer: 1500, showConfirmButton: false });
  };

  const shareVia = (platform) => {
    const text = `আমার সাথে যোগ দিন! রেফারেল কোড: ${stats.refCode}\nসাইনআপ লিংক: ${referLink}`;
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referLink)}`,
      email: `mailto:?subject=AgroFund তে যোগ দিন&body=${encodeURIComponent(text)}`
    };
    window.open(urls[platform], "_blank");
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("bn-BD");
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return "০";
    return new Intl.NumberFormat("bn-BD").format(num);
  };

  const levels = [
    { level: 1, name: "ডাইরেক্ট", icon: FaCrown, color: "from-purple-500 to-pink-500", count: stats.level1Count, earnings: stats.level1Earnings, perReferral: 250, percentage: "10%" },
    { level: 2, name: "সেকেন্ড", icon: FaStar, color: "from-blue-500 to-cyan-500", count: stats.level2Count, earnings: stats.level2Earnings, perReferral: 30, percentage: "5%" },
    { level: 3, name: "থার্ড", icon: FaChartLine, color: "from-green-500 to-emerald-500", count: stats.level3Count, earnings: stats.level3Earnings, perReferral: 20, percentage: "2%" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-md mx-auto px-4 py-5">
        
        {/* হেডার */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(-1)} className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <FaArrowLeft className="text-green-700 text-sm" />
          </button>
          <div className="flex items-center gap-2">
            <FaUserFriends className="text-green-600 text-lg" />
            <h1 className="text-lg font-bold text-green-800">রেফারেল</h1>
          </div>
        </div>

        {/* ইউজার কার্ড */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 shadow-md mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <FaUserCircle className="text-white text-3xl" />
            </div>
            <div className="flex-1">
              <p className="text-white/80 text-xs">স্বাগতম</p>
              <p className="text-white font-bold text-base">{stats.name}</p>
              <p className="text-white/70 text-[10px]">{stats.phone}</p>
            </div>
            <div className="bg-white/20 px-2 py-1 rounded-lg">
              <p className="text-white text-[10px]">কোড</p>
              <p className="text-white font-bold text-xs">{stats.refCode}</p>
            </div>
          </div>
        </div>

        {/* স্ট্যাটিসটিক্স গ্রিড - 2 কলাম */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-[10px]">মোট আয়</p>
                <p className="text-green-700 font-bold text-base">৳{formatNumber(stats.totalEarnings)}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FaMoneyBillWave className="text-green-600 text-sm" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-[10px]">মোট রেফারেল</p>
                <p className="text-green-700 font-bold text-base">{stats.level1Count + stats.level2Count + stats.level3Count}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FaUsers className="text-green-600 text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* লেভেল কার্ড - 3 কলাম */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {levels.map((level, idx) => (
            <div key={idx} className={`bg-gradient-to-r ${level.color} rounded-xl p-2 text-center text-white`}>
              <level.icon className="text-lg mx-auto mb-1" />
              <p className="text-[10px] font-bold">L-{level.level}</p>
              <p className="text-lg font-bold">{level.count}</p>
              <p className="text-[8px] opacity-80">{level.percentage}</p>
              <p className="text-[8px] opacity-80">৳{formatNumber(level.earnings)}</p>
            </div>
          ))}
        </div>

        {/* রেফারেল লিংক */}
        <div className="bg-white rounded-xl shadow-md border border-green-100 p-4 mb-5">
          <p className="text-green-800 text-xs font-semibold mb-2 flex items-center gap-1">
            <FaLink className="text-green-600" />
            আপনার লিংক
          </p>
          <div className="flex gap-2">
            <input type="text" value={referLink} readOnly className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600" />
            <button onClick={() => copyToClipboard(referLink)} className="bg-green-600 text-white px-3 py-2 rounded-lg text-xs flex items-center gap-1">
              <FaCopy size={10} /> কপি
            </button>
          </div>
        </div>

        {/* শেয়ার অপশন - 3 কলাম */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { name: "হোয়াটসঅ্যাপ", icon: FaWhatsapp, color: "bg-green-500", action: () => shareVia("whatsapp") },
            { name: "ফেসবুক", icon: FaFacebook, color: "bg-blue-600", action: () => shareVia("facebook") },
            { name: "ইমেইল", icon: FaEnvelope, color: "bg-gray-600", action: () => shareVia("email") }
          ].map((item, idx) => (
            <button key={idx} onClick={item.action} className={`${item.color} text-white p-2 rounded-lg flex items-center justify-center gap-1 text-xs`}>
              <item.icon size={12} /> {item.name}
            </button>
          ))}
        </div>

        {/* ডাইরেক্ট রেফারেল লিস্ট - আপডেটেড */}
        {stats.referredUsers.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden mb-5">
            <div className="bg-gradient-to-r from-green-50 to-white px-4 py-3 border-b border-green-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaUsers className="text-green-600 text-sm" />
                  <p className="text-green-800 text-sm font-semibold">
                    আপনার ডাইরেক্ট রেফারেল ({stats.referredUsers.length})
                  </p>
                </div>
                <button 
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-green-500 text-xs flex items-center gap-1"
                >
                  {showBalance ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
                  {showBalance ? "লুকান" : "দেখুন"}
                </button>
              </div>
              <p className="text-gray-500 text-[10px] mt-1">
                প্রতিটি ডিপোজিটের উপর আপনি 10% কমিশন পাবেন
              </p>
            </div>
            
            <div className="divide-y divide-green-50 max-h-80 overflow-y-auto">
              {stats.referredUsers.map((user, idx) => (
                <div key={idx} className="p-3 hover:bg-green-50 transition">
                  {/* ইউজার বেসিক তথ্য */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <FaUserCircle className="text-green-600 text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{user.name}</p>
                        <p className="text-[10px] text-gray-500">{user.phone}</p>
                      </div>
                    </div>
                    <span className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded-full">
                      +10% কমিশন
                    </span>
                  </div>
                  
                  {/* ডিপোজিট তথ্য */}
                  <div className="ml-10">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <FaBangladeshiTakaSign className="text-green-500 text-[10px]" />
                        <span className="text-gray-600">মোট ডিপোজিট:</span>
                        <span className="font-semibold text-green-600">
                          {showBalance ? `৳${formatNumber(user.totalDeposit)}` : "****"}
                        </span>
                      </div>
                      <div className="w-px h-3 bg-gray-200"></div>
                      <div className="flex items-center gap-1">
                        <FaMoneyBillWave className="text-blue-500 text-[10px]" />
                        <span className="text-gray-600">লেনদেন:</span>
                        <span className="font-semibold text-blue-600">{user.transactionCount}টি</span>
                      </div>
                    </div>
                    
                    {/* সর্বশেষ ডিপোজিট */}
                    {user.lastDepositAmount > 0 && (
                      <div className="mt-1 text-[10px] text-gray-400 flex items-center gap-2">
                        <span>সর্বশেষ ডিপোজিট:</span>
                        <span className="text-green-600">
                          {showBalance ? `৳${formatNumber(user.lastDepositAmount)}` : "****"}
                        </span>
                        <span>• {formatDate(user.lastDepositDate)}</span>
                      </div>
                    )}
                    
                    {/* কমিশন ক্যালকুলেশন */}
                    {user.totalDeposit > 0 && showBalance && (
                      <div className="mt-2 pt-1 border-t border-green-100">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-500">আপনার কমিশন (10%):</span>
                          <span className="text-green-600 font-semibold">
                            + ৳{formatNumber(user.totalDeposit * 0.10)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* টোটাল কমিশন ফুটার */}
            {stats.referredUsers.some(u => u.totalDeposit > 0) && showBalance && (
              <div className="bg-green-50 px-4 py-2 border-t border-green-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">মোট কমিশন (ডাইরেক্ট রেফারেল থেকে):</span>
                  <span className="text-green-700 font-bold">
                    ৳{formatNumber(stats.referredUsers.reduce((sum, u) => sum + (u.totalDeposit * 0.10), 0))}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* নির্দেশিকা */}
        <div className="bg-green-50 rounded-xl p-3 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <FaTrophy className="text-green-600 text-sm" />
            <p className="text-green-800 text-xs font-semibold">কিভাবে আয় করবেন?</p>
          </div>
          <div className="space-y-1 text-green-700 text-[10px]">
            <p>• বন্ধুদের লিংক শেয়ার করুন</p>
            <p>• আপনার রেফারেল যত ডিপোজিট করবেন, তত কমিশন পাবেন</p>
            <p>• Level 1: 10%, Level 2: 5%, Level 3: 2% কমিশন</p>
            <p>• আয় সরাসরি আপনার ব্যালেন্সে জমা হবে</p>
          </div>
        </div>

        {/* ফুটার */}
        <div className="text-center mt-5 pt-3 border-t border-green-100">
          <p className="text-gray-400 text-[10px]">AgroFund - আপনার কৃষি সঙ্গী</p>
        </div>

      </div>
    </div>
  );
};

export default ReferPage;
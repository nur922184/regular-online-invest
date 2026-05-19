// MyInvestments.jsx - Professional Green Theme with Caching

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMoneyBillWave, 
  FaHourglassHalf,
  FaLeaf,
  FaTractor,
  FaSeedling,
  FaWallet,
  FaChartLine,
  FaCheckCircle,
  FaSpinner,
  FaArrowLeft,
  FaInfoCircle,
  FaDatabase,
  FaSyncAlt
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import useUser from "../hooks/useUsers";

const MyInvestments = () => {
  const navigate = useNavigate();
  const { user, refresh } = useUser();

  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState({});
  const [timers, setTimers] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCachedData, setIsCachedData] = useState(false);
  
  const timerIntervalRef = useRef(null);
  const isDataLoaded = useRef(false);
  const cacheTimeoutRef = useRef(null);

  // ✅ ক্যাশ থেকে ডাটা লোড করা
  const loadFromCache = useCallback((userId) => {
    try {
      const cached = localStorage.getItem(`investments_cache_${userId}`);
      if (cached) {
        const { data, timestamp, expiry } = JSON.parse(cached);
        // ৫ মিনিটের ক্যাশ (300000 milliseconds)
        if (Date.now() - timestamp < 300000) {
          console.log("ক্যাশ থেকে ইনভেস্টমেন্ট ডাটা লোড করা হচ্ছে...");
          return data;
        }
      }
    } catch (error) {
      console.error("ক্যাশ লোড করতে সমস্যা:", error);
    }
    return null;
  }, []);

  // ✅ ক্যাশে ডাটা সেভ করা
  const saveToCache = useCallback((userId, data) => {
    try {
      const cacheData = {
        data: data,
        timestamp: Date.now(),
        expiry: 300000 // 5 minutes
      };
      localStorage.setItem(`investments_cache_${userId}`, JSON.stringify(cacheData));
      console.log("ইনভেস্টমেন্ট ডাটা ক্যাশে সেভ করা হয়েছে");
    } catch (error) {
      console.error("ক্যাশ সেভ করতে সমস্যা:", error);
    }
  }, []);

  // ✅ ক্যাশ ক্লিয়ার ফাংশন
  const clearCache = useCallback((userId) => {
    try {
      if (userId) {
        localStorage.removeItem(`investments_cache_${userId}`);
        console.log("ইনভেস্টমেন্ট ক্যাশ ক্লিয়ার করা হয়েছে");
      }
    } catch (error) {
      console.error("ক্যাশ ক্লিয়ার করতে সমস্যা:", error);
    }
  }, []);

  // ✅ ডাটা ফেচ (ক্যাশ সহ)
  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      if (!user?._id) {
        setLoading(false);
        return;
      }
      
      // যদি ফোর্স রিফ্রেশ না হয় এবং ইতিমধ্যে ডাটা লোড হয়ে থাকে
      if (!forceRefresh && isDataLoaded.current && investments.length > 0) {
        console.log("ডাটা ইতিমধ্যে লোড করা আছে, স্কিপিং...");
        setLoading(false);
        return;
      }
      
      // ক্যাশ চেক করা (যদি ফোর্স রিফ্রেশ না হয়)
      if (!forceRefresh) {
        const cachedData = loadFromCache(user._id);
        if (cachedData) {
          setInvestments(cachedData);
          setIsCachedData(true);
          
          // টাইমার ক্যালকুলেশন
          const newTimers = {};
          const now = new Date();
          cachedData.forEach((inv) => {
            if (inv.lastClaimDate) {
              const lastClaim = new Date(inv.lastClaimDate);
              const nextClaimTime = new Date(lastClaim);
              nextClaimTime.setHours(nextClaimTime.getHours() + 24);
              let diff = nextClaimTime - now;
              diff = diff > 0 ? diff : 0;
              newTimers[inv._id] = diff;
            } else {
              newTimers[inv._id] = 0;
            }
          });
          setTimers(newTimers);
          setLoading(false);
          return;
        }
      }
      
      setIsCachedData(false);
      
      // API থেকে ডাটা লোড করা
      console.log("API থেকে ইনভেস্টমেন্ট ডাটা লোড করা হচ্ছে...");
      const invRes = await axios.get(`https://investify-fixed.vercel.app/api/investments/user/${user._id}`);
      const userInvestments = invRes.data?.investments || [];
      setInvestments(userInvestments);
      
      // ক্যাশে সেভ করা
      saveToCache(user._id, userInvestments);
      isDataLoaded.current = true;
      setIsCachedData(false);

      // টাইমার ক্যালকুলেশন
      const newTimers = {};
      const now = new Date();
      userInvestments.forEach((inv) => {
        if (inv.lastClaimDate) {
          const lastClaim = new Date(inv.lastClaimDate);
          const nextClaimTime = new Date(lastClaim);
          nextClaimTime.setHours(nextClaimTime.getHours() + 24);
          let diff = nextClaimTime - now;
          diff = diff > 0 ? diff : 0;
          newTimers[inv._id] = diff;
        } else {
          newTimers[inv._id] = 0;
        }
      });
      setTimers(newTimers);

    } catch (err) {
      console.error("Fetch Data Error:", err);
    } finally {
      setLoading(false);
    }
  }, [user, investments.length, loadFromCache, saveToCache]);

  // ✅ ম্যানুয়াল রিফ্রেশ ফাংশন
  const handleManualRefresh = useCallback(async () => {
    if (!user?._id) return;
    
    setIsRefreshing(true);
    Swal.fire({
      title: "রিফ্রেশ করছি...",
      text: "দয়া করে অপেক্ষা করুন",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    // ক্যাশ ক্লিয়ার করা
    clearCache(user._id);
    isDataLoaded.current = false;
    
    // নতুন ডাটা লোড করা
    await fetchData(true);
    
    // ইউজার ডাটাও রিফ্রেশ করা
    if (refresh) {
      await refresh();
    }
    
    Swal.close();
    setIsRefreshing(false);
    
    Swal.fire({
      icon: "success",
      title: "রিফ্রেশ করা হয়েছে",
      text: "সর্বশেষ ডাটা লোড করা হয়েছে",
      timer: 1500,
      showConfirmButton: false
    });
  }, [user, clearCache, fetchData, refresh]);

  // ✅ ইনিশিয়াল ডাটা লোড
  useEffect(() => {
    fetchData();
    
    // টাইমআউট সেট করা (যদি ১০ সেকেন্ডের মধ্যে ডাটা না আসে)
    cacheTimeoutRef.current = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 10000);
    
    return () => {
      if (cacheTimeoutRef.current) {
        clearTimeout(cacheTimeoutRef.current);
      }
    };
  }, [fetchData]);

  // ✅ টাইমার আপডেট (প্রতি সেকেন্ডে)
  useEffect(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      setTimers((prevTimers) => {
        const updated = { ...prevTimers };
        let hasChanges = false;

        Object.keys(updated).forEach((id) => {
          if (updated[id] > 0) {
            updated[id] -= 1000;
            if (updated[id] < 0) updated[id] = 0;
            hasChanges = true;
          }
        });

        return hasChanges ? { ...updated } : prevTimers;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [investments]);

  const formatTime = (ms) => {
    if (ms <= 0) return "ক্লেইম করুন";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}ঘ ${minutes}মি ${seconds}স`;
    } else if (minutes > 0) {
      return `${minutes}মি ${seconds}স`;
    } else {
      return `${seconds}সেকেন্ড`;
    }
  };

  // দৈনিক আয় ক্লেইম
  const handleClaimIncome = async (investmentId) => {
    if (claiming[investmentId]) return;

    const remainingTime = timers[investmentId];
    if (remainingTime > 0) {
      Swal.fire({
        icon: "warning",
        title: "অপেক্ষা করুন!",
        text: `আপনি ${formatTime(remainingTime)} পর আবার ক্লেইম করতে পারবেন`,
        confirmButtonColor: "#16a34a"
      });
      return;
    }

    try {
      setClaiming(prev => ({ ...prev, [investmentId]: true }));

      const response = await axios.post(`https://investify-fixed.vercel.app/api/investments/claim/${investmentId}`, {
        userId: user._id
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "আয় ক্লেইম সফল! 💰",
          html: `
            <div class="text-center">
              <div class="text-4xl mb-2">✅</div>
              <p class="text-lg font-bold text-green-600">৳${response.data.claimedAmount || response.data.amount || 0}</p>
              <p class="text-sm text-gray-500">আপনার ব্যালেন্সে যোগ করা হয়েছে</p>
            </div>
          `,
          confirmButtonColor: "#16a34a",
          timer: 2000
        });

        setTimers(prev => ({
          ...prev,
          [investmentId]: 24 * 60 * 60 * 1000
        }));

        // ক্লেইম করার পর ক্যাশ ক্লিয়ার করে নতুন ডাটা লোড করা
        if (user?._id) {
          clearCache(user._id);
          isDataLoaded.current = false;
          await fetchData(true);
        }
        
        if (refresh) {
          await refresh();
        }
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "ক্লেইম ব্যর্থ!",
        text: err.response?.data?.message || "আয় ক্লেইম করতে ব্যর্থ হয়েছে",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setClaiming(prev => ({ ...prev, [investmentId]: false }));
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return "০";
    return new Intl.NumberFormat("bn-BD").format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-3" />
          <p className="text-green-600 text-sm">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-md mx-auto px-4 py-5">
        
        {/* হেডার */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center active:bg-green-200 transition"
            >
              <FaArrowLeft className="text-green-700 text-sm" />
            </button>
            <div className="flex items-center gap-2">
              <FaChartLine className="text-green-600 text-lg" />
              <h1 className="text-lg font-bold text-green-800">আমার বিনিয়োগ</h1>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center active:bg-green-200 transition"
              title="রিফ্রেশ"
            >
              <FaSyncAlt className={`text-green-600 text-sm ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* ক্যাশ স্ট্যাটাস ইন্ডিকেটর */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] text-gray-400 flex items-center gap-1">
            <FaDatabase size={8} />
            {isCachedData ? "ক্যাশড ডাটা" : "লাইভ ডাটা"}
          </span>
          <span className="text-[9px] text-gray-400">
            {investments.length} টি বিনিয়োগ
          </span>
        </div>

        {/* ব্যালেন্স কার্ড */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 shadow-md mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs mb-0.5">বর্তমান ব্যালেন্স</p>
              <p className="text-white text-2xl font-bold">৳ {formatNumber(user?.balance || 0)}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-xl">
              <FaWallet className="text-white text-xl" />
            </div>
          </div>
        </div>

        {/* ইনভেস্টমেন্ট লিস্ট */}
        {investments.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-green-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaChartLine className="text-green-500 text-3xl" />
            </div>
            <h2 className="text-lg font-bold text-gray-700 mb-2">কোনো বিনিয়োগ নেই</h2>
            <p className="text-gray-500 text-sm mb-5">বিনিয়োগ করে আয় শুরু করুন</p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition"
            >
              বিনিয়োগ করুন
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {investments.map((inv) => {
              const remainingTime = timers[inv._id] || 0;
              const canClaim = remainingTime === 0;
              const isClaiming = claiming[inv._id];

              return (
                <div key={inv._id} className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
                  {/* কার্ড হেডার */}
                  <div className="bg-gradient-to-r from-green-50 to-white p-4 border-b border-green-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800 text-base">{inv.productName}</h3>
                        <p className="text-gray-500 text-[10px] flex items-center gap-1 mt-1">
                          <FaCalendarAlt size={10} />
                          {new Date(inv.startDate).toLocaleDateString("bn-BD")}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                        inv.status === "active" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {inv.status === "active" ? "সক্রিয়" : "সমাপ্ত"}
                      </span>
                    </div>
                  </div>

                  {/* কার্ড বডি */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-green-50 rounded-lg p-2 text-center">
                        <p className="text-gray-500 text-[10px] mb-0.5">বিনিয়োগ</p>
                        <p className="font-bold text-green-600 text-sm">৳{formatNumber(inv.amount)}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-2 text-center">
                        <p className="text-gray-500 text-[10px] mb-0.5">দৈনিক আয়</p>
                        <p className="font-bold text-blue-600 text-sm">৳{formatNumber(inv.dailyIncome)}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-2 text-center">
                        <p className="text-gray-500 text-[10px] mb-0.5">মোট আয়</p>
                        <p className="font-bold text-purple-600 text-sm">৳{formatNumber(inv.totalIncome)}</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-2 text-center">
                        <p className="text-gray-500 text-[10px] mb-0.5">বাকি দিন</p>
                        <p className="font-bold text-orange-600 text-sm">{inv.remainingDays} দিন</p>
                      </div>
                    </div>

                    {/* ক্লেইম বাটন */}
                    <button
                      onClick={() => handleClaimIncome(inv._id)}
                      disabled={!canClaim || isClaiming}
                      className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                        canClaim && !isClaiming
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-md active:scale-95"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isClaiming ? (
                        <>
                          <FaSpinner className="animate-spin" size={14} />
                          ক্লেইম হচ্ছে...
                        </>
                      ) : canClaim ? (
                        <>
                          <FaMoneyBillWave />
                          দৈনিক আয় ক্লেইম করুন
                        </>
                      ) : (
                        <>
                          <FaHourglassHalf />
                          {formatTime(remainingTime)}
                        </>
                      )}
                    </button>

                    {/* বিস্তারিত বাটন */}
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: inv.productName,
                          background: "#fff",
                          color: "#166534",
                          html: `
                            <div class="text-left space-y-2 text-green-800">
                              <div class="bg-green-50 p-3 rounded-lg">
                                <p><strong>💰 বিনিয়োগ:</strong> ৳${formatNumber(inv.amount)}</p>
                                <p><strong>📈 দৈনিক আয়:</strong> ৳${formatNumber(inv.dailyIncome)}</p>
                                <p><strong>🎯 মোট আয়:</strong> ৳${formatNumber(inv.totalIncome)}</p>
                              </div>
                              <div class="bg-gray-50 p-3 rounded-lg">
                                <p><strong>⏳ বাকি দিন:</strong> ${inv.remainingDays} দিন</p>
                                <p><strong>📅 শুরু তারিখ:</strong> ${new Date(inv.startDate).toLocaleDateString("bn-BD")}</p>
                                ${inv.lastClaimDate ? `<p><strong>🕐 শেষ ক্লেইম:</strong> ${new Date(inv.lastClaimDate).toLocaleString("bn-BD")}</p>` : ''}
                              </div>
                            </div>
                          `,
                          icon: "info",
                          confirmButtonText: "ঠিক আছে",
                          confirmButtonColor: "#16a34a"
                        });
                      }}
                      className="w-full mt-2 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-50 transition flex items-center justify-center gap-1"
                    >
                      <FaInfoCircle size={10} />
                      বিস্তারিত তথ্য
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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

export default MyInvestments;
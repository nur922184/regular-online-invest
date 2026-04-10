import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { FaCalendarAlt, FaClock, FaGift, FaMoneyBillWave, FaHourglassHalf } from "react-icons/fa";
import useUser from "../hooks/useUsers";

const MyInvestments = () => {
  const navigate = useNavigate();
  const { user, refresh } = useUser();

  const [investments, setInvestments] = useState([]);
  const [bonus, setBonus] = useState({});
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState({});
  const [timers, setTimers] = useState({});
  const timerIntervalRef = useRef(null);

  // Fetch Investments + Bonus
  // MyInvestments.js - আপডেটেড useEffect অংশ

  // Fetch Investments + Bonus
  const fetchData = useCallback(async () => {
    try {
      if (!user?._id) return;

      const [invRes, bonusRes] = await Promise.all([
        axios.get(`https://backend-project-invest.vercel.app/api/investments/user/${user._id}`),
        axios.get(`https://backend-project-invest.vercel.app/api/bonus/status/${user._id}`),
      ]);

      const userInvestments = invRes.data?.investments || [];
      setInvestments(userInvestments);
      setBonus(bonusRes.data || {});

      // ✅ Calculate timers from server data
      const newTimers = {};
      const now = new Date();

      userInvestments.forEach((inv) => {
        // Use remainingTime from server if available
        if (inv.remainingTime !== undefined) {
          newTimers[inv._id] = inv.remainingTime;
        }
        // Otherwise calculate from lastClaimDate
        else if (inv.lastClaimDate) {
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
  }, [user]);

  useEffect(() => {
    fetchData();

    // Refresh every 5 seconds to sync with server
    const refreshInterval = setInterval(fetchData, 5000);

    return () => {
      clearInterval(refreshInterval);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [fetchData]);

  // Countdown Timer Update every second
  useEffect(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

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
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [investments]); // Re-run when investments change

  const formatTime = (ms) => {
    if (ms <= 0) return "দাবি করুন";

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

  // Claim Bonus
  const handleClaimBonus = async () => {
    try {
      const response = await axios.post("https://backend-project-invest.vercel.app/api/bonus/claim", {
        userId: user._id
      });

      Swal.fire({
        icon: "success",
        title: "সফল!",
        text: response.data.message || "বোনাস ক্লেইম হয়েছে!",
        timer: 2000,
        showConfirmButton: false,
      });

      await fetchData();
      refresh();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "ব্যর্থ!",
        text: err.response?.data?.message || "বোনাস ক্লেইম করতে ব্যর্থ হয়েছে",
      });
    }
  };

  // Claim Daily Income
  const handleClaimIncome = async (investmentId) => {
    // Prevent double claiming
    if (claiming[investmentId]) return;

    const investment = investments.find(inv => inv._id === investmentId);
    if (!investment) return;

    // Check if already claimed within 24 hours
    const remainingTime = timers[investmentId];
    if (remainingTime > 0) {
      Swal.fire({
        icon: "warning",
        title: "অপেক্ষা করুন!",
        text: "আপনি ইতিমধ্যে আজকের আয় ক্লেইম করেছেন। আরও অপেক্ষা করুন।",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      setClaiming(prev => ({ ...prev, [investmentId]: true }));

      const response = await axios.post(`https://backend-project-invest.vercel.app/api/investments/claim/${investmentId}`, {
        userId: user._id
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "আয় ক্লেইম করা হয়েছে!",
          text: `৳${response.data.claimedAmount || investment.dailyIncome} যোগ হয়েছে`,
          timer: 2000,
          showConfirmButton: false,
        });

        // Immediately set timer for 24 hours
        setTimers(prev => ({
          ...prev,
          [investmentId]: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
        }));

        // Refresh data from server
        await fetchData();
        refresh();
      }

    } catch (err) {
      console.error("Claim error:", err);
      Swal.fire({
        icon: "error",
        title: "ক্লেইম ব্যর্থ!",
        text: err.response?.data?.message || "আয় ক্লেইম করতে ব্যর্থ হয়েছে",
      });
    } finally {
      setClaiming(prev => ({ ...prev, [investmentId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-5 rounded-2xl shadow-lg mb-5">
        <h2 className="text-xl font-bold flex items-center gap-2">
          📦 আমার ইনভেস্টমেন্ট
        </h2>

        {/* Bonus Section */}
        <div className="mt-4 flex justify-between items-center bg-white/10 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <FaGift className="text-yellow-300" />
            <div>
              <p className="text-sm opacity-90">বোনাস স্ট্যাটাস</p>
              <p className="font-semibold">
                {bonus.claimed ? "✅ নেয়া হয়েছে" : "🎁 পাওয়া যাবে"}
              </p>
            </div>
          </div>
          {!bonus.claimed && (
            <button
              onClick={handleClaimBonus}
              className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition shadow-md"
            >
              বোনাস ক্লেইম করুন
            </button>
          )}
        </div>
      </div>

      {investments.length === 0 ? (
        <div className="text-center mt-20">
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">কোনো ইনভেস্টমেন্ট নেই</h2>
            <p className="text-gray-500 mb-6">ইনভেস্ট করে আয় শুরু করুন</p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
            >
              ইনভেস্ট করুন
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {investments.map((inv) => {
            const remainingTime = timers[inv._id] || 0;
            const canClaim = remainingTime === 0;
            const isClaiming = claiming[inv._id];

            return (
              <div key={inv._id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                {/* Investment Header */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{inv.productName}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <FaCalendarAlt className="text-green-500" />
                        {new Date(inv.startDate).toLocaleDateString("bn-BD")}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${inv.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                      }`}>
                      {inv.status === "active" ? "সক্রিয়" : "সমাপ্ত"}
                    </span>
                  </div>
                </div>

                {/* Investment Details */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">ইনভেস্টমেন্ট</p>
                      <p className="font-bold text-green-600 text-lg">৳{inv.amount?.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">দৈনিক আয়</p>
                      <p className="font-bold text-blue-600 text-lg">৳{inv.dailyIncome?.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">মোট আয়</p>
                      <p className="font-bold text-purple-600 text-lg">৳{inv.totalIncome?.toLocaleString()}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">বাকি দিন</p>
                      <p className="font-bold text-orange-600 text-lg">{inv.remainingDays} দিন</p>
                    </div>
                  </div>

                  {/* Last Claim Info */}
                  {inv.lastClaimDate && remainingTime > 0 && (
                    <div className="mb-3 text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-2">
                      শেষ ক্লেইম: {new Date(inv.lastClaimDate).toLocaleString("bn-BD")}
                    </div>
                  )}

                  {/* Claim Button */}
                  <button
                    onClick={() => handleClaimIncome(inv._id)}
                    disabled={!canClaim || isClaiming}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${canClaim && !isClaiming
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105 cursor-pointer"
                        : "bg-gray-400 text-gray-100 cursor-not-allowed"
                      }`}
                  >
                    {isClaiming ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        ক্লেইম হচ্ছে...
                      </>
                    ) : canClaim ? (
                      <>
                        <FaMoneyBillWave />
                        দৈনিক আয় ক্লেইম করুন
                      </>
                    ) : (
                      <>
                        <FaHourglassHalf />
                        {formatTime(remainingTime)}
                      </>
                    )}
                  </button>

                  {/* Details Button */}
                  <button
                    onClick={() => {
                      Swal.fire({
                        title: inv.productName,
                        html: `
                          <div class="text-left space-y-2">
                            <p><strong>💰 ইনভেস্টমেন্ট:</strong> ৳${inv.amount?.toLocaleString()}</p>
                            <p><strong>📈 দৈনিক আয়:</strong> ৳${inv.dailyIncome?.toLocaleString()}</p>
                            <p><strong>🎯 মোট আয়:</strong> ৳${inv.totalIncome?.toLocaleString()}</p>
                            <p><strong>⏳ বাকি দিন:</strong> ${inv.remainingDays} দিন</p>
                            <p><strong>📅 শুরু তারিখ:</strong> ${new Date(inv.startDate).toLocaleDateString("bn-BD")}</p>
                            ${inv.lastClaimDate ? `<p><strong>🕐 শেষ ক্লেইম:</strong> ${new Date(inv.lastClaimDate).toLocaleString("bn-BD")}</p>` : ''}
                            <p><strong>⏰ পরবর্তী ক্লেইম:</strong> ${inv.lastClaimDate ? new Date(new Date(inv.lastClaimDate).getTime() + 24 * 60 * 60 * 1000).toLocaleString("bn-BD") : 'এখনই করতে পারবেন'}</p>
                          </div>
                        `,
                        icon: "info",
                        confirmButtonText: "ঠিক আছে",
                        confirmButtonColor: "#10b981",
                      });
                    }}
                    className="w-full mt-2 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                  >
                    <FaClock className="inline mr-1" />
                    বিস্তারিত তথ্য
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyInvestments;
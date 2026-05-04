// SalaryBonus.jsx - Level Based Bonus System
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaTrophy, 
  FaMedal, 
  FaStar, 
  FaUsers, 
  FaGift, 
  FaCheckCircle, 
  FaClock, 
  FaSpinner,
  FaLeaf,
  FaTractor,
  FaSeedling,
  FaWallet,
  FaCrown,
  FaChartLine,
  FaUserFriends
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import Swal from "sweetalert2";
import axios from "axios";
import useUser from "../hooks/useUsers";

const SalaryBonus = () => {
  const navigate = useNavigate();
  const { user, refresh } = useUser();
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [bonusData, setBonusData] = useState({
    level1: {
      required: 30,
      current: 0,
      completed: false,
      bonusAmount: 200,
      lastClaimed: null,
      progress: 0
    },
    level2: {
      required: 60,
      current: 0,
      completed: false,
      bonusAmount: 200,
      lastClaimed: null,
      progress: 0
    },
    level3: {
      required: 120,
      current: 0,
      completed: false,
      bonusAmount: 200,
      lastClaimed: null,
      progress: 0
    }
  });
  const [totalEarned, setTotalEarned] = useState(0);
  const [lastClaimed, setLastClaimed] = useState(null);

const [hasLoaded, setHasLoaded] = useState(false);

useEffect(() => {
  if (user?._id && !hasLoaded) {
    loadBonusData();
    setHasLoaded(true);
  }
}, [user, hasLoaded]);

  const loadBonusData = async () => {
    try {
      setLoading(true);
      
      if (!user?._id) {
        return;
      }

      // সব ইউজার লোড
      const res = await axios.get("https://backend-project-invest.onrender.com/api/users/all");
      const allUsers = res.data?.users || [];
      const currentUser = allUsers.find(u => u._id === user._id);
      
      if (currentUser) {
        // Level 1: সরাসরি রেফারেল
        const level1Users = allUsers.filter(u => u.referredBy === currentUser.refCode);
        
        // Level 2: Level 1 এর রেফারেল
        const level2Users = allUsers.filter(u => level1Users.some(l1 => u.referredBy === l1.refCode));
        
        // Level 3: Level 2 এর রেফারেল
        const level3Users = allUsers.filter(u => level2Users.some(l2 => u.referredBy === l2.refCode));
        
        // চেক করা কোন লেভেল আগে ক্লেইম করা হয়েছে কিনা
        const claimedLevels = JSON.parse(localStorage.getItem(`bonus_claimed_${user._id}`)) || {
          level1: false,
          level2: false,
          level3: false
        };
        
        const lastClaim = localStorage.getItem(`bonus_last_claim_${user._id}`);
        
        setBonusData({
          level1: {
            required: 30,
            current: level1Users.length,
            completed: level1Users.length >= 30 && !claimedLevels.level1,
            alreadyClaimed: claimedLevels.level1,
            bonusAmount: 200,
            lastClaimed: claimedLevels.level1 ? lastClaim : null,
            progress: Math.min(100, (level1Users.length / 30) * 100)
          },
          level2: {
            required: 60,
            current: level2Users.length,
            completed: level2Users.length >= 60 && !claimedLevels.level2,
            alreadyClaimed: claimedLevels.level2,
            bonusAmount: 200,
            lastClaimed: claimedLevels.level2 ? lastClaim : null,
            progress: Math.min(100, (level2Users.length / 60) * 100)
          },
          level3: {
            required: 120,
            current: level3Users.length,
            completed: level3Users.length >= 120 && !claimedLevels.level3,
            alreadyClaimed: claimedLevels.level3,
            bonusAmount: 200,
            lastClaimed: claimedLevels.level3 ? lastClaim : null,
            progress: Math.min(100, (level3Users.length / 120) * 100)
          }
        });
        
        // মোট আয় ক্যালকুলেশন
        let totalBonus = 0;
        if (claimedLevels.level1) totalBonus += 200;
        if (claimedLevels.level2) totalBonus += 200;
        if (claimedLevels.level3) totalBonus += 200;
        setTotalEarned(totalBonus);
        setLastClaimed(lastClaim);
      }
    } catch (error) {
      console.error("Error loading bonus data:", error);
    } finally {
      setLoading(false);
    }
  };

  const claimBonus = async (level) => {
    const levelKey = `level${level}`;
    const levelData = bonusData[levelKey];
    
    if (levelData.alreadyClaimed) {
      Swal.fire({
        icon: "info",
        title: "ইতিমধ্যে ক্লেইম করা হয়েছে",
        text: `Level ${level} এর বোনাস আপনি ইতিমধ্যে ক্লেইম করেছেন।`,
        confirmButtonColor: "#16a34a"
      });
      return;
    }
    
    if (!levelData.completed) {
      const remaining = levelData.required - levelData.current;
      Swal.fire({
        icon: "warning",
        title: "শর্ত পূরণ হয়নি",
        text: `Level ${level} এর জন্য আরও ${remaining} জন রেফারেল প্রয়োজন।`,
        confirmButtonColor: "#f59e0b"
      });
      return;
    }
    
    const confirm = await Swal.fire({
      title: "বোনাস ক্লেইম করবেন?",
      html: `
        <div class="text-center">
          <div class="text-5xl mb-3">🎉</div>
          <p class="font-bold text-green-600">Level ${level} বোনাস</p>
          <p class="text-2xl font-bold text-green-700 mt-2">৳${levelData.bonusAmount}</p>
          <p class="text-sm text-gray-600 mt-2">${levelData.current}/${levelData.required} রেফারেল সম্পন্ন হয়েছে</p>
        </div>
      `,
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, ক্লেইম করুন",
      cancelButtonText: "পরে",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280"
    });
    
    if (!confirm.isConfirmed) return;
    
    setClaiming(true);
    
    try {
      // ব্যাকএন্ডে বোনাস ক্লেইম রেকুয়েস্ট
      const response = await axios.post("https://backend-project-invest.onrender.com/api/bonus/level-claim", {
        userId: user._id,
        level: level,
        amount: levelData.bonusAmount
      });
      
      if (response.data.success) {
        // লোকাল স্টোরেজে সেভ করা
        const claimedLevels = JSON.parse(localStorage.getItem(`bonus_claimed_${user._id}`)) || {
          level1: false,
          level2: false,
          level3: false
        };
        claimedLevels[levelKey] = true;
        localStorage.setItem(`bonus_claimed_${user._id}`, JSON.stringify(claimedLevels));
        localStorage.setItem(`bonus_last_claim_${user._id}`, new Date().toISOString());
        
        // স্টেট আপডেট
        setBonusData(prev => ({
          ...prev,
          [levelKey]: {
            ...prev[levelKey],
            completed: false,
            alreadyClaimed: true
          }
        }));
        setTotalEarned(prev => prev + levelData.bonusAmount);
        setLastClaimed(new Date().toISOString());
        
        // ইউজার ব্যালেন্স আপডেট
        refresh();
        
        Swal.fire({
          icon: "success",
          title: "অভিনন্দন! 🎉",
          html: `
            <div class="text-center">
              <div class="text-6xl mb-3">💰</div>
              <p class="font-bold text-green-600">Level ${level} বোনাস সফলভাবে ক্লেইম হয়েছে!</p>
              <p class="text-xl font-bold text-green-700 mt-2">+৳${levelData.bonusAmount}</p>
              <p class="text-sm text-gray-500 mt-2">আপনার ব্যালেন্সে যোগ করা হয়েছে</p>
            </div>
          `,
          confirmButtonColor: "#16a34a"
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ক্লেইম ব্যর্থ!",
        text: error.response?.data?.message || "বোনাস ক্লেইম করতে ব্যর্থ হয়েছে",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setClaiming(false);
    }
  };

  const levels = [
    {
      id: 1,
      name: "ব্রোঞ্জ",
      icon: FaMedal,
      color: "from-amber-600 to-orange-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      progressBg: "bg-amber-200",
      progressFill: "bg-amber-600"
    },
    {
      id: 2,
      name: "সিলভার",
      icon: FaStar,
      color: "from-gray-500 to-gray-600",
      bg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-700",
      progressBg: "bg-gray-200",
      progressFill: "bg-gray-600"
    },
    {
      id: 3,
      name: "গোল্ড",
      icon: FaCrown,
      color: "from-yellow-500 to-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      progressBg: "bg-yellow-200",
      progressFill: "bg-yellow-600"
    }
  ];

  const formatNumber = (num) => {
    if (!num && num !== 0) return "০";
    return new Intl.NumberFormat("bn-BD").format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-md mx-auto px-4 py-5">
        
        {/* হেডার */}
        <div className="flex items-center gap-3 mb-5">
          <button 
            onClick={() => navigate(-1)} 
            className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center active:bg-green-200 transition"
          >
            <FaArrowLeft className="text-green-700 text-sm" />
          </button>
          <div className="flex items-center gap-2">
            <FaTrophy className="text-yellow-500 text-lg" />
            <h1 className="text-lg font-bold text-green-800">লেভেল বোনাস</h1>
          </div>
          <FaGift className="text-green-600 ml-auto text-sm" />
        </div>

        {/* টোটাল আয় কার্ড */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 shadow-md mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs mb-0.5">মোট বোনাস আয়</p>
              <div className="flex items-center gap-1">
                <FaBangladeshiTakaSign className="text-white text-sm" />
                <p className="text-white font-bold text-2xl">{formatNumber(totalEarned)}</p>
              </div>
            </div>
            <div className="bg-white/20 p-2 rounded-xl">
              <FaWallet className="text-white text-xl" />
            </div>
          </div>
          {lastClaimed && (
            <p className="text-white/60 text-[10px] mt-2">
              সর্বশেষ ক্লেইম: {new Date(lastClaimed).toLocaleDateString("bn-BD")}
            </p>
          )}
        </div>

        {/* লেভেল কার্ড */}
        <div className="space-y-4">
          {levels.map((level) => {
            const levelData = bonusData[`level${level.id}`];
            const isCompleted = levelData.completed && !levelData.alreadyClaimed;
            const isClaimed = levelData.alreadyClaimed;
            const progress = levelData.progress;
            
            return (
              <div 
                key={level.id} 
                className={`bg-white rounded-xl shadow-md border ${level.border} overflow-hidden transition-all hover:shadow-lg`}
              >
                {/* হেডার */}
                <div className={`bg-gradient-to-r ${level.color} px-4 py-3 text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <level.icon className="text-xl" />
                      <div>
                        <p className="font-bold text-sm">Level {level.id}</p>
                        <p className="text-[10px] opacity-90">{level.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-80">বোনাস</p>
                      <p className="font-bold text-lg">৳{levelData.bonusAmount}</p>
                    </div>
                  </div>
                </div>
                
                {/* বডি */}
                <div className="p-4">
                  {/* প্রগ্রেস বার */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">রেফারেল প্রগ্রেস</span>
                      <span className={`font-semibold ${level.text}`}>
                        {levelData.current}/{levelData.required}
                      </span>
                    </div>
                    <div className={`w-full h-2.5 ${level.progressBg} rounded-full overflow-hidden`}>
                      <div 
                        className={`h-full ${level.progressFill} rounded-full transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-[9px] mt-1">
                      {progress === 100 ? "সব সম্পন্ন!" : `${Math.floor(progress)}% সম্পন্ন`}
                    </p>
                  </div>
                  
                  {/* স্ট্যাটাস */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-gray-400 text-xs" />
                      <span className="text-gray-500 text-xs">মোট রেফারেল</span>
                    </div>
                    {isClaimed ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs">
                        <FaCheckCircle size={12} />
                        ক্লেইম করা হয়েছে
                      </span>
                    ) : isCompleted ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs">
                        <FaGift size={12} />
                        বোনাস প্রস্তুত!
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 text-xs">
                        <FaClock size={12} />
                        {levelData.required - levelData.current} বাকি
                      </span>
                    )}
                  </div>
                  
                  {/* ক্লেইম বাটন */}
                  {!isClaimed && (
                    <button
                      onClick={() => claimBonus(level.id)}
                      disabled={!isCompleted || claiming}
                      className={`w-full py-2.5 rounded-lg font-semibold text-sm transition active:scale-95 flex items-center justify-center gap-2 ${
                        isCompleted
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-md"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {claiming ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          ক্লেইম হচ্ছে...
                        </>
                      ) : isCompleted ? (
                        <>
                          <FaGift size={14} />
                          বোনাস ক্লেইম করুন
                        </>
                      ) : (
                        <>
                          <FaClock size={14} />
                          {levelData.required - levelData.current} জন বাকি
                        </>
                      )}
                    </button>
                  )}
                  
                  {/* ক্লেইম করা হলে তথ্য */}
                  {isClaimed && (
                    <div className="text-center pt-2">
                      <p className="text-green-600 text-xs flex items-center justify-center gap-1">
                        <FaCheckCircle size={12} />
                        বোনাস ক্লেইম করা হয়েছে
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* নির্দেশিকা */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mt-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaTrophy className="text-blue-600 text-sm" />
            </div>
            <div>
              <h3 className="text-blue-800 font-semibold text-sm mb-1">বোনাস নির্দেশিকা</h3>
              <ul className="text-blue-700 text-[10px] space-y-1">
                <li>✓ Level 1: 30 জন ডাইরেক্ট রেফারেল হলে ৳200 বোনাস</li>
                <li>✓ Level 2: 60 জন সেকেন্ড লেভেল রেফারেল হলে ৳200 বোনাস</li>
                <li>✓ Level 3: 120 জন থার্ড লেভেল রেফারেল হলে ৳200 বোনাস</li>
                <li>✓ প্রতিটি লেভেল একবারই ক্লেইম করা যাবে</li>
                <li>✓ বোনাস সরাসরি আপনার ব্যালেন্সে যোগ হবে</li>
              </ul>
            </div>
          </div>
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

export default SalaryBonus;
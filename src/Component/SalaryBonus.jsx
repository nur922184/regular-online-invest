// SalaryBonus.jsx - আপডেটেড (শুধু ডিপোজিট থাকলেই রেফারেল গণ্য হবে)

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
  FaUserFriends,
  FaGem,
  FaMoneyBillWave
} from "react-icons/fa";
import { FaBangladeshiTakaSign, FaDiamond } from "react-icons/fa6";
import Swal from "sweetalert2";
import axios from "axios";
import useUser from "../hooks/useUsers";

const SalaryBonus = () => {
  const navigate = useNavigate();
  const { user, refresh } = useUser();
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimingLevel, setClaimingLevel] = useState(null);
  const [bonusData, setBonusData] = useState({
    level1: {
      required: 10,
      current: 0,
      completed: false,
      alreadyClaimed: false,
      bonusAmount: 250,
      cooldownDays: 7,
      lastClaimed: null,
      nextAvailable: null,
      progress: 0
    },
    level2: {
      required: 30,
      current: 0,
      completed: false,
      alreadyClaimed: false,
      bonusAmount: 800,
      cooldownDays: 15,
      lastClaimed: null,
      nextAvailable: null,
      progress: 0
    },
    level3: {
      required: 50,
      current: 0,
      completed: false,
      alreadyClaimed: false,
      bonusAmount: 1500,
      cooldownDays: 30,
      lastClaimed: null,
      nextAvailable: null,
      progress: 0
    },
    level4: {
      required: 100,
      current: 0,
      completed: false,
      alreadyClaimed: false,
      bonusAmount: 4000,
      cooldownDays: 30,
      lastClaimed: null,
      nextAvailable: null,
      progress: 0
    },
    level5: {
      required: 200,
      current: 0,
      completed: false,
      alreadyClaimed: false,
      bonusAmount: 10000,
      cooldownDays: 30,
      lastClaimed: null,
      nextAvailable: null,
      progress: 0
    }
  });
  const [totalEarned, setTotalEarned] = useState(0);
  const [depositOnlyUsers, setDepositOnlyUsers] = useState(new Map()); // ইউজারের ডিপোজিট স্ট্যাটাস সংরক্ষণের জন্য
  const [hasLoaded, setHasLoaded] = useState(false);

  // ইউজারের ডিপোজিট চেক করার ফাংশন (ক্যাশিং সহ)
  const getUserDepositStatus = async (userId) => {
    if (depositOnlyUsers.has(userId)) {
      return depositOnlyUsers.get(userId);
    }
    
    try {
      const txRes = await axios.get(`https://investify-backend.vercel.app/api/transactions/user/${userId}`);
      const transactions = txRes.data?.transactions || [];
      const hasApprovedDeposit = transactions.some(t => t.status === "approved");
      
      setDepositOnlyUsers(prev => new Map(prev).set(userId, hasApprovedDeposit));
      return hasApprovedDeposit;
    } catch (error) {
      console.error("Error checking deposit:", error);
      return false;
    }
  };

  // শুধুমাত্র ডিপোজিট থাকা ইউজারদের ফিল্টার করার ফাংশন
  const filterUsersWithDeposits = async (users) => {
    const depositPromises = users.map(async (u) => {
      const hasDeposit = await getUserDepositStatus(u._id);
      return hasDeposit ? u : null;
    });
    
    const results = await Promise.all(depositPromises);
    return results.filter(u => u !== null);
  };

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
      const res = await axios.get("https://investify-backend.vercel.app/api/users/all");
      const allUsers = res.data?.users || [];
      const currentUser = allUsers.find(u => u._id === user._id);
      
      if (currentUser) {
        // শুধুমাত্র ডিপোজিট থাকা ইউজারদের ফিল্টার করে রেফারেল চেইন তৈরি
        
        // Level 1: ডাইরেক্ট রেফারেল (যাদের ডিপোজিট আছে)
        const allLevel1Users = allUsers.filter(u => u.referredBy === currentUser.refCode);
        const level1UsersWithDeposits = await filterUsersWithDeposits(allLevel1Users);
        
        // Level 2: Level 1 এর রেফারেল (শুধু যাদের ডিপোজিট আছে)
        const allLevel2Users = allUsers.filter(u => level1UsersWithDeposits.some(l1 => u.referredBy === l1.refCode));
        const level2UsersWithDeposits = await filterUsersWithDeposits(allLevel2Users);
        
        // Level 3: Level 2 এর রেফারেল (শুধু যাদের ডিপোজিট আছে)
        const allLevel3Users = allUsers.filter(u => level2UsersWithDeposits.some(l2 => u.referredBy === l2.refCode));
        const level3UsersWithDeposits = await filterUsersWithDeposits(allLevel3Users);
        
        // Level 4: Level 3 এর রেফারেল (শুধু যাদের ডিপোজিট আছে)
        const allLevel4Users = allUsers.filter(u => level3UsersWithDeposits.some(l3 => u.referredBy === l3.refCode));
        const level4UsersWithDeposits = await filterUsersWithDeposits(allLevel4Users);
        
        // Level 5: Level 4 এর রেফারেল (শুধু যাদের ডিপোজিট আছে)
        const allLevel5Users = allUsers.filter(u => level4UsersWithDeposits.some(l4 => u.referredBy === l4.refCode));
        const level5UsersWithDeposits = await filterUsersWithDeposits(allLevel5Users);
        
        // চেক করা কোন লেভেল আগে ক্লেইম করা হয়েছে কিনা
        const claimedLevels = JSON.parse(localStorage.getItem(`bonus_claimed_${user._id}`)) || {
          level1: false,
          level2: false,
          level3: false,
          level4: false,
          level5: false
        };
        
        const lastClaimTimes = JSON.parse(localStorage.getItem(`bonus_last_claim_times_${user._id}`)) || {
          level1: null,
          level2: null,
          level3: null,
          level4: null,
          level5: null
        };
        
        // Calculate next available time for each level
        const getNextAvailable = (lastClaimed, cooldownDays) => {
          if (!lastClaimed) return null;
          const lastDate = new Date(lastClaimed);
          const nextDate = new Date(lastDate);
          nextDate.setDate(lastDate.getDate() + cooldownDays);
          return nextDate;
        };
        
        // Check if level is available
        const isLevelAvailable = (levelKey, lastClaimed, cooldownDays) => {
          if (!claimedLevels[levelKey]) return true;
          if (!lastClaimed) return false;
          const lastDate = new Date(lastClaimed);
          const nextDate = new Date(lastDate);
          nextDate.setDate(lastDate.getDate() + cooldownDays);
          return new Date() >= nextDate;
        };
        
        const level1NextAvailable = getNextAvailable(lastClaimTimes.level1, 7);
        const level2NextAvailable = getNextAvailable(lastClaimTimes.level2, 15);
        const level3NextAvailable = getNextAvailable(lastClaimTimes.level3, 30);
        const level4NextAvailable = getNextAvailable(lastClaimTimes.level4, 30);
        const level5NextAvailable = getNextAvailable(lastClaimTimes.level5, 30);
        
        setBonusData({
          level1: {
            required: 10,
            current: level1UsersWithDeposits.length,
            completed: level1UsersWithDeposits.length >= 10,
            alreadyClaimed: claimedLevels.level1,
            bonusAmount: 250,
            cooldownDays: 7,
            lastClaimed: lastClaimTimes.level1,
            nextAvailable: level1NextAvailable,
            availableToClaim: isLevelAvailable('level1', lastClaimTimes.level1, 7),
            progress: Math.min(100, (level1UsersWithDeposits.length / 10) * 100)
          },
          level2: {
            required: 30,
            current: level2UsersWithDeposits.length,
            completed: level2UsersWithDeposits.length >= 30,
            alreadyClaimed: claimedLevels.level2,
            bonusAmount: 800,
            cooldownDays: 15,
            lastClaimed: lastClaimTimes.level2,
            nextAvailable: level2NextAvailable,
            availableToClaim: isLevelAvailable('level2', lastClaimTimes.level2, 15),
            progress: Math.min(100, (level2UsersWithDeposits.length / 30) * 100)
          },
          level3: {
            required: 50,
            current: level3UsersWithDeposits.length,
            completed: level3UsersWithDeposits.length >= 50,
            alreadyClaimed: claimedLevels.level3,
            bonusAmount: 1500,
            cooldownDays: 30,
            lastClaimed: lastClaimTimes.level3,
            nextAvailable: level3NextAvailable,
            availableToClaim: isLevelAvailable('level3', lastClaimTimes.level3, 30),
            progress: Math.min(100, (level3UsersWithDeposits.length / 50) * 100)
          },
          level4: {
            required: 100,
            current: level4UsersWithDeposits.length,
            completed: level4UsersWithDeposits.length >= 100,
            alreadyClaimed: claimedLevels.level4,
            bonusAmount: 4000,
            cooldownDays: 30,
            lastClaimed: lastClaimTimes.level4,
            nextAvailable: level4NextAvailable,
            availableToClaim: isLevelAvailable('level4', lastClaimTimes.level4, 30),
            progress: Math.min(100, (level4UsersWithDeposits.length / 100) * 100)
          },
          level5: {
            required: 200,
            current: level5UsersWithDeposits.length,
            completed: level5UsersWithDeposits.length >= 200,
            alreadyClaimed: claimedLevels.level5,
            bonusAmount: 10000,
            cooldownDays: 30,
            lastClaimed: lastClaimTimes.level5,
            nextAvailable: level5NextAvailable,
            availableToClaim: isLevelAvailable('level5', lastClaimTimes.level5, 30),
            progress: Math.min(100, (level5UsersWithDeposits.length / 200) * 100)
          }
        });
        
        // মোট আয় ক্যালকুলেশন
        let totalBonus = 0;
        if (claimedLevels.level1 && lastClaimTimes.level1) totalBonus += 250;
        if (claimedLevels.level2 && lastClaimTimes.level2) totalBonus += 800;
        if (claimedLevels.level3 && lastClaimTimes.level3) totalBonus += 1500;
        if (claimedLevels.level4 && lastClaimTimes.level4) totalBonus += 4000;
        if (claimedLevels.level5 && lastClaimTimes.level5) totalBonus += 10000;
        setTotalEarned(totalBonus);
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
    
    // Check if already claimed and cooldown not passed
    if (levelData.alreadyClaimed && !levelData.availableToClaim) {
      const daysRemaining = Math.ceil((levelData.nextAvailable - new Date()) / (1000 * 60 * 60 * 24));
      Swal.fire({
        icon: "info",
        title: "কুলডাউন পিরিয়ড চলছে",
        text: `Level ${level} এর বোনাস আপনি ইতিমধ্যে ক্লেইম করেছেন। পরবর্তী ক্লেইম করতে ${daysRemaining} দিন অপেক্ষা করতে হবে।`,
        confirmButtonColor: "#16a34a"
      });
      return;
    }
    
    if (!levelData.completed) {
      const remaining = levelData.required - levelData.current;
      Swal.fire({
        icon: "warning",
        title: "শর্ত পূরণ হয়নি",
        html: `
          <div class="text-center">
            <p>Level ${level} এর জন্য আরও <span class="font-bold text-orange-600">${remaining}</span> জন ডিপোজিট সম্পন্ন রেফারেল প্রয়োজন।</p>
            <p class="text-sm text-gray-500 mt-2">বর্তমানে: ${levelData.current}/${levelData.required}</p>
            <p class="text-xs text-blue-500 mt-3">💡 শুধুমাত্র যারা ডিপোজিট করেছেন তারাই রেফারেল হিসেবে গণ্য হবেন।</p>
          </div>
        `,
        confirmButtonColor: "#f59e0b"
      });
      return;
    }
    
    let message = "";
    if (levelData.alreadyClaimed && levelData.availableToClaim) {
      message = "আপনি এই লেভেলের বোনাস পুনরায় ক্লেইম করতে পারবেন।";
    } else if (!levelData.alreadyClaimed) {
      message = "এটি আপনার প্রথম বার এই লেভেলের বোনাস ক্লেইম করছেন।";
    }
    
    const confirm = await Swal.fire({
      title: "বোনাস ক্লেইম করবেন?",
      html: `
        <div class="text-center">
          <div class="text-5xl mb-3">🎉</div>
          <p class="font-bold text-green-600">Level ${level} বোনাস</p>
          <p class="text-2xl font-bold text-green-700 mt-2">৳${levelData.bonusAmount.toLocaleString()}</p>
          <p class="text-sm text-gray-600 mt-2">${levelData.current}/${levelData.required} ডিপোজিট সম্পন্ন রেফারেল</p>
          <p class="text-xs text-blue-600 mt-2">🏆 কুলডাউন: ${levelData.cooldownDays} দিন</p>
          <p class="text-xs text-gray-500 mt-1">${message}</p>
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
    setClaimingLevel(level);
    
    try {
      const response = await axios.post("https://investify-backend.vercel.app/api/bonus/level-claim", {
        userId: user._id,
        level: level,
        amount: levelData.bonusAmount,
        cooldownDays: levelData.cooldownDays
      });
      
      if (response.data.success) {
        const claimedLevels = JSON.parse(localStorage.getItem(`bonus_claimed_${user._id}`)) || {
          level1: false,
          level2: false,
          level3: false,
          level4: false,
          level5: false
        };
        const lastClaimTimes = JSON.parse(localStorage.getItem(`bonus_last_claim_times_${user._id}`)) || {
          level1: null,
          level2: null,
          level3: null,
          level4: null,
          level5: null
        };
        
        claimedLevels[levelKey] = true;
        lastClaimTimes[levelKey] = new Date().toISOString();
        
        localStorage.setItem(`bonus_claimed_${user._id}`, JSON.stringify(claimedLevels));
        localStorage.setItem(`bonus_last_claim_times_${user._id}`, JSON.stringify(lastClaimTimes));
        
        const nextAvailable = new Date();
        nextAvailable.setDate(nextAvailable.getDate() + levelData.cooldownDays);
        
        setBonusData(prev => ({
          ...prev,
          [levelKey]: {
            ...prev[levelKey],
            alreadyClaimed: true,
            lastClaimed: new Date().toISOString(),
            nextAvailable: nextAvailable,
            availableToClaim: false
          }
        }));
        setTotalEarned(prev => prev + levelData.bonusAmount);
        
        refresh();
        
        Swal.fire({
          icon: "success",
          title: "অভিনন্দন! 🎉",
          html: `
            <div class="text-center">
              <div class="text-6xl mb-3">💰</div>
              <p class="font-bold text-green-600">Level ${level} বোনাস সফলভাবে ক্লেইম হয়েছে!</p>
              <p class="text-xl font-bold text-green-700 mt-2">+৳${levelData.bonusAmount.toLocaleString()}</p>
              <p class="text-sm text-gray-500 mt-2">আপনার ব্যালেন্সে যোগ করা হয়েছে</p>
              <p class="text-xs text-blue-500 mt-3">পরবর্তী ক্লেইম: ${nextAvailable.toLocaleDateString("bn-BD")}</p>
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
      setClaimingLevel(null);
    }
  };

  const levels = [
    { id: 1, name: "ব্রোঞ্জ", icon: FaMedal, color: "from-amber-600 to-orange-600", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", progressBg: "bg-amber-200", progressFill: "bg-amber-600", badgeColor: "bg-amber-100 text-amber-700" },
    { id: 2, name: "সিলভার", icon: FaStar, color: "from-gray-500 to-gray-600", bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", progressBg: "bg-gray-200", progressFill: "bg-gray-600", badgeColor: "bg-gray-100 text-gray-700" },
    { id: 3, name: "গোল্ড", icon: FaCrown, color: "from-yellow-500 to-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", progressBg: "bg-yellow-200", progressFill: "bg-yellow-600", badgeColor: "bg-yellow-100 text-yellow-700" },
    { id: 4, name: "প্লাটিনাম", icon: FaGem, color: "from-cyan-500 to-blue-600", bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700", progressBg: "bg-cyan-200", progressFill: "bg-cyan-600", badgeColor: "bg-cyan-100 text-cyan-700" },
    { id: 5, name: "ডায়মন্ড", icon: FaDiamond, color: "from-purple-500 to-purple-700", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", progressBg: "bg-purple-200", progressFill: "bg-purple-600", badgeColor: "bg-purple-100 text-purple-700" }
  ];

  const formatNumber = (num) => {
    if (!num && num !== 0) return "০";
    return new Intl.NumberFormat("bn-BD").format(num);
  };

  const getRemainingDays = (nextAvailable) => {
    if (!nextAvailable) return null;
    const remaining = Math.ceil((new Date(nextAvailable) - new Date()) / (1000 * 60 * 60 * 24));
    return remaining > 0 ? remaining : 0;
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
        
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(-1)} className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center active:bg-green-200 transition">
            <FaArrowLeft className="text-green-700 text-sm" />
          </button>
          <div className="flex items-center gap-2">
            <FaTrophy className="text-yellow-500 text-lg" />
            <h1 className="text-lg font-bold text-green-800">সেলারি বোনাস</h1>
          </div>
          <div className="flex items-center gap-1 ml-auto bg-blue-100 px-2 py-1 rounded-lg">
            <FaMoneyBillWave className="text-blue-600 text-xs" />
            <span className="text-blue-700 text-[10px] font-semibold">ডিপোজিট ভিত্তিক</span>
          </div>
        </div>

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
        </div>

        {/* ইনফো ব্যাজ */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3 mb-4 border border-blue-100">
          <div className="flex items-center gap-2">
            <FaMoneyBillWave className="text-blue-500 text-sm" />
            <p className="text-blue-700 text-xs">
              <span className="font-semibold">শুধুমাত্র ডিপোজিট সম্পন্ন ইউজার</span> রেফারেল হিসেবে গণ্য হবে। 
              রেজিস্ট্রেশন করলেই হবে না, ডিপোজিট করতে হবে।
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {levels.map((level) => {
            const levelData = bonusData[`level${level.id}`];
            const canClaim = levelData.completed && (levelData.availableToClaim || !levelData.alreadyClaimed);
            const isClaimingNow = claiming && claimingLevel === level.id;
            const remainingDays = getRemainingDays(levelData.nextAvailable);
            const showCooldown = levelData.alreadyClaimed && !levelData.availableToClaim && remainingDays > 0;
            
            return (
              <div key={level.id} className={`bg-white rounded-xl shadow-md border ${level.border} overflow-hidden transition-all hover:shadow-lg`}>
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
                      <p className="font-bold text-lg">৳{levelData.bonusAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">ডিপোজিট সম্পন্ন রেফারেল</span>
                      <span className={`font-semibold ${level.text}`}>
                        {levelData.current}/{levelData.required}
                      </span>
                    </div>
                    <div className={`w-full h-2.5 ${level.progressBg} rounded-full overflow-hidden`}>
                      <div className={`h-full ${level.progressFill} rounded-full transition-all duration-500`} style={{ width: `${levelData.progress}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-gray-400 text-xs" />
                      <span className="text-gray-500 text-xs">ডিপোজিটর রেফারেল</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {showCooldown ? (
                        <span className={`${level.badgeColor} text-xs px-2 py-0.5 rounded-full flex items-center gap-1`}>
                          <FaClock size={10} />
                          {remainingDays} দিন বাকি
                        </span>
                      ) : levelData.completed ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs">
                          <FaGift size={12} />
                          বোনাস প্রস্তুত!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400 text-xs">
                          <FaMoneyBillWave size={10} />
                          {levelData.required - levelData.current} ডিপোজিট বাকি
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => claimBonus(level.id)}
                    disabled={!canClaim || claiming}
                    className={`w-full py-2.5 rounded-lg font-semibold text-sm transition active:scale-95 flex items-center justify-center gap-2 ${
                      canClaim && !isClaimingNow
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-md"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isClaimingNow ? (
                      <><FaSpinner className="animate-spin" /> ক্লেইম হচ্ছে...</>
                    ) : showCooldown ? (
                      <><FaClock size={14} /> {remainingDays} দিন পর ক্লেইম করুন</>
                    ) : levelData.completed ? (
                      <><FaGift size={14} /> বোনাস ক্লেইম করুন</>
                    ) : (
                      <><FaMoneyBillWave size={14} /> {levelData.required - levelData.current} জন ডিপোজিট বাকি</>
                    )}
                  </button>
                  
                  {levelData.alreadyClaimed && levelData.lastClaimed && (
                    <div className="text-center pt-2">
                      <p className="text-gray-400 text-[9px] flex items-center justify-center gap-1">
                        <FaCheckCircle size={10} className="text-green-500" />
                        শেষ ক্লেইম: {new Date(levelData.lastClaimed).toLocaleDateString("bn-BD")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mt-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaTrophy className="text-blue-600 text-sm" />
            </div>
            <div>
              <h3 className="text-blue-800 font-semibold text-sm mb-1">সেলারি বোনাস নির্দেশিকা</h3>
              <ul className="text-blue-700 text-[10px] space-y-1">
                <li>✓ <span className="font-semibold">Level 1:</span> ১০ জন ডাইরেক্ট (ডিপোজিটর) → ৳২৫০ </li>
                <li>✓ <span className="font-semibold">Level 2:</span> ৩০ জন সেকেন্ড লেভেল (ডিপোজিটর) → ৳৮০০ </li>
                <li>✓ <span className="font-semibold">Level 3:</span> ৫০ জন থার্ড লেভেল (ডিপোজিটর) → ৳১৫০০ </li>
                <li>✓ <span className="font-semibold">Level 4:</span> ১০০ জন ফোর্থ লেভেল (ডিপোজিটর) → ৳৪০০০ </li>
                <li>✓ <span className="font-semibold">Level 5:</span> ২০০ জন ফিফথ লেভেল (ডিপোজিটর) → ৳১০০০০</li>
                <li>✓ <span className="font-semibold text-orange-600">গুরুত্বপূর্ণ:</span> শুধুমাত্র যারা ডিপোজিট করেছেন তারাই রেফারেল হিসেবে গণ্য হবেন</li>
                <li>✓ প্রতিটি লেভেল নির্ধারিত সময় পরপর ক্লেইম করা যাবে</li>
              </ul>
            </div>
          </div>
        </div>

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
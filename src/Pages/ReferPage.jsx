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
  FaCheckCircle,
  FaGift,
  FaArrowLeft,
  FaUsers,
  FaMoneyBillWave,
  FaRocket,
  FaTrophy,
  FaLink,
  FaRegCopy,
  FaWallet,
  FaUserCircle
} from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const ReferPage = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [referralStats, setReferralStats] = useState({
    level1Count: 0,
    level2Count: 0,
    level3Count: 0,
    level1Earnings: 0,
    level2Earnings: 0,
    level3Earnings: 0,
    totalEarnings: 0,
    refCode: "",
    name: "",
    phone: "",
    balance: 0,
    referredUsers: []
  });

  // Get current logged in user ID from localStorage
  const getCurrentUserId = () => {
    // Try to get userId from different possible storage keys
    const userId = localStorage.getItem("userId") || 
                   localStorage.getItem("user_id") || 
                   localStorage.getItem("currentUserId");
    
    // Also check if user object exists
    const userObj = JSON.parse(localStorage.getItem("user"));
    
    if (userId) return userId;
    if (userObj && userObj._id) return userObj._id;
    if (userObj && userObj.id) return userObj.id;
    
    return null;
  };

  // Fetch all users from API
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get("https://backend-project-invest.vercel.app/api/users/all");
      if (response.data && response.data.users) {
        setAllUsers(response.data.users);
        return response.data.users;
      }
      return [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  // Calculate referral tree for a user
  const calculateReferralTree = (users, currentUserRefCode) => {
    // Find direct referrals (Level 1)
    const level1Users = users.filter(u => u.referredBy === currentUserRefCode);
    
    // Find Level 2 referrals (referrals of level 1 users)
    let level2Users = [];
    level1Users.forEach(l1User => {
      const l2 = users.filter(u => u.referredBy === l1User.refCode);
      level2Users = [...level2Users, ...l2];
    });
    
    // Find Level 3 referrals (referrals of level 2 users)
    let level3Users = [];
    level2Users.forEach(l2User => {
      const l3 = users.filter(u => u.referredBy === l2User.refCode);
      level3Users = [...level3Users, ...l3];
    });
    
    // Calculate earnings
    const level1Earnings = level1Users.length * 250; // 250 Taka per direct referral
    const level2Earnings = level2Users.length * 30;  // 30 Taka per level 2 referral
    const level3Earnings = level3Users.length * 20;  // 20 Taka per level 3 referral
    const totalEarnings = level1Earnings + level2Earnings + level3Earnings;
    
    return {
      level1Users,
      level2Users,
      level3Users,
      level1Count: level1Users.length,
      level2Count: level2Users.length,
      level3Count: level3Users.length,
      level1Earnings,
      level2Earnings,
      level3Earnings,
      totalEarnings
    };
  };

  // Load current logged in user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // Get current logged in user ID
        const currentUserId = getCurrentUserId();
        
        if (!currentUserId) {
          // No user logged in, redirect to login
          Swal.fire({
            icon: 'warning',
            title: 'লগইন প্রয়োজন',
            text: 'দয়া করে প্রথমে লগইন করুন',
            confirmButtonColor: '#10b981'
          }).then(() => {
            navigate('/login');
          });
          setLoading(false);
          return;
        }
        
        // Fetch all users from API
        const users = await fetchAllUsers();
        
        // Find the current logged in user from the users list
        const loggedInUser = users.find(u => u._id === currentUserId);
        
        if (loggedInUser) {
          // Calculate referral tree for this user
          const referralTree = calculateReferralTree(users, loggedInUser.refCode);
          
          setCurrentUser(loggedInUser);
          setReferralStats({
            level1Count: referralTree.level1Count,
            level2Count: referralTree.level2Count,
            level3Count: referralTree.level3Count,
            level1Earnings: referralTree.level1Earnings,
            level2Earnings: referralTree.level2Earnings,
            level3Earnings: referralTree.level3Earnings,
            totalEarnings: referralTree.totalEarnings,
            refCode: loggedInUser.refCode,
            name: loggedInUser.name,
            phone: loggedInUser.phone,
            balance: loggedInUser.balance || 0,
            referredUsers: referralTree.level1Users
          });
        } else {
          // Try to get user from localStorage as fallback
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (storedUser && storedUser._id === currentUserId) {
            setCurrentUser(storedUser);
            setReferralStats({
              level1Count: storedUser.level1Count || 0,
              level2Count: storedUser.level2Count || 0,
              level3Count: storedUser.level3Count || 0,
              level1Earnings: storedUser.level1Earnings || 0,
              level2Earnings: storedUser.level2Earnings || 0,
              level3Earnings: storedUser.level3Earnings || 0,
              totalEarnings: storedUser.totalEarnings || 0,
              refCode: storedUser.refCode || "N/A",
              name: storedUser.name || storedUser.fullName,
              phone: storedUser.phone || "",
              balance: storedUser.balance || 0,
              referredUsers: []
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ইউজার পাওয়া যায়নি',
              text: 'আপনার তথ্য লোড করতে সমস্যা হয়েছে',
              confirmButtonColor: '#ef4444'
            });
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        Swal.fire({
          icon: 'error',
          title: 'ডাটা লোড করতে সমস্যা',
          text: 'আবার চেষ্টা করুন',
          confirmButtonColor: '#ef4444'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [navigate]);
  
  // Referral Link
  const referLink = `${window.location.origin}/signup?ref=${referralStats.refCode}`;
  
  // Copy function
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      await Swal.fire({
        icon: 'success',
        title: 'কপি হয়েছে!',
        text: `${type} সফলভাবে কপি করা হয়েছে`,
        timer: 1500,
        showConfirmButton: false,
        background: '#fff',
        iconColor: '#10b981'
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'কপি করতে পারেনি',
        text: 'আবার চেষ্টা করুন',
        confirmButtonColor: '#ef4444'
      });
    }
  };
  
  // Share function
  const shareVia = (platform) => {
    const shareText = `আমার সাথে যোগ দিন ${referralStats.name}! আমার রেফারেল কোড ব্যবহার করুন: ${referralStats.refCode}\n\nএখানে সাইনআপ করুন: ${referLink}`;
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referLink)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=AgroFund BD তে যোগ দিন&body=${encodeURIComponent(shareText)}`;
        break;
      default:
        break;
    }
  };
  
  // Commission levels
  const levels = [
    { 
      level: 1, 
      percentage: 25, 
      color: "from-purple-500 to-pink-500", 
      icon: FaCrown, 
      count: referralStats.level1Count, 
      earnings: referralStats.level1Earnings,
      description: "ডাইরেক্ট রেফারেল",
      commissionPerReferral: 250
    },
    { 
      level: 2, 
      percentage: 3, 
      color: "from-blue-500 to-cyan-500", 
      icon: FaStar, 
      count: referralStats.level2Count, 
      earnings: referralStats.level2Earnings,
      description: "আপনার রেফারেলের রেফারেল",
      commissionPerReferral: 30
    },
    { 
      level: 3, 
      percentage: 2, 
      color: "from-green-500 to-emerald-500", 
      icon: FaChartLine, 
      count: referralStats.level3Count, 
      earnings: referralStats.level3Earnings,
      description: "সেকেন্ড লেভেলের রেফারেল",
      commissionPerReferral: 20
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/profile')}
          className="mb-4 sm:mb-6 flex items-center gap-2 text-teal-600 hover:text-teal-700 transition group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition" />
          <span>প্রোফাইলে ফিরে যান</span>
        </button>
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block bg-gradient-to-r from-teal-600 to-blue-600 p-3 sm:p-4 rounded-2xl shadow-lg mb-3 sm:mb-4">
            <FaUserFriends className="text-3xl sm:text-4xl text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            বন্ধুদের আমন্ত্রণ জানান
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            আপনার রেফারেল কোড শেয়ার করুন এবং আয় করুন
          </p>
        </div>
        
        {/* User Info Card */}
        {currentUser && (
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                <FaUserCircle className="text-4xl sm:text-5xl text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">{referralStats.name}</h3>
                <p className="text-sm text-gray-500">{referralStats.phone}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <FaWallet className="text-teal-600 text-sm" />
                  <span className="text-sm text-gray-600">বর্তমান ব্যালেন্স: ৳{referralStats.balance.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <div className="bg-teal-50 px-3 py-1 rounded-full">
                  <p className="text-xs text-teal-600">রেফারেল কোড</p>
                  <p className="font-mono font-bold text-teal-700">{referralStats.refCode}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Earnings Card */}
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl shadow-xl p-5 sm:p-6 text-white transform hover:scale-105 transition duration-300">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div>
                <p className="text-xs sm:text-sm opacity-90">মোট আয়</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1">৳{referralStats.totalEarnings.toLocaleString()}</p>
              </div>
              <FaMoneyBillWave className="text-3xl sm:text-4xl opacity-80" />
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <FaUsers className="text-teal-200" />
              <span>{referralStats.level1Count + referralStats.level2Count + referralStats.level3Count} জন মোট রেফারেল</span>
            </div>
          </div>
          
          {/* Total Referrals Card */}
          <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 hover:shadow-2xl transition">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">মোট রেফারেল</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mt-1">
                  {referralStats.level1Count + referralStats.level2Count + referralStats.level3Count}
                </p>
              </div>
              <FaUsers className="text-3xl sm:text-4xl text-teal-500" />
            </div>
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
              <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full">Level 1: {referralStats.level1Count}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full">Level 2: {referralStats.level2Count}</span>
              <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full">Level 3: {referralStats.level3Count}</span>
            </div>
          </div>
          
          {/* Direct Referral Bonus Card */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-xl p-5 sm:p-6 text-white transform hover:scale-105 transition duration-300">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div>
                <p className="text-xs sm:text-sm opacity-90">ডাইরেক্ট রেফারেল বোনাস</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1">৳{referralStats.level1Earnings.toLocaleString()}</p>
              </div>
              <FaGift className="text-3xl sm:text-4xl opacity-80" />
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <FaUsers className="text-amber-200" />
              <span>{referralStats.level1Count} জন ডাইরেক্ট রেফারেল</span>
            </div>
          </div>
        </div>
        
        {/* Level Cards */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaTrophy className="text-teal-600" />
            কমিশন স্ট্রাকচার
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {levels.map((level, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`bg-gradient-to-r ${level.color} p-4 sm:p-5 text-white`}>
                  <div className="flex justify-between items-center">
                    <level.icon className="text-2xl sm:text-3xl" />
                    <span className="text-2xl sm:text-3xl font-bold">{level.percentage}%</span>
                  </div>
                  <p className="text-sm sm:text-base font-semibold mt-2">Level {level.level}</p>
                  <p className="text-xs opacity-90">{level.description}</p>
                </div>
                <div className="p-4 sm:p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm sm:text-base text-gray-600">সদস্য:</span>
                    <span className="font-bold text-gray-800 text-sm sm:text-base">{level.count} জন</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm sm:text-base text-gray-600">প্রতি রেফারেল:</span>
                    <span className="font-bold text-green-600 text-sm sm:text-base">৳{level.commissionPerReferral}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-sm sm:text-base text-gray-600">মোট আয়:</span>
                    <span className="font-bold text-teal-600 text-base sm:text-lg">৳{level.earnings.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Referral Link Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaLink className="text-teal-600" />
              আপনার রেফারেল লিংক
            </h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={referLink}
                readOnly
                className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={() => copyToClipboard(referLink, "লিংক")}
                className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <FaCopy />
                <span>কপি করুন</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Share Options */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaShare className="text-teal-600" />
              শেয়ার করুন
            </h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <button
                onClick={() => shareVia('whatsapp')}
                className="flex items-center justify-center gap-2 sm:gap-3 bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition transform hover:scale-105"
              >
                <FaWhatsapp className="text-lg sm:text-xl" />
                <span className="text-sm sm:text-base">হোয়াটসঅ্যাপ</span>
              </button>
              
              <button
                onClick={() => shareVia('facebook')}
                className="flex items-center justify-center gap-2 sm:gap-3 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition transform hover:scale-105"
              >
                <FaFacebook className="text-lg sm:text-xl" />
                <span className="text-sm sm:text-base">ফেসবুক</span>
              </button>
              
              <button
                onClick={() => shareVia('email')}
                className="flex items-center justify-center gap-2 sm:gap-3 bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg transition transform hover:scale-105"
              >
                <FaEnvelope className="text-lg sm:text-xl" />
                <span className="text-sm sm:text-base">ইমেইল</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Referred Users List */}
        {referralStats.referredUsers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 sm:mb-8">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaUsers className="text-teal-600" />
                আপনার ডাইরেক্ট রেফারেল ({referralStats.referredUsers.length})
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {referralStats.referredUsers.map((user, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <FaUserCircle className="text-teal-500 text-2xl" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-green-600 font-semibold">+৳250</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Instructions */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-4 sm:p-6">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <FaRocket className="text-teal-600" />
            কিভাবে কাজ করে?
          </h4>
          <div className="space-y-2 text-gray-600 text-xs sm:text-sm">
            <p>✅ আপনার রেফারেল কোড বা লিংক বন্ধুদের সাথে শেয়ার করুন</p>
            <p>✅ আপনার কোড ব্যবহার করে যারা সাইনআপ করবেন তারা আপনার ডাউনলাইনে যুক্ত হবেন</p>
            <p>✅ লেভেল 1: 25% (৳250), লেভেল 2: 3% (৳30), লেভেল 3: 2% (৳20) কমিশন পাবেন</p>
            <p>✅ আয় সরাসরি আপনার অ্যাকাউন্টে জমা হবে</p>
            <p>✅ প্রতিটি সফল রেফারেলের জন্য বোনাস পয়েন্ট</p>
            <p className="text-teal-600 mt-2">💡 টিপ: বেশি বন্ধুকে আমন্ত্রণ জানালে বেশি আয়!</p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ReferPage;
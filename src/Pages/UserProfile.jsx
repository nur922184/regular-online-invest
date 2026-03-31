import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaPhone, 
  FaMoneyBillWave, 
  FaKey, 
  FaDownload, 
  FaBuilding, 
  FaBook, 
  FaBox, 
  FaUniversity,
  FaSignOutAlt,
  FaWallet,
  FaSyncAlt,
  FaChartLine,
  FaUserFriends,
  FaGift,
  FaHistory,
  FaShieldAlt,
  FaRegClock,
  FaArrowRight,
  FaEdit,
  FaCopy,
  FaShare,
  FaWhatsapp,
  FaFacebook,
  FaEnvelope
} from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalRecharge: 0,
    totalIncome: 0,
    totalReferrals: 0,
    pendingEarnings: 0
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Get user from localStorage
      let userData = JSON.parse(localStorage.getItem("user"));
      const userId = localStorage.getItem("userId");
      
      // Try to fetch latest user data from API
      if (userId) {
        try {
          const response = await axios.get(`https://backend-project-invest.vercel.app/api/users/${userId}`);
          if (response.data) {
            userData = response.data;
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } catch (apiError) {
          console.log("Using cached user data");
        }
      }
      
      if (userData) {
        setUser(userData);
        
        // Calculate stats
        setStats({
          totalBalance: userData.balance || 0,
          totalRecharge: userData.totalRecharge || 0,
          totalIncome: userData.totalIncome || (userData.balance > 0 ? userData.balance : 0),
          totalReferrals: userData.level1Count || 0,
          pendingEarnings: userData.pendingEarnings || 0
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Copy referral code
  const copyReferralCode = async () => {
    if (!user?.refCode) return;
    
    try {
      await navigator.clipboard.writeText(user.refCode);
      setCopied(true);
      
      await Swal.fire({
        icon: 'success',
        title: 'কপি হয়েছে!',
        text: 'রেফারেল কোড কপি করা হয়েছে',
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

  // Share referral
  const shareReferral = async () => {
    const shareText = `আমার সাথে যোগ দিন AgroFund BD তে! আমার রেফারেল কোড: ${user?.refCode}\n\nএখনই সাইনআপ করুন: ${window.location.origin}/signup?ref=${user?.refCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AgroFund BD - রেফারেল',
          text: shareText,
          url: `${window.location.origin}/signup?ref=${user?.refCode}`
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copy
      await copyReferralCode();
      Swal.fire({
        icon: 'info',
        title: 'কপি করুন',
        text: 'রেফারেল কোড কপি করা হয়েছে। এখন আপনার বন্ধুদের সাথে শেয়ার করুন।',
        confirmButtonColor: '#10b981'
      });
    }
  };

  // Logout function
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'লগআউট?',
      text: 'আপনি কি নিশ্চিত যে লগআউট করতে চান?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'হ্যাঁ, লগআউট',
      cancelButtonText: 'না',
      background: '#fff',
      iconColor: '#f97316'
    });

    if (result.isConfirmed) {
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // Menu items
  const menuItems = [
    { 
      icon: FaUserFriends, 
      label: "রেফারেল প্রোগ্রাম", 
      path: "/refer", 
      color: "from-purple-500 to-pink-500",
      description: "বন্ধুদের আমন্ত্রণ জানান ও আয় করুন"
    },
    { 
      icon: FaHistory, 
      label: "লেনদেনের ইতিহাস", 
      path: "/transaction-history", 
      color: "from-blue-500 to-cyan-500",
      description: "সকল লেনদেন দেখুন"
    },
    { 
      icon: FaWallet, 
      label: "অ্যাকাউন্ট রেকর্ড", 
      path: "/account-record", 
      color: "from-green-500 to-emerald-500",
      description: "আপনার অ্যাকাউন্টের তথ্য"
    },
    { 
      icon: FaBox, 
      label: "আমার পণ্য", 
      path: "/my-products", 
      color: "from-orange-500 to-red-500",
      description: "আপনার ক্রয়কৃত পণ্য"
    },
    { 
      icon: FaUniversity, 
      label: "ব্যাংক ও পাসওয়ার্ড", 
      path: "/bank-password", 
      color: "from-red-500 to-pink-500",
      description: "ব্যাংক তথ্য ও পাসওয়ার্ড পরিবর্তন"
    },
    { 
      icon: FaBuilding, 
      label: "কোম্পানি প্রোফাইল", 
      path: "/company-profile", 
      color: "from-indigo-500 to-purple-500",
      description: "আমাদের সম্পর্কে জানুন"
    },
    { 
      icon: FaDownload, 
      label: "অ্যাপ ডাউনলোড করুন", 
      path: "/download-app", 
      color: "from-teal-500 to-green-500",
      description: "মোবাইল অ্যাপ ডাউনলোড করুন"
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="text-4xl text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">কোনো ইউজার পাওয়া যায়নি</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition w-full"
          >
            লগইন করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 transform hover:shadow-2xl transition">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mt-16 -mr-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -mb-12 -ml-12"></div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold">আমার প্রোফাইল</h1>
                <p className="text-teal-100 mt-1">স্বাগতম!</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition flex items-center gap-2 hover:scale-105"
              >
                <FaSignOutAlt />
                <span>লগআউট</span>
              </button>
            </div>
          </div>
          
          {/* User Info */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <FaUser className="text-4xl sm:text-5xl text-white" />
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition">
                  <FaEdit className="text-teal-600 text-sm" />
                </button>
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{user.name}</h2>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaPhone className="text-sm text-teal-600" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaKey className="text-sm text-teal-600" />
                    <span>রেফারেল কোড: </span>
                    <strong className="text-teal-600 font-mono">{user.refCode}</strong>
                    <button
                      onClick={copyReferralCode}
                      className="ml-1 text-gray-400 hover:text-teal-600 transition"
                      title="কপি করুন"
                    >
                      <FaCopy className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">ব্যালেন্স</p>
                <p className="text-2xl sm:text-3xl font-bold text-teal-600">৳{stats.totalBalance.toLocaleString()}</p>
              </div>
              <div className="bg-teal-100 p-3 rounded-full">
                <FaWallet className="text-2xl text-teal-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">মোট রিচার্জ</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">৳{stats.totalRecharge.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaSyncAlt className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">মোট আয়</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">৳{stats.totalIncome.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaChartLine className="text-2xl text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">মোট রেফারেল</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.totalReferrals}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaUserFriends className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Referral Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 mb-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mt-20 -mr-20"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <FaGift className="text-3xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">রেফারেল বোনাস!</h3>
                <p className="text-sm opacity-90">প্রতি রেফারেলে পাবেন ৳250</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={shareReferral}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:shadow-lg transition flex items-center gap-2"
              >
                <FaShare />
                <span>শেয়ার করুন</span>
              </button>
              <button
                onClick={() => navigate('/refer')}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                <FaUserFriends />
                <span>আরও জানুন</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Menu */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">দ্রুত লিংক</h3>
            <p className="text-sm text-gray-500 mt-1">আপনার জন্য গুরুত্বপূর্ণ পৃষ্ঠাগুলি</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105 text-left"
              >
                <div className={`bg-gradient-to-r ${item.color} p-3 rounded-lg text-white group-hover:scale-110 transition`}>
                  <item.icon className="text-xl" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                </div>
                <FaArrowRight className="text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-6">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaRegClock className="text-teal-600" />
              সাম্প্রতিক কার্যকলাপ
            </h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaHistory className="text-2xl text-gray-400" />
              </div>
              <p className="text-gray-500">কোনো কার্যকলাপ নেই</p>
              <p className="text-xs text-gray-400 mt-1">শীঘ্রই আপনার লেনদেন এখানে দেখা যাবে</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-xs sm:text-sm">
          <p>© 2026 AgroFund BD | সর্বস্বত্ব সংরক্ষিত</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
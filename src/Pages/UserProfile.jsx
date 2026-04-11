import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaPhone,
  FaKey,
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
  FaFileInvoiceDollar,
  FaLock,
  FaQuestionCircle,
  FaHeadset,
  FaUserPlus,
} from "react-icons/fa";
import Swal from "sweetalert2";
import useUser from "../hooks/useUsers";
import { FiLogOut } from "react-icons/fi";


const UserProfile = () => {
  const navigate = useNavigate();
  const { user, loading, refresh } = useUser();
  const [copying, setCopying] = useState(false);

  // copy referral
  const copyReferralCode = async () => {
    if (!user?.refCode) return;
    setCopying(true);
    await navigator.clipboard.writeText(user.refCode);
    Swal.fire({
      icon: "success",
      title: "কপি হয়েছে!",
      timer: 1200,
      showConfirmButton: false,
    });
    setCopying(false);
  };

  // logout
  const handleLogout = async () => {
    const res = await Swal.fire({
      title: "লগআউট করবেন?",
      text: "আপনি কি নিশ্চিত?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, লগআউট",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (res.isConfirmed) {
      localStorage.clear();
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const totalReferrals = (user?.level1Count || 0) + (user?.level2Count || 0) + (user?.level3Count || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-blue-700 text-white rounded-b-3xl shadow-lg">
        <div className="px-5 pt-6 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">প্রোফাইল</h1>
            <p className="text-teal-100 text-sm mt-0.5">আপনার অ্যাকাউন্ট</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={refresh}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Refresh"
            >
              <FaSyncAlt className="text-lg" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Logout"
            >
              <FaSignOutAlt className="text-lg" />
            </button>
          </div>
        </div>

        {/* User Card inside header */}
        <div className="px-5 pb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 border border-white/20">
            <div className="bg-white/20 p-3 rounded-full">
              <FaUserCircle className="text-4xl text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">
                {user?.name || "Guest User"}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-teal-100 text-sm">
                <span className="flex items-center gap-1">
                  <FaPhone className="text-xs" /> {user?.phone || "N/A"}
                </span>
                <span className="flex items-center gap-1">
                  <FaKey className="text-xs" /> {user?.refCode || "------"}
                  <button
                    onClick={copyReferralCode}
                    disabled={copying}
                    className="ml-1 hover:text-white transition"
                  >
                    <FaCopy className="text-xs" />
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="px-5 -mt-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm font-medium">মোট ব্যালেন্স</p>
              <h2 className="text-3xl font-bold text-white mt-1">
                ৳{user?.balance?.toLocaleString() ?? 0}
              </h2>
            </div>
            <div className="bg-white/20 p-2 rounded-full">
              <FaWallet className="text-white text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 px-5 mt-6">
        <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <FaWallet className="text-teal-600 text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-500">ব্যালেন্স</p>
              <h3 className="font-bold text-gray-800">৳{user?.balance?.toLocaleString() ?? 0}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaChartLine className="text-green-600 text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-500">ইনকাম</p>
              <h3 className="font-bold text-gray-800">৳{user?.totalIncome?.toLocaleString() ?? 0}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaUserFriends className="text-blue-600 text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-500">রেফারেল</p>
              <h3 className="font-bold text-gray-800">{totalReferrals}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FaGift className="text-orange-600 text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-500">পেন্ডিং</p>
              <h3 className="font-bold text-gray-800">৳{user?.pendingEarnings?.toLocaleString() ?? 0}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="mt-6 px-5 space-y-4">
        {/* Main Menu */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-700">প্রধান মেনু</h3>
          </div>
          <div className="divide-y divide-gray-50">
            <MenuItem
              icon={<FaUserPlus />}
              label="যৌজার খনন করুন"
              onClick={() => navigate("/mining")}
            />
            <MenuItem
              icon={<FaSyncAlt />}
              label="রিচার্জিং কর"
              onClick={() => navigate("/topup")}
            />
            <MenuItem
              icon={<FaHandHoldingUsd />}
              label="উত্তলোন কর"
              onClick={() => navigate("/withdraw")}
            />
            <MenuItem
              icon={<FaUsers />}
              label="আমার দল"
              onClick={() => navigate("/refer")}
            />
            <MenuItem
              icon={<FaFileInvoiceDollar />}
              label="আমাদের সম্পর্কে"
              onClick={() => navigate("/about")}
            />
          </div>
        </div>

        {/* Additional Links */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-700">অন্যান্য</h3>
          </div>
          <div className="divide-y divide-gray-50">
            <MenuItem
              icon={<FaHistory />}
              label=" রিসার্জ হিস্টোরি"
              onClick={() => navigate("/transition_history")}
            />
            <MenuItem
              icon={<FaHistory />}
              label=" উত্তলণ হিস্টোরি"
              onClick={() => navigate("/withdrawHisotory")}
            />
            <MenuItem
              icon={<FaLock />}
              label="পাসওয়ার্ড পরিবর্তন"
              onClick={() => navigate("/password_change")}
            />
            <MenuItem
              icon={<FaQuestionCircle />}
              label="সহায়তা"
              onClick={() => navigate("/Support")}
            />
            <MenuItem
              icon={<FaHeadset />}
              label="সাপোর্ট"
              onClick={() => navigate("/Support")}
            />
            <MenuItem
             onClick={handleLogout}
              icon={<FiLogOut />}
              label="লগ আউট "
            />
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center mt-8 px-5">
        <p className="text-xs text-gray-400">
          সর্বশেষ লগইন: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "নতুন"}
        </p>
      </div>
    </div>
  );
};

// Menu Item Component
const MenuItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex justify-between items-center w-full p-4 hover:bg-gray-50 transition-colors group"
  >
    <div className="flex items-center gap-3">
      <span className="text-gray-500 group-hover:text-teal-600 transition-colors">
        {icon}
      </span>
      <span className="text-gray-700 group-hover:text-gray-900 font-medium">
        {label}
      </span>
    </div>
    <FaArrowRight className="text-gray-400 group-hover:text-teal-500 text-sm transition-colors" />
  </button>
);

export default UserProfile;
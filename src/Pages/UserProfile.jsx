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
  FaShieldAlt,
  FaUserShield,
  FaDatabase,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";
import useUser from "../hooks/useUsers";
import { FiLogOut } from "react-icons/fi";

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
    });
    setCopying(false);
  };

  const handleLogout = async () => {
    const res = await Swal.fire({
      title: "লগআউট করবেন?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ",
    });

    if (res.isConfirmed) {
      localStorage.clear();
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin h-10 w-10 border-4 border-teal-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const totalReferrals =
    (user?.level1Count || 0) +
    (user?.level2Count || 0) +
    (user?.level3Count || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-10">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-700 text-white rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center px-5 pt-6">
          <div>
            <h1 className="text-2xl font-bold">
              {isAdmin ? "Admin Panel" : "User Profile"}
            </h1>
            <p className="text-sm opacity-80">
              {isAdmin ? "System Control Panel" : "Your Account"}
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={refresh}>
              <FaSyncAlt />
            </button>
            <button onClick={handleLogout}>
              <FaSignOutAlt />
            </button>
          </div>
        </div>

        {/* USER CARD */}
        <div className="px-5 pb-6 mt-4">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 flex items-center gap-4">
            <FaUserCircle className="text-5xl" />
            <div>
              <h2 className="font-bold text-lg">{user?.name}</h2>
              <p className="text-sm">{user?.phone}</p>

              <div className="flex items-center gap-2 text-xs mt-1">
                <span>{user?.refCode}</span>
                <FaCopy onClick={copyReferralCode} className="cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BALANCE */}
      <div className="px-5 -mt-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-5 shadow-lg">
          <p className="text-sm">Balance</p>
          <h1 className="text-3xl font-bold">৳ {user?.balance || 0}</h1>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3 px-5 mt-5">
        <Stat icon={<FaWallet />} label="Balance" value={user?.balance || 0} />
        <Stat icon={<FaChartLine />} label="Income" value={user?.totalIncome || 0} />
        <Stat icon={<FaUserFriends />} label="Referrals" value={totalReferrals} />
        <Stat icon={<FaGift />} label="Pending" value={user?.pendingEarnings || 0} />
      </div>

      {/* USER MENU */}
      {!isAdmin && (
        <Section title="User Menu">
          <MenuItem icon={<FaUserPlus />} label="Mining" onClick={() => navigate("/mining")} />
          <MenuItem icon={<FaSyncAlt />} label="Recharge" onClick={() => navigate("/topup")} />
          <MenuItem icon={<FaHandHoldingUsd />} label="Withdraw" onClick={() => navigate("/withdraw")} />
          <MenuItem icon={<FaUsers />} label="My Team" onClick={() => navigate("/refer")} />
          <MenuItem icon={<FaHistory />} label="Transaction History" onClick={() => navigate("/transition_history")} />
          <MenuItem icon={<FaHistory />} label="Withdraw History" onClick={() => navigate("/withdrawHisotory")} />
          <MenuItem icon={<FaLock />} label="Change Password" onClick={() => navigate("/password_change")} />
        </Section>
      )}

      {/* ADMIN MENU */}
      {isAdmin && (
        <Section title="Admin Control Panel">
          <MenuItem icon={<FaUserShield />} label="User Management" onClick={() => navigate("/admin/users")} />
          <MenuItem icon={<FaDatabase />} label="Deposit Control" onClick={() => navigate("/admin/deposit")} />
          <MenuItem icon={<FaMoneyCheckAlt />} label="Withdraw Approve" onClick={() => navigate("/admin/withdraw")} />
          <MenuItem icon={<FaChartLine />} label="Analytics Dashboard" onClick={() => navigate("/admin/analytics")} />
          <MenuItem icon={<FaFileInvoiceDollar />} label="All Transactions" onClick={() => navigate("/admin/transactions")} />
        </Section>
      )}

      {/* SUPPORT */}
      <Section title="Support">
        <MenuItem icon={<FaQuestionCircle />} label="Help Center" onClick={() => navigate("/support")} />
        <MenuItem icon={<FaHeadset />} label="Contact Support" onClick={() => navigate("/support")} />
      </Section>
    </div>
  );
};

/* ================= UI COMPONENTS ================= */

const Section = ({ title, children }) => (
  <div className="px-5 mt-6">
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="p-4 border-b font-semibold text-gray-700">
        {title}
      </div>
      <div className="divide-y">{children}</div>
    </div>
  </div>
);

const MenuItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex justify-between items-center w-full p-4 hover:bg-gray-50"
  >
    <div className="flex items-center gap-3 text-gray-700">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
    <FaArrowRight className="text-gray-400" />
  </button>
);

const Stat = ({ icon, label, value }) => (
  <div className="bg-white rounded-xl p-4 shadow">
    <div className="flex items-center gap-3">
      <div className="text-teal-600">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <h3 className="font-bold">৳ {value}</h3>
      </div>
    </div>
  </div>
);

export default UserProfile;
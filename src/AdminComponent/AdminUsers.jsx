// AdminUsers.jsx - Professional Green Theme
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  FaArrowLeft, 
  FaUsers, 
  FaUserCheck, 
  FaUserTimes, 
  FaTrash, 
  FaSearch, 
  FaLeaf, 
  FaTractor, 
  FaSeedling,
  FaPhone,
  FaWallet,
  FaCalendarAlt,
  FaSpinner,
  FaShieldAlt,
  FaUserCircle
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://investify-backend.vercel.app/api/users/all");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "ইউজার লোড করতে ব্যর্থ হয়েছে",
        confirmButtonColor: "#16a34a"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ব্লক/আনব্লক
  const handleBlock = async (id, currentStatus) => {
    const action = currentStatus ? "আনব্লক" : "ব্লক";
    const confirm = await Swal.fire({
      title: `${action} করবেন?`,
      text: `আপনি কি এই ইউজারকে ${action} করতে চান?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `হ্যাঁ, ${action} করুন`,
      cancelButtonText: "না",
      confirmButtonColor: currentStatus ? "#16a34a" : "#ef4444",
      cancelButtonColor: "#6b7280"
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(
        `https://investify-backend.vercel.app/api/users/admin/block-user/${id}`,
        { method: "PUT" }
      );

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: data.message || `ইউজার ${action} করা হয়েছে`,
          confirmButtonColor: "#16a34a",
          timer: 2000
        });
        loadUsers();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "একশন সম্পন্ন করতে ব্যর্থ হয়েছে",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  // ডিলিট
  const handleDelete = async (id, name) => {
    const confirm = await Swal.fire({
      title: "ইউজার ডিলিট করবেন?",
      html: `<p><strong>${name}</strong> নামের ইউজারটি ডিলিট করতে চান?</p><p class="text-red-500 text-xs mt-2">⚠️ এই কাজটি অপরিবর্তনীয়!</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "না",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280"
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(
        `https://investify-backend.vercel.app/api/users/admin/delete-user/${id}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "ডিলিট হয়েছে!",
          text: `${name} ইউজারটি ডিলিট করা হয়েছে`,
          confirmButtonColor: "#16a34a",
          timer: 2000
        });
        loadUsers();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "ডিলিট করতে ব্যর্থ হয়েছে",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  // ফিল্টার এবং সার্চ
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.refCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || 
                          (filter === "active" && !user.isBlocked) ||
                          (filter === "blocked" && user.isBlocked);
    return matchesSearch && matchesFilter;
  });

  const formatNumber = (num) => {
    if (!num && num !== 0) return "০";
    return new Intl.NumberFormat("bn-BD").format(num);
  };

  // পরিসংখ্যান
  const totalUsers = users.length;
  const activeUsers = users.filter(u => !u.isBlocked).length;
  const blockedUsers = users.filter(u => u.isBlocked).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-3" />
          <p className="text-green-600 text-sm">ইউজার লোড হচ্ছে...</p>
        </div>
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
            <FaShieldAlt className="text-red-600 text-lg" />
            <h1 className="text-lg font-bold text-green-800">ইউজার ব্যবস্থাপনা</h1>
          </div>
          <FaUsers className="text-green-600 ml-auto text-sm" />
        </div>

        {/* স্ট্যাটিসটিক্স কার্ড */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-green-100">
            <FaUsers className="text-green-600 text-lg mx-auto mb-1" />
            <p className="text-gray-500 text-[10px]">মোট</p>
            <p className="text-green-700 font-bold text-lg">{totalUsers}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-green-100">
            <FaUserCheck className="text-green-500 text-lg mx-auto mb-1" />
            <p className="text-gray-500 text-[10px]">সক্রিয়</p>
            <p className="text-green-700 font-bold text-lg">{activeUsers}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-green-100">
            <FaUserTimes className="text-red-500 text-lg mx-auto mb-1" />
            <p className="text-gray-500 text-[10px]">ব্লক</p>
            <p className="text-green-700 font-bold text-lg">{blockedUsers}</p>
          </div>
        </div>

        {/* সার্চ বার */}
        <div className="mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 text-xs" />
            <input
              type="text"
              placeholder="নাম, ফোন বা রেফারেল কোড দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-green-200 rounded-lg text-green-800 text-sm placeholder:text-green-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        {/* ফিল্টার বাটন */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition ${
              filter === "all"
                ? "bg-green-600 text-white shadow-md"
                : "bg-white border border-green-200 text-green-700 hover:bg-green-50"
            }`}
          >
            সব ({totalUsers})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition ${
              filter === "active"
                ? "bg-green-600 text-white shadow-md"
                : "bg-white border border-green-200 text-green-700 hover:bg-green-50"
            }`}
          >
            সক্রিয় ({activeUsers})
          </button>
          <button
            onClick={() => setFilter("blocked")}
            className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition ${
              filter === "blocked"
                ? "bg-red-600 text-white shadow-md"
                : "bg-white border border-red-200 text-red-700 hover:bg-red-50"
            }`}
          >
            ব্লক ({blockedUsers})
          </button>
        </div>

        {/* ইউজার লিস্ট */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-green-100">
            <FaUsers className="text-green-300 text-4xl mx-auto mb-2" />
            <p className="text-green-500 text-sm">কোন ইউজার পাওয়া যায়নি</p>
            <p className="text-green-400 text-[10px] mt-1">অন্য কীওয়ার্ড দিয়ে সার্চ করুন</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${
                  user.isBlocked ? "border-red-200 bg-red-50/30" : "border-green-100"
                }`}
              >
                {/* ইউজার হেডার */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        user.isBlocked ? "bg-red-100" : "bg-gradient-to-r from-green-600 to-emerald-600"
                      }`}>
                        <FaUserCircle className="text-white text-2xl" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-base">{user.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <FaPhone className="text-gray-400 text-[10px]" />
                          <span className="text-gray-500 text-xs">{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <FaBangladeshiTakaSign className="text-gray-400 text-[10px]" />
                          <span className="text-gray-500 text-xs">ব্যালেন্স: ৳{formatNumber(user.balance)}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                      user.isBlocked
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}>
                      {user.isBlocked ? "ব্লক করা আছে" : "সক্রিয়"}
                    </span>
                  </div>

                  {/* রেফারেল তথ্য */}
                  <div className="mt-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">রেফারেল কোড:</span>
                      <span className="text-green-700 font-mono font-medium">{user.refCode || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-gray-500">যোগদানের তারিখ:</span>
                      <span className="text-gray-600">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("bn-BD") : "N/A"}
                      </span>
                    </div>
                    {user.referredBy && (
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-gray-500">রেফার করেছেন:</span>
                        <span className="text-gray-600">{user.referredBy}</span>
                      </div>
                    )}
                  </div>

                  {/* অ্যাকশন বাটন */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleBlock(user._id, user.isBlocked)}
                      className={`flex-1 py-2 rounded-lg font-medium text-sm transition ${
                        user.isBlocked
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-yellow-500 hover:bg-yellow-600 text-white"
                      }`}
                    >
                      {user.isBlocked ? "আনব্লক করুন" : "ব্লক করুন"}
                    </button>
                    <button
                      onClick={() => handleDelete(user._id, user.name)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium text-sm transition"
                    >
                      <FaTrash className="inline mr-1 text-xs" />
                      ডিলিট
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ফুটার */}
        <div className="text-center mt-6 pt-4 border-t border-green-100">
          <div className="flex justify-center gap-2 mb-1">
            <FaLeaf className="text-green-400 text-xs" />
            <FaSeedling className="text-green-500 text-xs" />
            <FaTractor className="text-green-600 text-xs" />
          </div>
          <p className="text-gray-400 text-[10px]">AgroFund - এডমিন প্যানেল</p>
        </div>

      </div>
    </div>
  );
};

export default AdminUsers;
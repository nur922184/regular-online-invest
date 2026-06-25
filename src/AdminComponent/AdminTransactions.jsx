// AdminTransactions.jsx - আপডেটেড ভার্সন (adminId সহ)
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaMoneyBillWave,
  FaSyncAlt,
  FaSearch,
  FaArrowLeft,
  FaLeaf,
  FaTractor,
  FaSeedling,
  FaWallet,
  FaSpinner,
  FaUser,
  FaCalendarAlt,
  FaPhone,
  FaTree,
  FaUsers,
  FaShieldAlt
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import useUser from "../hooks/useUsers";

const AdminTransactions = () => {
  const navigate = useNavigate();
  const { user } = useUser(); // এডমিন ইউজার তথ্য নেওয়া
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchTransactions = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(
        "https://investify-backend.vercel.app/api/transactions/all"
      );
      setTransactions(res.data.transactions || []);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "ডাটা লোড হয়নি",
        confirmButtonColor: "#16a34a"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleApprove = async (id, amount, userId) => {
    const confirm = await Swal.fire({
      title: "ট্রানজেকশন অনুমোদন করবেন?",
      html: `
        <div class="text-left">
          <p>পরিমাণ: <strong class="text-green-600">৳${amount}</strong></p>
          <p class="text-sm text-gray-600 mt-2">রেফারেল কমিশন বিতরণ:</p>
          <ul class="text-sm text-gray-600 mt-1">
            <li>• Level 1 (রেফারার): 10% = ৳${(amount * 0.10).toFixed(2)}</li>
            <li>• Level 2: 5% = ৳${(amount * 0.05).toFixed(2)}</li>
            <li>• Level 3: 2% = ৳${(amount * 0.02).toFixed(2)}</li>
          </ul>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, অনুমোদন করুন",
      cancelButtonText: "না",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280"
    });

    if (!confirm.isConfirmed) return;

    try {
      // ✅ adminId সহ রিকোয়েস্ট পাঠানো হচ্ছে
      const res = await axios.patch(
        `https://investify-backend.vercel.app/api/transactions/approve/${id}`,
        {
          adminId: user?._id || "admin"  // এডমিন আইডি পাঠানো হচ্ছে
        }
      );
      
      const data = res.data;
      
      // কমিশন বিতরণের বিবরণ দেখানো
      if (data.commissionGiven) {
        let commissionHtml = '<div class="text-left mt-2">';
        if (data.commissionGiven.level1) commissionHtml += '<p>✅ Level 1: 10% কমিশন দেওয়া হয়েছে</p>';
        if (data.commissionGiven.level2) commissionHtml += '<p>✅ Level 2: 5% কমিশন দেওয়া হয়েছে</p>';
        if (data.commissionGiven.level3) commissionHtml += '<p>✅ Level 3: 2% কমিশন দেওয়া হয়েছে</p>';
        if (!data.commissionGiven.level1 && !data.commissionGiven.level2 && !data.commissionGiven.level3) {
          commissionHtml += '<p>ℹ️ এই ইউজারের কোনো রেফারেল নেই</p>';
        }
        commissionHtml += '</div>';
        
        Swal.fire({
          icon: "success",
          title: "অনুমোদন করা হয়েছে!",
          html: `
            <div class="text-center">
              <p class="text-lg font-bold text-green-600">৳${amount} যোগ করা হয়েছে</p>
              ${commissionHtml}
              <p class="text-xs text-gray-500 mt-3">নতুন ব্যালেন্স: ৳${data.newBalance?.toLocaleString()}</p>
            </div>
          `,
          timer: 3000,
          showConfirmButton: true,
          confirmButtonColor: "#16a34a"
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "অনুমোদন করা হয়েছে!",
          html: `
            <div class="text-center">
              <p class="text-lg font-bold text-green-600">৳${amount} যোগ করা হয়েছে</p>
              <p class="text-xs text-gray-500 mt-2">নতুন ব্যালেন্স: ৳${data.newBalance?.toLocaleString()}</p>
            </div>
          `,
          timer: 2000,
          showConfirmButton: false
        });
      }
      
      fetchTransactions();
    } catch (error) {
      console.error("Approval error:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: error.response?.data?.message || "অনুমোদন করতে ব্যর্থ হয়েছে",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: "ট্রানজেকশন বাতিল করবেন?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, বাতিল করুন",
      cancelButtonText: "না",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280"
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.patch(
        `https://investify-backend.vercel.app/api/transactions/reject/${id}`,
        {
          adminId: user?._id || "admin"
        }
      );
      Swal.fire({
        icon: "success",
        title: "বাতিল করা হয়েছে!",
        timer: 1500,
        showConfirmButton: false
      });
      fetchTransactions();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "বাতিল করতে ব্যর্থ হয়েছে",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          color: "text-green-600",
          bg: "bg-green-100",
          icon: FaCheckCircle,
          label: "অনুমোদিত",
          border: "border-green-200"
        };
      case "rejected":
        return {
          color: "text-red-600",
          bg: "bg-red-100",
          icon: FaTimesCircle,
          label: "বাতিল",
          border: "border-red-200"
        };
      default:
        return {
          color: "text-yellow-600",
          bg: "bg-yellow-100",
          icon: FaClock,
          label: "পেন্ডিং",
          border: "border-yellow-200"
        };
    }
  };

  const filteredData = transactions.filter((trx) => {
    const matchFilter = filter === "all" ? true : trx.status === filter;
    const matchSearch = trx.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
                       trx.userName?.toLowerCase().includes(search.toLowerCase()) ||
                       trx.phoneNumber?.includes(search);
    return matchFilter && matchSearch;
  });

  const formatNumber = (num) => {
    if (!num && num !== 0) return "০";
    return new Intl.NumberFormat("bn-BD").format(num);
  };

  const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const pendingAmount = transactions.filter(t => t.status === "pending").reduce((sum, t) => sum + (t.amount || 0), 0);

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
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => navigate(-1)} className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <FaArrowLeft className="text-green-700 text-sm" />
          </button>
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-red-600 text-lg" />
            <h1 className="text-lg font-bold text-green-800">লেনদেন ব্যবস্থাপনা</h1>
          </div>
          <button onClick={fetchTransactions} className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <FaSyncAlt className={`text-green-600 text-sm ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* স্ট্যাটিসটিক্স */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-green-100">
            <FaWallet className="text-green-600 text-lg mx-auto mb-1" />
            <p className="text-gray-500 text-[10px]">মোট ডিপোজিট</p>
            <p className="text-green-700 font-bold text-sm">৳{formatNumber(totalAmount)}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-yellow-100">
            <FaClock className="text-yellow-500 text-lg mx-auto mb-1" />
            <p className="text-gray-500 text-[10px]">পেন্ডিং</p>
            <p className="text-yellow-700 font-bold text-sm">৳{formatNumber(pendingAmount)}</p>
          </div>
        </div>

        {/* সার্চ */}
        <div className="mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 text-xs" />
            <input
              type="text"
              placeholder="ট্রানজেকশন আইডি, নাম বা ফোন দিয়ে খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-green-200 rounded-lg text-green-800 text-sm"
            />
          </div>
        </div>

        {/* ফিল্টার বাটন */}
        <div className="flex gap-2 mb-4">
          {["all", "pending", "approved", "rejected"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition ${
                filter === item
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white border border-green-200 text-green-700"
              }`}
            >
              {item === "all" ? "সব" : item === "pending" ? "পেন্ডিং" : item === "approved" ? "অনুমোদিত" : "বাতিল"}
              ({transactions.filter(t => item === "all" ? true : t.status === item).length})
            </button>
          ))}
        </div>

        {/* লেনদেন লিস্ট */}
        {filteredData.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-green-100">
            <FaMoneyBillWave className="text-green-300 text-4xl mx-auto mb-2" />
            <p className="text-green-500 text-sm">কোন লেনদেন পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((trx) => {
              const StatusIcon = getStatusConfig(trx.status).icon;
              const statusConfig = getStatusConfig(trx.status);

              return (
                <div key={trx._id} className={`bg-white rounded-xl shadow-sm border ${statusConfig.border} p-4`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FaBangladeshiTakaSign className="text-green-600 text-sm" />
                        <span className="text-green-700 font-bold text-lg">৳{formatNumber(trx.amount)}</span>
                      </div>
                      <p className="text-gray-500 text-[10px] flex items-center gap-1">
                        <FaCalendarAlt size={8} />
                        {new Date(trx.createdAt).toLocaleString("bn-BD")}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
                      <StatusIcon size={10} />
                      <span className="text-[10px] font-medium">{statusConfig.label}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">ট্রানজেকশন আইডি:</span>
                      <span className="text-gray-700 font-mono text-[10px]">{trx.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">পেমেন্ট মেথড:</span>
                      <span className="text-gray-700">{trx.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">মোবাইল নম্বর:</span>
                      <span className="text-gray-700">{trx.phoneNumber}</span>
                    </div>
                  </div>

                  {/* কমিশন তথ্য */}
                  {trx.status === "pending" && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 text-[9px] flex items-center gap-1">
                        <FaTree size={8} />
                        রেফারেল কমিশন
                      </p>
                      <div className="flex justify-between text-[10px] mt-1">
                        <span>Level 1 (10%): ৳{(trx.amount * 0.10).toFixed(2)}</span>
                        <span>Level 2 (5%): ৳{(trx.amount * 0.05).toFixed(2)}</span>
                        <span>Level 3 (2%): ৳{(trx.amount * 0.02).toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {/* অ্যাকশন বাটন */}
                  {trx.status === "pending" && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleApprove(trx._id, trx.amount, trx.userId)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2"
                      >
                        <FaCheckCircle size={12} />
                        অনুমোদন দিন
                      </button>
                      <button
                        onClick={() => handleReject(trx._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2"
                      >
                        <FaTimesCircle size={12} />
                        বাতিল করুন
                      </button>
                    </div>
                  )}
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
          <p className="text-gray-400 text-[10px]">AgroFund - এডমিন প্যানেল</p>
        </div>

      </div>
    </div>
  );
};

export default AdminTransactions;
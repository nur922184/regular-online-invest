// AdminTransactions.jsx - Professional Green Theme
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
  FaPhone
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const AdminTransactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchTransactions = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(
        "https://backend-project-invest.vercel.app/api/transactions/all"
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

  const handleApprove = async (id) => {
    const confirm = await Swal.fire({
      title: "ট্রানজেকশন অনুমোদন করবেন?",
      text: "একবার অনুমোদন করলে তা পরিবর্তন করা যাবে না",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, অনুমোদন করুন",
      cancelButtonText: "না",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280"
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.patch(
        `https://backend-project-invest.vercel.app/api/transactions/approve/${id}`
      );
      Swal.fire({
        icon: "success",
        title: "অনুমোদন করা হয়েছে!",
        timer: 1500,
        showConfirmButton: false
      });
      fetchTransactions();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "অনুমোদন করতে ব্যর্থ হয়েছে",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: "ট্রানজেকশন বাতিল করবেন?",
      text: "একবার বাতিল করলে তা পরিবর্তন করা যাবে না",
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
        `https://backend-project-invest.vercel.app/api/transactions/reject/${id}`
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

  // পরিসংখ্যান
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = transactions.filter(t => t.status === "pending").reduce((sum, t) => sum + t.amount, 0);
  const approvedAmount = transactions.filter(t => t.status === "approved").reduce((sum, t) => sum + t.amount, 0);

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
          <button 
            onClick={() => navigate(-1)} 
            className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center active:bg-green-200 transition"
          >
            <FaArrowLeft className="text-green-700 text-sm" />
          </button>
          <div className="flex items-center gap-2">
            <FaMoneyBillWave className="text-green-600 text-lg" />
            <h1 className="text-lg font-bold text-green-800">লেনদেন ব্যবস্থাপনা</h1>
          </div>
          <button
            onClick={fetchTransactions}
            className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center active:bg-green-200 transition"
          >
            <FaSyncAlt className={`text-green-600 text-sm ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* স্ট্যাটিসটিক্স কার্ড */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-white rounded-xl p-2 text-center shadow-sm border border-green-100">
            <FaWallet className="text-green-600 text-sm mx-auto mb-1" />
            <p className="text-gray-500 text-[9px]">মোট</p>
            <p className="text-green-700 font-bold text-sm">৳{formatNumber(totalAmount)}</p>
          </div>
          <div className="bg-white rounded-xl p-2 text-center shadow-sm border border-yellow-100">
            <FaClock className="text-yellow-500 text-sm mx-auto mb-1" />
            <p className="text-gray-500 text-[9px]">পেন্ডিং</p>
            <p className="text-yellow-700 font-bold text-sm">৳{formatNumber(pendingAmount)}</p>
          </div>
          <div className="bg-white rounded-xl p-2 text-center shadow-sm border border-green-100">
            <FaCheckCircle className="text-green-500 text-sm mx-auto mb-1" />
            <p className="text-gray-500 text-[9px]">অনুমোদিত</p>
            <p className="text-green-700 font-bold text-sm">৳{formatNumber(approvedAmount)}</p>
          </div>
        </div>

        {/* সার্চ বার */}
        <div className="mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 text-xs" />
            <input
              type="text"
              placeholder="ট্রানজেকশন আইডি, নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
            সব ({transactions.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition ${
              filter === "pending"
                ? "bg-yellow-500 text-white shadow-md"
                : "bg-white border border-yellow-200 text-yellow-700 hover:bg-yellow-50"
            }`}
          >
            পেন্ডিং ({transactions.filter(t => t.status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition ${
              filter === "approved"
                ? "bg-green-600 text-white shadow-md"
                : "bg-white border border-green-200 text-green-700 hover:bg-green-50"
            }`}
          >
            অনুমোদিত ({transactions.filter(t => t.status === "approved").length})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition ${
              filter === "rejected"
                ? "bg-red-600 text-white shadow-md"
                : "bg-white border border-red-200 text-red-700 hover:bg-red-50"
            }`}
          >
            বাতিল ({transactions.filter(t => t.status === "rejected").length})
          </button>
        </div>

        {/* লেনদেন লিস্ট */}
        {filteredData.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-green-100">
            <FaMoneyBillWave className="text-green-300 text-4xl mx-auto mb-2" />
            <p className="text-green-500 text-sm">কোন লেনদেন পাওয়া যায়নি</p>
            <p className="text-green-400 text-[10px] mt-1">অন্য কীওয়ার্ড দিয়ে সার্চ করুন</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((trx) => {
              const StatusIcon = getStatusConfig(trx.status).icon;
              const statusConfig = getStatusConfig(trx.status);

              return (
                <div
                  key={trx._id}
                  className={`bg-white rounded-xl shadow-sm border ${statusConfig.border} overflow-hidden transition-all hover:shadow-md`}
                >
                  <div className="p-4">
                    {/* হেডার */}
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

                    {/* ইউজার তথ্য */}
                    {trx.userName && (
                      <div className="flex items-center gap-2 mb-2 text-xs">
                        <FaUser className="text-gray-400 text-[10px]" />
                        <span className="text-gray-600">{trx.userName}</span>
                      </div>
                    )}

                    {/* লেনদেন বিবরণ */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">ট্রানজেকশন আইডি:</span>
                        <span className="text-gray-700 font-mono text-[10px]">{trx.transactionId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">পেমেন্ট মেথড:</span>
                        <span className="text-gray-700">{trx.paymentMethod}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">মোবাইল নম্বর:</span>
                        <div className="flex items-center gap-1">
                          <FaPhone size={8} className="text-gray-400" />
                          <span className="text-gray-700">{trx.phoneNumber}</span>
                        </div>
                      </div>
                    </div>

                    {/* অ্যাকশন বাটন */}
                    {trx.status === "pending" && (
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleApprove(trx._id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2"
                        >
                          <FaCheckCircle size={12} />
                          অনুমোদন করুন
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
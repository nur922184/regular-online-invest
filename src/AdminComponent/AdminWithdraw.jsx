// AdminWithdraw.jsx - Professional Green Theme
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaArrowLeft,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUser,
  FaCalendarAlt,
  FaWallet,
  FaSpinner,
  FaSearch,
  FaLeaf,
  FaTractor,
  FaSeedling,
  FaSyncAlt,
  FaPhone,
  FaInfoCircle,
  FaRegMehBlank
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const AdminWithdraw = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const loadData = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("https://backend-project-invest.vercel.app/api/withdrawals/admin/all");
      const result = await res.json();
      setData(result.withdrawals || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "ডাটা লোড করতে ব্যর্থ হয়েছে",
        confirmButtonColor: "#16a34a"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (id, status) => {
    const actionText = status === "approved" ? "অনুমোদন" : "বাতিল";
    const confirm = await Swal.fire({
      title: `${actionText} করবেন?`,
      html: `<p>আপনি কি এই উত্তোলন রিকোয়েস্ট ${actionText} করতে চান?</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `হ্যাঁ, ${actionText} করুন`,
      cancelButtonText: "না",
      confirmButtonColor: status === "approved" ? "#16a34a" : "#ef4444",
      cancelButtonColor: "#6b7280"
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`https://backend-project-invest.vercel.app/api/withdrawals/admin/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: result.message || `উত্তোলন ${actionText} করা হয়েছে`,
          confirmButtonColor: "#16a34a",
          timer: 1500
        });
        loadData();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: error.message || `${actionText} করতে ব্যর্থ হয়েছে`,
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

  const formatNumber = (num) => {
    if (!num && num !== 0) return "০";
    return new Intl.NumberFormat("bn-BD").format(num);
  };

  // ফিল্টার এবং সার্চ
  const filteredData = data.filter((item) => {
    const matchFilter = filter === "all" ? true : item.status === filter;
    const matchSearch = item.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
                       item.accountNumber?.toLowerCase().includes(search.toLowerCase()) ||
                       item.amount?.toString().includes(search);
    return matchFilter && matchSearch;
  });

  // পরিসংখ্যান
  const totalWithdraw = data.reduce((sum, item) => sum + item.amount, 0);
  const pendingAmount = data.filter(item => item.status === "pending").reduce((sum, item) => sum + item.amount, 0);
  const approvedAmount = data.filter(item => item.status === "approved").reduce((sum, item) => sum + item.amount, 0);

  const getAccountName = (type) => {
    switch(type) {
      case "bkash": return "বিকাশ";
      case "nagad": return "নগদ";
      default: return type || "N/A";
    }
  };

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
            <h1 className="text-lg font-bold text-green-800">উত্তোলন ব্যবস্থাপনা</h1>
          </div>
          <button
            onClick={loadData}
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
            <p className="text-green-700 font-bold text-sm">৳{formatNumber(totalWithdraw)}</p>
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
              placeholder="নাম, অ্যাকাউন্ট নম্বর বা টাকার পরিমাণ খুঁজুন..."
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
            সব ({data.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition ${
              filter === "pending"
                ? "bg-yellow-500 text-white shadow-md"
                : "bg-white border border-yellow-200 text-yellow-700 hover:bg-yellow-50"
            }`}
          >
            পেন্ডিং ({data.filter(item => item.status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition ${
              filter === "approved"
                ? "bg-green-600 text-white shadow-md"
                : "bg-white border border-green-200 text-green-700 hover:bg-green-50"
            }`}
          >
            অনুমোদিত ({data.filter(item => item.status === "approved").length})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition ${
              filter === "rejected"
                ? "bg-red-600 text-white shadow-md"
                : "bg-white border border-red-200 text-red-700 hover:bg-red-50"
            }`}
          >
            বাতিল ({data.filter(item => item.status === "rejected").length})
          </button>
        </div>

        {/* উইথড্র লিস্ট */}
        {filteredData.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-green-100">
            <FaMoneyBillWave className="text-green-300 text-4xl mx-auto mb-2" />
            <p className="text-green-500 text-sm">কোন উত্তোলন রিকোয়েস্ট পাওয়া যায়নি</p>
            <p className="text-green-400 text-[10px] mt-1">অন্য কীওয়ার্ড দিয়ে সার্চ করুন</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((item) => {
              const StatusIcon = getStatusConfig(item.status).icon;
              const statusConfig = getStatusConfig(item.status);

              return (
                <div
                  key={item._id}
                  className={`bg-white rounded-xl shadow-sm border ${statusConfig.border} overflow-hidden transition-all hover:shadow-md`}
                >
                  <div className="p-4">
                    {/* হেডার */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <FaBangladeshiTakaSign className="text-green-600 text-sm" />
                          <span className="text-green-700 font-bold text-lg">৳{formatNumber(item.amount)}</span>
                        </div>
                        <p className="text-gray-500 text-[10px] flex items-center gap-1">
                          <FaCalendarAlt size={8} />
                          {new Date(item.createdAt).toLocaleString("bn-BD")}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
                        <StatusIcon size={10} />
                        <span className="text-[10px] font-medium">{statusConfig.label}</span>
                      </div>
                    </div>

                    {/* ইউজার তথ্য */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <FaUser className="text-gray-400 text-[10px]" />
                        <span className="text-gray-700 text-sm font-medium">{item.userId?.name || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <FaPhone className="text-gray-400 text-[10px]" />
                        <span className="text-gray-600 text-xs">{item.userId?.phone || "N/A"}</span>
                      </div>
                    </div>

                    {/* অ্যাকাউন্ট তথ্য */}
                    <div className="bg-gray-50 rounded-lg p-2 mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <FaRegMehBlank className="text-green-500 text-[10px]" />
                        <span className="text-gray-700 text-xs font-medium">অ্যাকাউন্ট তথ্য</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">টাইপ:</span>
                        <span className="text-gray-700">{getAccountName(item.accountType)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-gray-500">নম্বর:</span>
                        <span className="text-gray-700 font-mono">{item.accountNumber}</span>
                      </div>
                    </div>

                    {/* সার্ভিস চার্জ তথ্য */}
                    {item.serviceCharge && (
                      <div className="flex items-center justify-between text-xs mb-3 pt-1 border-t border-gray-100">
                        <span className="text-gray-500">সার্ভিস চার্জ (৫%):</span>
                        <span className="text-yellow-600 font-medium">৳{formatNumber(item.serviceCharge)}</span>
                      </div>
                    )}

                    {/* অ্যাকশন বাটন */}
                    {item.status === "pending" && (
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => updateStatus(item._id, "approved")}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2"
                        >
                          <FaCheckCircle size={12} />
                          অনুমোদন দিন
                        </button>
                        <button
                          onClick={() => updateStatus(item._id, "rejected")}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2"
                        >
                          <FaTimesCircle size={12} />
                          বাতিল করুন
                        </button>
                      </div>
                    )}

                    {/* অনুমোদিত/বাতিলের জন্য তথ্য */}
                    {item.status !== "pending" && (
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <p className="text-gray-400 text-[10px] flex items-center gap-1">
                          <FaInfoCircle size={8} />
                          {item.status === "approved" ? "এই উত্তোলন অনুমোদন করা হয়েছে" : "এই উত্তোলন বাতিল করা হয়েছে"}
                        </p>
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

export default AdminWithdraw;
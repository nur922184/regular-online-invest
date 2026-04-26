// AddAccount.jsx - Green Agriculture Theme
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaArrowLeft,
  FaUser,
  FaPhone,
  FaIdCard,
  FaWallet,
  FaCheckCircle,
  FaSpinner,
  FaLeaf,
  FaSeedling,
  FaTractor
} from "react-icons/fa";
import useUser from "../hooks/useUsers";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const AddAccount = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    accountType: "bkash",
    accountName: "",
    accountNumber: "",
    holderName: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ভ্যালিডেশন
  const validate = () => {
    const { accountName, accountNumber, holderName } = formData;

    if (!accountName || !accountNumber || !holderName) {
      Swal.fire("ত্রুটি!", "সব তথ্য পূরণ করুন", "warning");
      return false;
    }

    const regex = /^01[3-9]\d{8}$/;
    if (!regex.test(accountNumber)) {
      Swal.fire("ত্রুটি!", "সঠিক নম্বর দিন (01XXXXXXXXX)", "error");
      return false;
    }

    return true;
  };

  // সাবমিট
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire("লগইন করুন");
      return navigate("/login");
    }

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await fetch(
        "https://backend-project-invest.vercel.app/api/accounts/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id, ...formData })
        }
      );

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "অ্যাকাউন্ট যোগ হয়েছে",
          confirmButtonColor: "#16a34a"
        });
        navigate("/withdraw");
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      Swal.fire("ত্রুটি!", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="max-w-md mx-auto px-4 py-5">
        
        {/* হেডার */}
        <div className="flex items-center gap-3 mb-5">
          <button 
            onClick={() => navigate(-1)} 
            className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center active:bg-green-200 transition"
          >
            <FaArrowLeft className="text-green-700 text-sm" />
          </button>
          <h2 className="text-xl font-bold text-green-800">অ্যাকাউন্ট যোগ করুন</h2>
          <FaWallet className="text-green-600 ml-auto text-sm" />
        </div>

        {/* ইনফো কার্ড */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 shadow-md mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs mb-0.5">বর্তমান ব্যবহারকারী</p>
              <p className="text-white font-semibold text-sm">{user?.name || "নাম নেই"}</p>
              <p className="text-white/70 text-[10px] mt-0.5">{user?.phone || "ফোন নেই"}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-xl">
              <FaUser className="text-white text-xl" />
            </div>
          </div>
        </div>

        {/* ফর্ম কার্ড */}
        <div className="bg-white rounded-xl shadow-md border border-green-100 p-5 mb-5">
          
          {/* অ্যাকাউন্ট টাইপ সিলেক্ট */}
          <div className="mb-4">
            <label className="block text-green-800 text-sm font-semibold mb-2">
              অ্যাকাউন্ট টাইপ
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, accountType: "bkash" })}
                className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                  formData.accountType === "bkash"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-green-300"
                }`}
              >
                <FaBangladeshiTakaSign className={`text-xl ${formData.accountType === "bkash" ? "text-pink-500" : "text-gray-400"}`} />
                <span className={`font-medium ${formData.accountType === "bkash" ? "text-green-700" : "text-gray-600"}`}>
                  বিকাশ
                </span>
                {formData.accountType === "bkash" && (
                  <FaCheckCircle className="text-green-500 text-sm" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, accountType: "nagad" })}
                className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                  formData.accountType === "nagad"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-green-300"
                }`}
              >
                <FaBangladeshiTakaSign className={`text-xl ${formData.accountType === "nagad" ? "text-orange-500" : "text-gray-400"}`} />
                <span className={`font-medium ${formData.accountType === "nagad" ? "text-green-700" : "text-gray-600"}`}>
                  নগদ
                </span>
                {formData.accountType === "nagad" && (
                  <FaCheckCircle className="text-green-500 text-sm" />
                )}
              </button>
            </div>
          </div>

          {/* অ্যাকাউন্ট নাম */}
          <div className="mb-4">
            <label className="block text-green-800 text-sm font-semibold mb-2">
              অ্যাকাউন্ট নাম
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <FaIdCard className="text-green-500 text-xs" />
              </span>
              <input
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                placeholder="যেমন: ব্যক্তিগত অ্যাকাউন্ট"
                className="w-full pl-9 pr-3 py-2.5 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm placeholder:text-green-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>

          {/* হোল্ডার নাম */}
          <div className="mb-4">
            <label className="block text-green-800 text-sm font-semibold mb-2">
              হোল্ডারের নাম
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <FaUser className="text-green-500 text-xs" />
              </span>
              <input
                name="holderName"
                value={formData.holderName}
                onChange={handleChange}
                placeholder="আপনার পুরো নাম"
                className="w-full pl-9 pr-3 py-2.5 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm placeholder:text-green-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>

          {/* অ্যাকাউন্ট নম্বর */}
          <div className="mb-5">
            <label className="block text-green-800 text-sm font-semibold mb-2">
              অ্যাকাউন্ট নম্বর
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <FaPhone className="text-green-500 text-xs" />
              </span>
              <input
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="w-full pl-9 pr-3 py-2.5 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm placeholder:text-green-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
            <p className="text-gray-400 text-[10px] mt-1">
              সঠিক মোবাইল নম্বর দিন (01 দিয়ে শুরু)
            </p>
          </div>

          {/* তথ্য বক্স */}
          <div className="bg-green-50 rounded-lg p-3 mb-5">
            <div className="flex items-start gap-2">
              <FaCheckCircle className="text-green-600 text-sm mt-0.5" />
              <div>
                <p className="text-green-800 text-xs font-semibold mb-1">গুরুত্বপূর্ণ তথ্য</p>
                <p className="text-green-700 text-[10px]">✓ এই অ্যাকাউন্ট উত্তোলনের জন্য ব্যবহার হবে</p>
                <p className="text-green-700 text-[10px]">✓ সঠিক তথ্য প্রদান করুন</p>
                <p className="text-green-700 text-[10px]">✓ একাধিক অ্যাকাউন্ট যোগ করা যাবে</p>
              </div>
            </div>
          </div>

          {/* বাটন */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition"
            >
              বাতিল
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  <span>যোগ করা হচ্ছে...</span>
                </div>
              ) : (
                "অ্যাকাউন্ট যোগ করুন"
              )}
            </button>
          </div>
        </div>

        {/* ফুটার */}
        <div className="text-center">
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

export default AddAccount;
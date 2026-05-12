// AddAccount.jsx - Green Agriculture Theme with Limit Check
import React, { useState, useEffect, useRef } from "react";
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
  FaTractor,
  FaList,
  FaExclamationTriangle
} from "react-icons/fa";
import useUser from "../hooks/useUsers";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const AddAccount = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [accountCount, setAccountCount] = useState(0);
  const [checkingCount, setCheckingCount] = useState(true);
  const [maxAccounts] = useState(2); // সর্বোচ্চ ২টি অ্যাকাউন্ট

  const [formData, setFormData] = useState({
    accountType: "bkash",
    accountName: "ব্যক্তিগত অ্যাকাউন্ট", // সরাসরি সেট করে দেওয়া হয়েছে
    accountNumber: "",
    holderName: ""
  });
  const hasChecked = useRef(false);

  useEffect(() => {
    const checkAccountCount = async () => {
      if (!user?._id || hasChecked.current) return;

      try {
        hasChecked.current = true; // ✅ একবার run lock
        setCheckingCount(true);

        const res = await fetch(`https://investify-backend.vercel.app/api/accounts/user/${user._id}`);
        const data = await res.json();

        if (data.success && data.accounts) {
          setAccountCount(data.accounts.length);
        }
      } catch (error) {
        console.error("Error checking account count:", error);
      } finally {
        setCheckingCount(false);
      }
    };

    checkAccountCount();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // accountName যেন পরিবর্তন না হয় সেদিকে খেয়াল রাখা হয়েছে
    if (name === "accountName") return;
    setFormData({ ...formData, [name]: value });
  };

  // ভ্যালিডেশন
  const validate = () => {
    const { accountNumber, holderName } = formData;

    if (!accountNumber || !holderName) {
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

  // অ্যাকাউন্ট লিস্টে যাওয়া
  const goToAccountList = () => {
    navigate("/account_list");
  };

  // সাবমিট
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire("লগইন করুন");
      return navigate("/login");
    }

    // চেক করা সর্বোচ্চ ২টি অ্যাকাউন্ট হয়েছে কিনা
    if (accountCount >= maxAccounts) {
      Swal.fire({
        icon: "warning",
        title: "সর্বোচ্চ অ্যাকাউন্ট সীমা অতিক্রম!",
        html: `
          <div class="text-center">
            <div class="text-5xl mb-3">⚠️</div>
            <p class="font-bold text-gray-800">আপনি সর্বোচ্চ ${maxAccounts}টি অ্যাকাউন্ট যোগ করতে পারবেন</p>
            <p class="text-sm text-gray-600 mt-2">আপনার বর্তমানে <strong class="text-green-600">${accountCount}</strong>টি অ্যাকাউন্ট আছে</p>
            <p class="text-xs text-gray-500 mt-3">একাউন্ট লিস্ট থেকে পুরাতন অ্যাকাউন্ট ডিলিট করে নতুন যোগ করতে পারেন</p>
          </div>
        `,
        confirmButtonText: "একাউন্ট লিস্ট দেখুন",
        confirmButtonColor: "#16a34a"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/account_list");
        }
      });
      return;
    }

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await fetch(
        "https://investify-backend.vercel.app/api/accounts/add",
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

  // চেকিং স্টেট
  if (checkingCount) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <FaSpinner className="animate-spin text-3xl text-green-600" />
      </div>
    );
  }

  // সর্বোচ্চ অ্যাকাউন্ট পূর্ণ হলে দেখানো UI
  const isMaxAccountsReached = accountCount >= maxAccounts;

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
          <h2 className="text-xl font-bold text-green-800">অ্যাকাউন্ট যোগ করুন</h2>
          <button
            onClick={goToAccountList}
            className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center active:bg-green-200 transition ml-auto"
            title="অ্যাকাউন্ট লিস্ট দেখুন"
          >
            <FaList className="text-green-600 text-sm" />
          </button>
        </div>

        {/* অ্যাকাউন্ট কাউন্ট কার্ড */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 shadow-md mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs mb-0.5">আপনার অ্যাকাউন্ট</p>
              <p className="text-white font-bold text-2xl">{accountCount} / {maxAccounts}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-xl">
              <FaWallet className="text-white text-xl" />
            </div>
          </div>
          <div className="mt-2 w-full bg-white/20 rounded-full h-1.5">
            <div
              className="bg-white rounded-full h-1.5 transition-all duration-500"
              style={{ width: `${(accountCount / maxAccounts) * 100}%` }}
            ></div>
          </div>
          <p className="text-white/60 text-[10px] mt-2">
            {maxAccounts - accountCount}টি অ্যাকাউন্ট বাকি যোগ করার
          </p>
        </div>

        {/* সীমা অতিক্রমের সতর্কতা */}
        {isMaxAccountsReached && (
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-5">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-amber-600 text-lg mt-0.5" />
              <div className="flex-1">
                <p className="text-amber-800 font-semibold text-sm">সর্বোচ্চ সীমা পূর্ণ!</p>
                <p className="text-amber-700 text-xs mt-1">
                  আপনি সর্বোচ্চ {maxAccounts}টি অ্যাকাউন্ট যোগ করেছেন।
                  নতুন অ্যাকাউন্ট যোগ করতে চাইলে আগের কোনো অ্যাকাউন্ট ডিলিট করুন।
                </p>
                <button
                  onClick={goToAccountList}
                  className="mt-2 text-amber-700 text-xs font-semibold underline"
                >
                  অ্যাকাউন্ট লিস্ট দেখুন →
                </button>
              </div>
            </div>
          </div>
        )}

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

        {/* ফর্ম কার্ড - শুধু সীমা পূর্ণ না হলে দেখাবে */}
        {!isMaxAccountsReached && (
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

            {/* অ্যাকাউন্ট নাম - শুধুমাত্র পঠনযোগ্য (readonly) */}
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
                  readOnly
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/* হোল্ডার নাম */}
            <div className="mb-4">
              <label className="block text-green-800 text-sm font-semibold mb-2">
                ব্যবহারকারীর নাম
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
                  <p className="text-green-700 text-[10px]">✓ সর্বোচ্চ {maxAccounts}টি অ্যাকাউন্ট যোগ করা যাবে</p>
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
        )}

        {/* যদি সীমা পূর্ণ হয়, অ্যাকাউন্ট লিস্ট বাটন দেখাবে */}
        {isMaxAccountsReached && (
          <div className="bg-white rounded-xl shadow-md border border-green-100 p-5 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaList className="text-amber-600 text-2xl" />
            </div>
            <h3 className="text-gray-800 font-bold mb-2">অ্যাকাউন্ট লিস্ট দেখুন</h3>
            <p className="text-gray-500 text-xs mb-4">
              আপনার বর্তমানে {accountCount}টি অ্যাকাউন্ট আছে।
              নতুন অ্যাকাউন্ট যোগ করতে একটি অ্যাকাউন্ট ডিলিট করুন।
            </p>
            <button
              onClick={goToAccountList}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm transition active:scale-95"
            >
              অ্যাকাউন্ট লিস্ট দেখুন
            </button>
          </div>
        )}

        {/* ফুটার */}
        <div className="text-center mt-5">
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
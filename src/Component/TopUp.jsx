// TopUp.jsx - Green Agriculture Theme
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaWallet, FaArrowRight, FaLeaf, FaTractor, FaSeedling, FaArrowLeft } from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import Swal from "sweetalert2";
import useUser from "../hooks/useUsers";

const TopUp = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const { user } = useUser();
  const navigate = useNavigate();

  const MINIMUM_AMOUNT = 400;
  const quickAmounts = [400, 700, 1500, 2500, 6000, 15000];

  // কুইক অ্যামাউন্ট ক্লিক করলে ফিল্ডে বসানো
  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString()); // অটো ফিল্ডে বসানো
  };

  // কাস্টম ইনপুট চেঞ্জ
  const handleCustomChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  // ফাইনাল অ্যামাউন্ট পাওয়া
  const getFinalAmount = () => {
    if (customAmount && parseFloat(customAmount) > 0) {
      return parseFloat(customAmount);
    }
    if (selectedAmount) {
      return selectedAmount;
    }
    return null;
  };

  // ভ্যালিডেশন
  const validateAmount = (amount) => {
    if (!amount) {
      Swal.fire({
        title: "পরিমাণ নির্বাচন করুন!",
        text: "দয়া করে একটি পরিমাণ নির্বাচন করুন",
        icon: "warning",
        confirmButtonColor: "#059669",
        confirmButtonText: "ঠিক আছে"
      });
      return false;
    }

    if (amount < MINIMUM_AMOUNT) {
      Swal.fire({
        title: `ন্যূনতম রিচার্জ ৳${MINIMUM_AMOUNT}`,
        text: `আমাদের ন্যূনতম রিচার্জের পরিমাণ ৳${MINIMUM_AMOUNT}। দয়া করে ${MINIMUM_AMOUNT} টাকা অথবা তার বেশি রিচার্জ করুন।`,
        icon: "error",
        confirmButtonColor: "#f59e0b",
        confirmButtonText: "বুঝেছি"
      });
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    const amount = getFinalAmount();
    if (!validateAmount(amount)) {
      return;
    }
    
    // Confirmation before proceeding
    Swal.fire({
      title: "রিচার্জ নিশ্চিত করুন",
      html: `
        <div class="text-center">
          <div class="text-4xl mb-2">💰</div>
          <p class="text-lg font-bold">পরিমাণ: ৳${amount}</p>
          <p class="text-sm text-gray-600 mt-2">আপনি কি ${amount} টাকা রিচার্জ করতে চান?</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, রিচার্জ করুন",
      cancelButtonText: "না, ফিরুন",
      confirmButtonColor: "#059669",
      cancelButtonColor: "#ef4444"
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/recharge", { state: { amount: amount } });
      }
    });
  };

  // ইনপুট ফিল্ডে ভ্যালু দেখানোর জন্য ইফেক্ট
  useEffect(() => {
    if (selectedAmount) {
      setCustomAmount(selectedAmount.toString());
    }
  }, [selectedAmount]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="max-w-md mx-auto px-4 py-5">

        {/* হেডার */}
        <div className="text-center mb-5">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center active:bg-green-200 transition absolute left-4 top-5"
          >
            <FaArrowLeft className="text-green-700 text-sm" />
          </button>
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg mb-2">
            <FaLeaf className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-green-800">রিচার্জ</h1>
          <p className="text-green-600 text-xs">আপনার অ্যাকাউন্ট রিচার্জ করুন</p>
        </div>

        {/* ব্যালেন্স কার্ড */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 shadow-md mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs mb-0.5">বর্তমান ব্যালেন্স</p>
              <p className="text-white text-2xl font-bold">৳ {user?.balance?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-xl">
              <FaWallet className="text-white text-xl" />
            </div>
          </div>
        </div>

        {/* মিনিমাম অ্যালার্ট */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-amber-600 text-sm">⚠️</span>
            <p className="text-amber-700 text-xs">
              <span className="font-semibold">নোট:</span> ন্যূনতম রিচার্জ ৳{MINIMUM_AMOUNT}
            </p>
          </div>
        </div>

        {/* স্ট্যাটাস বার */}
        <div className="flex items-center justify-between bg-green-100 rounded-lg px-3 py-2 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
              <FaBangladeshiTakaSign className="text-white text-xs" />
            </div>
            <span className="text-green-800 text-sm font-medium">বাংলাদেশী টাকা (BDT)</span>
          </div>
          <div className="text-green-700 text-[10px] bg-green-200 px-2 py-0.5 rounded-full">সক্রিয়</div>
        </div>

        {/* কুইক অ্যামাউন্ট */}
        <div className="mb-5">
          <h2 className="text-green-800 text-sm font-semibold mb-2">দ্রুত পরিমাণ</h2>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  selectedAmount === amount || parseFloat(customAmount) === amount
                    ? "bg-green-600 text-white shadow-md scale-105"
                    : "bg-white border border-green-200 text-green-700 hover:bg-green-50"
                }`}
              >
                ৳ {amount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* কাস্টম অ্যামাউন্ট */}
        <div className="mb-5">
          <label className="text-green-700 text-xs font-medium mb-1 block">
            নিজস্ব পরিমাণ <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 font-bold">৳</span>
            <input
              type="number"
              value={customAmount}
              onChange={handleCustomChange}
              placeholder={`ন্যূনতম ৳${MINIMUM_AMOUNT}`}
              className="w-full bg-white border border-green-200 rounded-lg py-2.5 pl-8 pr-3 text-green-800 text-sm placeholder:text-green-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
              min={MINIMUM_AMOUNT}
            />
          </div>
          {customAmount && parseFloat(customAmount) < MINIMUM_AMOUNT && (
            <p className="text-red-500 text-[10px] mt-1">
              ⚠️ ন্যূনতম ৳{MINIMUM_AMOUNT} টাকা রিচার্জ করতে হবে
            </p>
          )}
        </div>

        {/* কন্টিনিউ বাটন */}
        <button
          onClick={handleContinue}
          disabled={!customAmount || parseFloat(customAmount) < MINIMUM_AMOUNT}
          className={`w-full py-3 rounded-xl text-white font-bold text-base flex items-center justify-center gap-2 shadow-md transition-all duration-200 active:scale-95 mb-4 ${
            !customAmount || parseFloat(customAmount) < MINIMUM_AMOUNT
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          }`}
        >
          চালিয়ে যান
          <FaArrowRight className="text-sm" />
        </button>

        {/* রিচার্জ সাবধানতা */}
        <div className="bg-green-50 rounded-lg p-3 border border-green-200 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <FaSeedling className="text-green-600 text-sm" />
            <h3 className="text-green-800 text-xs font-semibold">রিচার্জ নির্দেশিকা</h3>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-start gap-1.5">
              <span className="text-green-500 text-xs">✓</span>
              <p className="text-green-700 text-[10px]">ন্যূনতম রিচার্জ: ৳{MINIMUM_AMOUNT}</p>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-green-500 text-xs">✓</span>
              <p className="text-green-700 text-[10px]">রিচার্জ কমপ্লিট হতে 1-60 মিনিট সময় লাগতে পারে</p>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-green-500 text-xs">✓</span>
              <p className="text-green-700 text-[10px]">কোনো সমস্যায় সাপোর্টে যোগাযোগ করুন</p>
            </div>
          </div>
        </div>

        {/* ফুটার */}
        <div className="text-center">
          <div className="flex justify-center gap-3 mb-2">
            <FaTractor className="text-green-400 text-xs" />
            <FaLeaf className="text-green-500 text-xs" />
            <FaSeedling className="text-green-600 text-xs" />
          </div>
          <p className="text-gray-400 text-[10px]">সুরক্ষিত লেনদেন | ২৪/৭ কাস্টমার সাপোর্ট</p>
          <p className="text-gray-300 text-[9px] mt-1">AgroFund - আপনার কৃষি সঙ্গী</p>
        </div>

      </div>
    </div>
  );
};

export default TopUp;
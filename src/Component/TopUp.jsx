// TopUp.jsx - Compact & Modern Design
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogleWallet, FaArrowRight } from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { SiZabka } from "react-icons/si";
import useUser from "../hooks/useUsers";

const TopUp = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [activeChannel, setActiveChannel] = useState("autopay");
  const { user } = useUser();
  const navigate = useNavigate();

  const quickAmounts = [650, 1300, 3250, 6500, 13000, 32500];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const getFinalAmount = () => {
    if (customAmount && parseFloat(customAmount) > 0) {
      return parseFloat(customAmount);
    }
    if (selectedAmount) {
      return selectedAmount;
    }
    return null;
  };

  const handleContinue = () => {
    const amount = getFinalAmount();
    if (!amount) {
      // Show toast or alert
      return;
    }
    navigate("/recharge", { state: { amount: amount } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-4 px-3">
      <div className="max-w-sm mx-auto">
        {/* Header - Compact */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg mb-2">
            <FaGoogleWallet className="text-white text-2xl" />
          </div>
          <h1 className="text-xl font-bold text-white">রিচার্জ</h1>
        </div>

        {/* Balance Card - Compact */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-3 shadow-lg mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs mb-0.5">বর্তমান ব্যালেন্স</p>
              <p className="text-white text-2xl font-bold">৳ {user?.balance?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <FaBangladeshiTakaSign className="text-white text-xl" />
            </div>
          </div>
        </div>

        {/* Currency Badge - Compact */}
        <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-lg p-2 mb-4 border border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-500/20 rounded-md flex items-center justify-center">
              <span className="text-amber-400 font-bold text-sm">৳</span>
            </div>
            <span className="text-white text-sm font-medium">কারেন্সি পেমেন্ট</span>
          </div>
          <div className="text-green-400 text-[10px] bg-green-400/10 px-2 py-0.5 rounded-full">সক্রিয়</div>
        </div>

        {/* Quick Amount - Compact Grid */}
        <div className="mb-4">
          <h2 className="text-white/80 text-sm font-medium mb-2">পরিমাণ নির্বাচন</h2>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  selectedAmount === amount
                    ? "bg-amber-500 text-white shadow-md scale-105"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                ৳ {amount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount - Compact */}
        <div className="mb-4">
          <label className="text-white/60 text-xs mb-1 block">নিজস্ব পরিমান</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 font-bold text-lg">৳</span>
            <input
              type="number"
              value={customAmount}
              onChange={handleCustomChange}
              placeholder="০"
              className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-8 pr-3 text-white text-base placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition"
            />
          </div>
        </div>

        {/* Channel - Compact */}
        <div className="mb-4">
          <h2 className="text-white/80 text-sm font-medium mb-2">রিচার্জ চ্যানেল</h2>
          <div
            onClick={() => setActiveChannel("autopay")}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              activeChannel === "autopay"
                ? "bg-amber-500/20 border border-amber-400"
                : "bg-white/5 border border-white/10"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <SiZabka className="text-amber-400 text-lg" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">অটোপে</p>
                <p className="text-white/40 text-[10px]">স্বয়ংক্রিয় - দ্রুত পেমেন্ট</p>
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 ${
              activeChannel === "autopay" ? "border-amber-400 bg-amber-400" : "border-white/30"
            }`}></div>
          </div>
        </div>

        {/* Continue Button - Compact */}
        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 py-3 rounded-lg text-white font-bold text-base flex items-center justify-center gap-2 hover:shadow-xl transition-all duration-200 hover:scale-[1.01] mb-4"
        >
          চালিয়ে যান <FaArrowRight className="text-sm" />
        </button>

        {/* Guide - Compact */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <h3 className="text-white/80 text-xs font-medium mb-1.5">রিচার্জ গাইড</h3>
          <div className="space-y-1.5">
            <div className="flex items-start gap-1.5">
              <span className="text-amber-400 text-xs font-bold">•</span>
              <p className="text-white/50 text-[10px]">সর্বনিম্ন ডিপোজিট ৳ ৬৫০</p>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-amber-400 text-xs font-bold">•</span>
              <p className="text-white/50 text-[10px]">৩০ মিনিটের মধ্যে ব্যালেন্স না পেলে সাপোর্টে যোগাযোগ করুন</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-slate-500 text-[9px]">সুরক্ষিত লেনদেন | ২৪/৭ সাপোর্ট</p>
        </div>
      </div>
    </div>
  );
};

export default TopUp;
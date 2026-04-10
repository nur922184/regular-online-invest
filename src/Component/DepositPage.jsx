// DepositPage.jsx - With copyable payment numbers and read-only amount field
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import useUser from "../hooks/useUsers";
import { FaCopy, FaCheck } from "react-icons/fa";

const DepositPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("bKash");
  const [copied, setCopied] = useState(false);

  // Auto-set amount from navigation state (read-only)
  useEffect(() => {
    if (location.state?.amount) {
      setAmount(location.state.amount.toString());
    }
  }, [location]);

  const paymentMethods = {
    bKash: {
      name: "বিকাশ",
      number: "017XXXXXXXX",
      icon: "https://i.ibb.co.com/gZpmSgNq/image.png"
    },
    nagad: {
      name: "নগদ",
      number: "017XXXXXXXX",
      icon: "https://i.ibb.co.com/m5YqjDpS/image.png"
    }
  };

  const handleCopyNumber = async () => {
    const currentNumber = paymentMethods[selectedMethod].number;
    try {
      await navigator.clipboard.writeText(currentNumber);
      setCopied(true);
      Swal.fire({
        title: "কপি হয়েছে!",
        text: `${paymentMethods[selectedMethod].name} নম্বরটি কপি করা হয়েছে`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      Swal.fire("কপি করতে ব্যর্থ হয়েছে", "আবার চেষ্টা করুন", "error");
    }
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) < 300) {
      Swal.fire("ন্যূনতম ৩০০ টাকা ডিপোজিট করতে হবে", "", "warning");
      return;
    }
    
    if (!transactionId) {
      Swal.fire("ট্রানজেকশন আইডি দিন", "", "warning");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const res = await fetch(
        "https://backend-project-invest.vercel.app/api/transactions/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,
            amount: parseFloat(amount),
            transactionId: transactionId,
            paymentMethod: paymentMethods[selectedMethod].name,
            phoneNumber: paymentMethods[selectedMethod].number,
            status: "pending"
          })
        }
      );
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message);
      
      Swal.fire({
        title: "সফল!",
        text: "আপনার ট্রানজেকশন সাবমিট হয়েছে। এডমিন এপ্রুভ করার পর ব্যালেন্স অ্যাড হবে।",
        icon: "success",
        confirmButtonText: "ঠিক আছে"
      }).then(() => {
        setAmount("");
        setTransactionId("");
        navigate("/transition_history");
      });
      
    } catch (error) {
      Swal.fire("ত্রুটি!", error.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-4 px-3">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-white">ডিপোজিট করুন</h1>
          <p className="text-slate-400 text-xs">আপনার অ্যাকাউন্টে টাকা জমা করুন</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-3 shadow-lg mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs">বর্তমান ব্যালেন্স</p>
              <p className="text-white text-2xl font-bold">৳{user?.balance?.toLocaleString() || '0'}</p>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/10">
          <label className="block text-white/80 text-sm font-medium mb-2">
            পেমেন্ট মেথড সিলেক্ট করুন *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedMethod("bKash")}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedMethod === "bKash"
                  ? 'border-amber-400 bg-amber-500/20'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              <div className="text-center">
                <img 
                  className='w-8 h-8 mx-auto mb-1' 
                  src={paymentMethods.bKash.icon} 
                  alt="bKash" 
                />
                <div className={`font-semibold text-sm ${selectedMethod === "bKash" ? 'text-amber-400' : 'text-white/70'}`}>
                  বিকাশ
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod("nagad")}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedMethod === "nagad"
                  ? 'border-amber-400 bg-amber-500/20'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              <div className="text-center">
                <img 
                  className='w-8 h-8 mx-auto mb-1' 
                  src={paymentMethods.nagad.icon} 
                  alt="Nagad" 
                />
                <div className={`font-semibold text-sm ${selectedMethod === "nagad" ? 'text-amber-400' : 'text-white/70'}`}>
                  নগদ
                </div>
              </div>
            </button>
          </div>

          {/* Payment Info with Copy Button */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mt-4">
            <p className="text-xs text-white/60 text-center mb-2">
              {paymentMethods[selectedMethod].name} নম্বরে টাকা সেন্ড করুন:
            </p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-lg font-bold text-amber-400 text-center tracking-wider">
                {paymentMethods[selectedMethod].number}
              </p>
              <button
                type="button"
                onClick={handleCopyNumber}
                className="p-1.5 bg-amber-500/20 rounded-lg hover:bg-amber-500/30 transition-all duration-200"
              >
                {copied ? (
                  <FaCheck className="text-green-400 text-sm" />
                ) : (
                  <FaCopy className="text-amber-400 text-sm" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-white/40 text-center mt-2">
              নম্বরটি কপি করে পেমেন্ট করুন
            </p>
          </div>

          <form onSubmit={handleSubmitTransaction} className="space-y-4 mt-4">
            {/* Amount Field - Read Only */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">
                টাকার পরিমাণ *
              </label>
              <input
                type="number"
                value={amount}
                readOnly
                disabled
                className="w-full px-3 py-2 text-base bg-white/5 border border-white/20 rounded-lg text-white/50 cursor-not-allowed"
              />
              <p className="text-white/40 text-[10px] mt-1">
                পরিমাণ পরিবর্তন করতে চাইলে আগের পেইজে ফিরে যান
              </p>
            </div>

            {/* Transaction ID Field */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">
                ট্রানজেকশন আইডি *
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="TX123456789"
                className="w-full px-3 py-2 text-base bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition"
                required
              />
              <p className="text-white/40 text-[10px] mt-1">আপনার ট্রানজেকশন আইডি দিন</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-bold text-base hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>সাবমিট হচ্ছে...</span>
                </div>
              ) : (
                'সাবমিট করুন'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-slate-500 text-[9px]">সুরক্ষিত লেনদেন | ২৪/৭ সাপোর্ট</p>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
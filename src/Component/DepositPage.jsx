// components/DepositPage.jsx - আপডেটেড ভার্সন (টাইমআউট বন্ধের সুবিধা সহ)
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Swal from "sweetalert2";
import useUser from "../hooks/useUsers";
import {
  FaCopy,
  FaCheck,
  FaWallet,
  FaMobileAlt,
  FaArrowLeft,
  FaClock,
  FaShieldAlt,
  FaExclamationTriangle,
  FaInfoCircle,
  FaSpinner,
  FaLeaf,
  FaTractor,
  FaSeedling,
  FaUserCheck,
  FaSyncAlt
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const DepositPage = () => {
  const { user, refresh } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("bkash");
  const [copied, setCopied] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    if (location.state?.amount) {
      setAmount(location.state.amount.toString());
    }

    checkPendingTransaction();
    loadLastSubmissionTime();

    // টাইমার ইন্টারভাল
    const interval = setInterval(() => {
      if (lastSubmissionTime) {
        updateRemainingTime(lastSubmissionTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [location, user]);

  // পেন্ডিং ট্রানজেকশন চেক করা
  const checkPendingTransaction = async () => {
    if (!user?._id) return;

    try {
      setCheckingStatus(true);
      const res = await fetch(`https://investify-backend.vercel.app/api/transactions/user/${user._id}`);
      const data = await res.json();

      if (data.success && data.transactions) {
        const pendingTransactions = data.transactions.filter(t => t.status === "pending");

        if (pendingTransactions.length > 0) {
          const latestPending = pendingTransactions[0];
          const submitTime = localStorage.getItem(`last_deposit_${user._id}`);

          if (submitTime) {
            setLastSubmissionTime(parseInt(submitTime));
            updateRemainingTime(parseInt(submitTime));
          } else {
            // যদি লোকাল স্টোরেজে না থাকে তবুও টাইমার সেট করা
            setLastSubmissionTime(Date.now() - 30 * 60 * 1000); // 30 মিনিট আগে ধরে
            updateRemainingTime(Date.now() - 30 * 60 * 1000);
          }
        } else {
          // কোনো পেন্ডিং ট্রানজেকশন নেই, টাইমার রিসেট
          clearTimer();
        }
      }
    } catch (error) {
      console.error("Error checking pending transaction:", error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const loadLastSubmissionTime = () => {
    const lastTime = localStorage.getItem(`last_deposit_${user?._id}`);
    if (lastTime) {
      setLastSubmissionTime(parseInt(lastTime));
      updateRemainingTime(parseInt(lastTime));
    }
  };

  const updateRemainingTime = (lastTime) => {
    const oneHour = 60 * 60 * 1000;
    const timePassed = Date.now() - lastTime;
    const remaining = oneHour - timePassed;
    if (remaining > 0) {
      setRemainingSeconds(Math.floor(remaining / 1000));
    } else {
      setRemainingSeconds(0);
      // টাইমআউট শেষ হলে লোকাল স্টোরেজ ক্লিয়ার করা
      if (remaining <= 0) {
        localStorage.removeItem(`last_deposit_${user?._id}`);
      }
    }
  };

  // টাইমার রিসেট ফাংশন
  const clearTimer = () => {
    localStorage.removeItem(`last_deposit_${user?._id}`);
    setLastSubmissionTime(null);
    setRemainingSeconds(0);
  };

  // ট্রানজেকশন স্ট্যাটাস চেক করে টাইমার রিসেট করা
  const checkAndResetTimer = async () => {
    if (!user?._id) return;

    try {
      const res = await fetch(`https://investify-backend.vercel.app/api/transactions/user/${user._id}`);
      const data = await res.json();

      if (data.success && data.transactions) {
        const pendingTransactions = data.transactions.filter(t => t.status === "pending");

        // যদি কোনো পেন্ডিং ট্রানজেকশন না থাকে, টাইমার রিসেট
        if (pendingTransactions.length === 0) {
          clearTimer();
          Swal.fire({
            icon: "info",
            title: "আবার ডিপোজিট করতে পারবেন",
            text: "আপনার আগের ডিপোজিট প্রসেস সম্পন্ন হয়েছে। নতুন ডিপোজিট করতে পারেন।",
            confirmButtonColor: "#16a34a"
          });
        }
      }
    } catch (error) {
      console.error("Error checking status:", error);
    }
  };

  const methods = {
    bkash: {
      name: "বিকাশ",
      number: "01745624188",
      accountHolder: "Md. Abdur Rahman",
      icon: "https://i.ibb.co.com/gZpmSgNq/image.png",
      minAmount: 400,
      maxAmount: 50000,
      txnPattern: /^[A-Z0-9]{8,15}$/i,
      txnExample: "8X7X6X5X"
    },
    nagad: {
      name: "নগদ",
      number: "01345124414",
      accountHolder: "Md. Abdur Rahman",
      icon: "https://i.ibb.co.com/m5YqjDpS/image.png",
      minAmount: 400,
      maxAmount: 50000,
      txnPattern: /^[0-9]{6,12}$/,
      txnExample: "1234567890"
    }
  };

  const currentMethod = methods[selectedMethod];

  const validateTransactionId = (txnId) => {
    return currentMethod.txnPattern.test(txnId);
  };

  const validateAmount = (amt) => {
    const amountNum = parseFloat(amt);
    if (isNaN(amountNum)) return false;
    return amountNum >= currentMethod.minAmount && amountNum <= currentMethod.maxAmount;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
  };

  const canSubmitAgain = () => {
    if (!lastSubmissionTime) return true;
    const oneHour = 60 * 60 * 1000;
    const timePassed = Date.now() - lastSubmissionTime;
    return timePassed >= oneHour;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentMethod.number);
    setCopied(true);
    Swal.fire({
      title: "কপি হয়েছে!",
      text: `${currentMethod.name} নম্বর কপি করা হয়েছে`,
      icon: "success",
      timer: 1000,
      showConfirmButton: false,
      background: "#fff",
      iconColor: "#10b981"
    });
    setTimeout(() => setCopied(false), 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canSubmitAgain()) {
      Swal.fire({
        title: "অপেক্ষা করুন!",
        html: `
          <div class="text-center">
            <div class="text-6xl mb-3">⏰</div>
            <p class="font-bold text-gray-800">আপনার একটি পেন্ডিং ডিপোজিট আছে!</p>
            <p class="text-sm text-gray-600 mt-2">ডিপোজিট সম্পন্ন হতে অপেক্ষা করুন:</p>
            <p class="text-3xl font-bold text-orange-600 mt-2">${formatTime(remainingSeconds)}</p>
            <button id="checkStatusBtn" class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm">স্ট্যাটাস চেক করুন</button>
          </div>
        `,
        icon: "warning",
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: "বন্ধ করুন",
        didOpen: () => {
          const btn = document.getElementById("checkStatusBtn");
          if (btn) {
            btn.onclick = () => {
              Swal.close();
              checkAndResetTimer();
            };
          }
        }
      });
      return;
    }

    if (!amount || !validateAmount(amount)) {
      Swal.fire({
        title: "অবৈধ পরিমাণ!",
        html: `
          <div class="text-left">
            <p class="text-red-600 font-bold">❌ ন্যূনতম ${currentMethod.minAmount} টাকা</p>
            <p class="text-sm text-gray-600 mt-2">আপনি ${amount || 0} টাকা দিয়েছেন।</p>
            <p class="text-xs text-gray-500 mt-2">${currentMethod.name} এর জন্য ন্যূনতম ${currentMethod.minAmount} টাকা এবং সর্বোচ্চ ${currentMethod.maxAmount} টাকা ডিপোজিট করতে পারেন।</p>
          </div>
        `,
        icon: "warning",
        confirmButtonColor: "#f59e0b"
      });
      return;
    }

    if (!transactionId) {
      Swal.fire({
        title: "ট্রানজেকশন আইডি দিন!",
        text: `${currentMethod.name} এর ট্রানজেকশন আইডি অবশ্যই দিতে হবে`,
        icon: "warning",
        confirmButtonColor: "#f59e0b"
      });
      return;
    }

    if (!validateTransactionId(transactionId)) {
      Swal.fire({
        title: "অবৈধ ট্রানজেকশন আইডি!",
        html: `
          <div class="text-left">
            <p class="text-red-600 font-bold">❌ ভুল ফরম্যাট!</p>
            <p class="text-sm text-gray-600 mt-2">${currentMethod.name} এর ট্রানজেকশন আইডি: <strong>${currentMethod.txnExample}</strong></p>
            <p class="text-xs text-gray-500 mt-2">আপনার দেওয়া আইডি: <strong class="text-red-500">${transactionId}</strong></p>
          </div>
        `,
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("https://investify-backend.vercel.app/api/transactions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          amount: parseFloat(amount),
          transactionId: transactionId.toUpperCase(),
          paymentMethod: currentMethod.name,
          phoneNumber: currentMethod.number,
          accountHolder: currentMethod.accountHolder,
          status: "pending"
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const submitTime = Date.now();
      localStorage.setItem(`last_deposit_${user._id}`, submitTime.toString());
      setLastSubmissionTime(submitTime);

      Swal.fire({
        title: "ডিপোজিট সাবমিট হয়েছে! ✅",
        html: `
          <div class="text-center">
            <div class="text-6xl mb-3">💰</div>
            <p class="font-bold text-green-600">৳${parseFloat(amount).toLocaleString()} ডিপোজিট সাবমিট হয়েছে!</p>
            <div class="bg-green-50 p-3 rounded-lg mt-3">
              <p class="text-sm text-green-800">⏰ এডমিন অনুমোদনের জন্য অপেক্ষা করুন</p>
              <p class="text-xs text-gray-600 mt-1">আমাদের টিম আপনার ট্রানজেকশন যাচাই করছে</p>
            </div>
            <p class="text-xs text-gray-500 mt-3 font-mono">ট্রানজেকশন আইডি: ${transactionId}</p>
            <button id="checkStatusBtn2" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">স্ট্যাটাস চেক করুন</button>
          </div>
        `,
        icon: "success",
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: "বন্ধ করুন",
        didOpen: () => {
          const btn = document.getElementById("checkStatusBtn2");
          if (btn) {
            btn.onclick = () => {
              Swal.close();
              navigate("/transition_history");
            };
          }
        }
      });

      setTransactionId("");

    } catch (error) {
      Swal.fire({
        title: "ডিপোজিট ব্যর্থ!",
        text: error.message || "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isSubmitDisabled = submitting || !canSubmitAgain();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-md mx-auto px-4 py-4">

        {/* হেডার */}
        <div className="flex items-center justify-center relative mb-4">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center active:bg-green-200 transition"
          >
            <FaArrowLeft className="text-green-700 text-sm" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <FaWallet className="text-white text-lg" />
            </div>
            <h1 className="text-lg font-bold text-green-800">ডিপোজিট করুন</h1>
          </div>
          <button
            onClick={checkAndResetTimer}
            className="absolute right-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center active:bg-green-200 transition"
            title="স্ট্যাটাস চেক করুন"
          >
            <FaSyncAlt className="text-green-600 text-sm" />
          </button>
        </div>

        {/* ব্যালেন্স কার্ড */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl px-4 py-3 shadow-md mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-[10px]">বর্তমান ব্যালেন্স</p>
              <div className="flex items-center gap-1">
                <FaBangladeshiTakaSign className="text-white text-sm" />
                <p className="text-white font-bold text-xl">{user?.balance?.toLocaleString() || '0'}</p>
              </div>
            </div>
            <div className="bg-white/20 p-2 rounded-xl">
              <FaWallet className="text-white text-lg" />
            </div>
          </div>
        </div>

        {/* টাইমার নোটিশ */}
        {!canSubmitAgain() && remainingSeconds > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FaClock className="text-orange-600" />
              <span className="text-orange-800 font-semibold text-sm">পেন্ডিং ডিপোজিট!</span>
            </div>
            <p className="text-orange-700 text-xs text-center">
              আপনার একটি ডিপোজিট পেন্ডিং রয়েছে। সম্পন্ন হতে সময় লাগতে পারে:
            </p>
            <p className="text-orange-600 font-bold text-2xl text-center mt-2">
              {formatTime(remainingSeconds)}
            </p>
            <Link to={"/transition_history"}>
              <button
                onClick={checkAndResetTimer}
                className="w-full mt-3 py-1.5 bg-orange-600 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2"
              >
                <FaSyncAlt size={10} />
                স্ট্যাটাস চেক করুন
              </button>
            </Link>
          </div>
        )}

        {/* মেইন কার্ড */}
        <div className="bg-white rounded-xl shadow-md border border-green-100 p-4 mb-4">

          {/* মেথড সিলেক্ট */}
          <div className="flex gap-3 mb-4">
            {Object.keys(methods).map((key) => (
              <button
                key={key}
                onClick={() => !isSubmitDisabled && setSelectedMethod(key)}
                className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 transition ${selectedMethod === key
                    ? "border-green-600 bg-green-50 shadow-sm"
                    : "border-gray-200"
                  } ${isSubmitDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                disabled={isSubmitDisabled}
              >
                <img
                  src={methods[key].icon}
                  alt={methods[key].name}
                  className="w-6 h-6 object-contain"
                />
                <span className={`text-sm font-medium ${selectedMethod === key ? "text-green-700" : "text-gray-600"}`}>
                  {methods[key].name}
                </span>
              </button>
            ))}
          </div>

          {/* পেমেন্ট ইনফো */}
          <div className="bg-green-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FaMobileAlt className="text-green-600 text-xs" />
                <span className="text-green-700 text-xs">এই অ্যাকাউন্টে সেন্ট মানি করুন</span>
              </div>
              <button
                onClick={handleCopy}
                disabled={isSubmitDisabled}
                className="px-2 py-1 bg-white rounded-md text-green-600 text-xs flex items-center gap-1 hover:bg-green-50 transition disabled:opacity-50"
              >
                {copied ? <FaCheck size={10} /> : <FaCopy size={10} />}
                {copied ? "কপি হয়েছে" : "কপি"}
              </button>
            </div>
            <p className="text-green-700 font-bold text-center text-base tracking-wider">
              {currentMethod.number}
            </p>
            <p className="text-gray-500 text-[10px] text-center mt-1">
              অ্যাকাউন্ট হোল্ডার: {currentMethod.accountHolder}
            </p>
            <div className="flex justify-between mt-2 pt-2 border-t border-green-200">
              <span className="text-gray-500 text-xs">ডিপোজিট পরিমাণ</span>
              <div className="flex items-center gap-1">
                <FaBangladeshiTakaSign className="text-green-600 text-xs" />
                <span className="text-green-700 font-bold">{amount || '0'}</span>
              </div>
            </div>
          </div>

          {/* ইনফরমেশন বক্স */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <FaShieldAlt className="text-blue-500 text-sm mt-0.5" />
              <div>
                <p className="text-blue-800 text-xs font-semibold mb-1">✅ ডিপোজিট নির্দেশিকা:</p>
                <ul className="text-blue-700 text-[10px] space-y-1">
                  <li>• সঠিক নম্বরে সঠিক পরিমাণ টাকা পাঠান</li>
                  <li>• ট্রানজেকশন সম্পন্নের পর সঠিক TxnID দিন</li>
                  <li>• ন্যূনতম {currentMethod.minAmount} টাকা ডিপোজিট করতে হবে</li>
                  <li>• ভুল TxnID দিলে ডিপোজিট গ্রহণযোগ্য হবে না</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ফর্ম */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="text-gray-600 text-xs mb-1 block flex items-center gap-1">
                <FaInfoCircle className="text-gray-400" />
                ট্রানজেকশন আইডি (TxnID)
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                placeholder={`যেমন: ${currentMethod.txnExample}`}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 font-mono"
                disabled={isSubmitDisabled}
              />
              <p className="text-gray-400 text-[9px] mt-1">
                {currentMethod.name} অ্যাপ থেকে প্রাপ্ত ট্রানজেকশন আইডি
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`w-full py-2.5 rounded-lg font-medium text-sm transition active:scale-95 flex items-center justify-center gap-2 ${isSubmitDisabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-md"
                }`}
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" size={14} />
                  জমা হচ্ছে...
                </>
              ) : !canSubmitAgain() ? (
                <>
                  <FaClock size={12} />
                  {formatTime(remainingSeconds)}
                </>
              ) : (
                <>
                  <FaWallet size={12} />
                  ডিপোজিট জমা দিন
                </>
              )}
            </button>
          </form>
        </div>

        {/* সতর্কতা নোটিশ */}
        <div className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
          <div className="flex items-start gap-2">
            <FaExclamationTriangle className="text-amber-600 text-sm mt-0.5" />
            <div>
              <p className="text-amber-800 text-xs font-semibold">⚠️ সতর্কতা:</p>
              <p className="text-amber-700 text-[10px] leading-relaxed">
                সঠিক ট্রানজেকশন আইডি প্রদান করুন। ডিপোজিট অনুমোদিত বা বাতিল হলে আপনি আবার ডিপোজিট করতে পারবেন।
              </p>
            </div>
          </div>
        </div>

        {/* সাপোর্ট তথ্য */}
        <div className="text-center mt-4">
          <p className="text-gray-400 text-[9px]">
            📞 সমস্যায়: 01745624188 (সাপোর্ট টিম)
          </p>
        </div>

        {/* ফুটার */}
        <div className="text-center mt-4 pt-3 border-t border-green-100">
          <div className="flex justify-center gap-2 mb-1">
            <FaLeaf className="text-green-400 text-xs" />
            <FaSeedling className="text-green-500 text-xs" />
            <FaTractor className="text-green-600 text-xs" />
          </div>
          <p className="text-gray-400 text-[9px]">AgroFund - আপনার কৃষি সঙ্গী</p>
        </div>

      </div>
    </div>
  );
};

export default DepositPage;
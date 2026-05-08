// WithdrawPage.jsx - আপডেটেড (সাবমিট বাটনে ডিপোজিট চেক)

import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaLock,
  FaWallet,
  FaTractor,
  FaLeaf,
  FaSeedling,
  FaCheckCircle,
  FaSpinner,
  FaMoneyBillWave,
  FaEye,
  FaEyeSlash,
  FaInfoCircle,
  FaMoneyBill,
  FaTimesCircle
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import useUser from "../hooks/useUsers";

const WithdrawPage = () => {
  const { user, refetchUser } = useUser();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingDeposit, setCheckingDeposit] = useState(false); // শুধু সাবমিট এ চেক করবে

  const hasLoaded = useRef(false);
  const isMaxAccountReached = accounts.length >= 2;

  const [form, setForm] = useState({
    amount: "",
    password: ""
  });

  // ✅ সার্ভিস চার্জ ১৩%
  const AMOUNT = Number(form.amount) || 0;
  const SERVICE_CHARGE = AMOUNT * 0.13;
  const TOTAL_DEDUCTION = AMOUNT + SERVICE_CHARGE;
  const REMAINING_BALANCE = user?.balance - TOTAL_DEDUCTION;

  // ✅ ডিপোজিট চেক করার ফাংশন (শুধু সাবমিট এ কল হবে)
  const checkUserDeposit = async () => {
    try {
      const res = await fetch(`https://investify-backend.vercel.app/api/transactions/user/${user._id}`);
      const data = await res.json();
      const transactions = data?.transactions || [];
      
      // চেক করা কোন অ্যাপ্রুভড ডিপোজিট আছে কিনা
      const hasApprovedDeposit = transactions.some(t => t.type === "deposit" && t.status === "approved");
      return hasApprovedDeposit;
    } catch (error) {
      console.error("Error checking deposit:", error);
      return false;
    }
  };

  useEffect(() => {
    if (!user) return;
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      loadAccounts();
    }
  }, [user]);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://investify-backend.vercel.app/api/accounts/user/${user._id}`);
      const data = await res.json();

      if (!data.accounts || data.accounts.length === 0) {
        Swal.fire({
          title: "অ্যাকাউন্ট নেই!",
          text: "প্রথমে অ্যাকাউন্ট যোগ করুন",
          icon: "warning",
          confirmButtonColor: "#16a34a"
        }).then(() => navigate("/add_account"));
        setAccounts([]);
      } else {
        setAccounts(data.accounts);
        if (data.accounts.length > 0 && !selectedAccount) {
          setSelectedAccount(data.accounts[0]);
        }
      }
    } catch (error) {
      console.error("Error loading accounts:", error);
      Swal.fire("Error", "Account load failed", "error");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    setForm({ ...form, accountId: account._id });
  };

  const getAccountIcon = (type) => {
    switch (type) {
      case "bkash":
        return <FaBangladeshiTakaSign className="text-pink-500 text-xl" />;
      case "nagad":
        return <FaBangladeshiTakaSign className="text-orange-500 text-xl" />;
      default:
        return <FaMoneyBillWave className="text-green-500 text-xl" />;
    }
  };

  const getAccountName = (type) => {
    switch (type) {
      case "bkash": return "বিকাশ";
      case "nagad": return "নগদ";
      default: return type;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAccount) {
      return Swal.fire("অ্যাকাউন্ট সিলেক্ট করুন", "", "warning");
    }

    if (!form.amount || !form.password) {
      return Swal.fire("সব তথ্য দিন", "", "warning");
    }

    const withdrawAmount = Number(form.amount);

    if (withdrawAmount <= 0) {
      return Swal.fire("ভুল!", "সঠিক amount দিন", "warning");
    }

    if (withdrawAmount < 200) {
      return Swal.fire("ন্যূনতম ২০০ টাকা উত্তোলন করতে হবে", "", "warning");
    }

    if (TOTAL_DEDUCTION > user.balance) {
      return Swal.fire({
        icon: "error",
        title: "পর্যাপ্ত ব্যালেন্স নেই",
        html: `
          <div class="text-left">
            <p>উত্তোলন: ৳${withdrawAmount.toFixed(2)}</p>
            <p>সার্ভিস চার্জ (১৩%): ৳${SERVICE_CHARGE.toFixed(2)}</p>
            <p class="font-bold text-red-600">মোট প্রয়োজন: ৳${TOTAL_DEDUCTION.toFixed(2)}</p>
            <p class="text-gray-600 mt-2">আপনার ব্যালেন্স: ৳${user.balance.toLocaleString()}</p>
            <p class="text-red-500 text-sm mt-2">অভাব: ৳${(TOTAL_DEDUCTION - user.balance).toFixed(2)}</p>
          </div>
        `,
        confirmButtonColor: "#ef4444"
      });
      return;
    }

    // ✅ সাবমিট বাটন টিপলে ডিপোজিট চেক করা হবে
    setCheckingDeposit(true);
    try {
      const hasDeposit = await checkUserDeposit();
      
      if (!hasDeposit) {
        Swal.fire({
          icon: "warning",
          title: "প্রথমে ডিপোজিট করুন!",
          html: `
            <div class="text-center">
              <div class="text-6xl mb-3">💰</div>
              <p class="text-gray-800 font-semibold mb-2">আপনি এখনো ডিপোজিট করেননি!</p>
              <p class="text-sm text-gray-600">উত্তোলন করতে হলে আপনাকে <span class="font-bold text-green-600">অন্তত একবার ডিপোজিট</span> করতে হবে।</p>
              <div class="bg-yellow-50 p-3 rounded-lg mt-3">
                <p class="text-xs text-gray-600">ডিপোজিট করার পর আপনি উত্তোলন করতে পারবেন।</p>
              </div>
            </div>
          `,
          confirmButtonText: "ডিপোজিট পেজে যান",
          confirmButtonColor: "#16a34a",
          cancelButtonText: "পরে",
          showCancelButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/topup");
          }
        });
        setCheckingDeposit(false);
        return;
      }
    } catch (error) {
      console.error("Error checking deposit:", error);
      Swal.fire("ত্রুটি!", "ডিপোজিট চেক করতে সমস্যা হয়েছে", "error");
      setCheckingDeposit(false);
      return;
    }

    // যদি ডিপোজিট থাকে তাহলে উত্তোলন প্রসেস চালিয়ে যাওয়া
    try {
      setSubmitting(true);

      const res = await fetch("https://investify-backend.vercel.app/api/withdrawals/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          amount: withdrawAmount,
          accountId: selectedAccount._id,
          password: form.password,
          serviceCharge: SERVICE_CHARGE,
          totalDeduction: TOTAL_DEDUCTION
        })
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          html: `
            <div class="text-left">
              <p class="font-bold text-green-700 mb-2">✅ উত্তোলন রিকোয়েস্ট সাবমিট হয়েছে</p>
              <div class="bg-green-50 p-3 rounded-lg mt-3">
                <div class="flex justify-between">
                  <span>উত্তোলন পরিমাণ:</span>
                  <span class="font-bold">৳${withdrawAmount.toFixed(2)}</span>
                </div>
                <div class="flex justify-between mt-1">
                  <span>সার্ভিস চার্জ (১৩%):</span>
                  <span class="text-orange-600">৳${SERVICE_CHARGE.toFixed(2)}</span>
                </div>
                <div class="flex justify-between mt-1 pt-1 border-t border-green-200">
                  <span class="font-bold">মোট কাটা:</span>
                  <span class="font-bold text-red-600">৳${TOTAL_DEDUCTION.toFixed(2)}</span>
                </div>
                <div class="flex justify-between mt-2">
                  <span>নতুন ব্যালেন্স:</span>
                  <span class="font-bold text-green-600">৳${(user.balance - TOTAL_DEDUCTION).toFixed(2)}</span>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
                ⏱️ এডমিন অ্যাপ্রুভ করার পর টাকা পাঠানো হবে (1-24 ঘন্টা)
              </p>
            </div>
          `,
          confirmButtonColor: "#16a34a"
        });

        refetchUser && refetchUser();
        navigate("/withdrawHistory");
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      Swal.fire("ত্রুটি!", err.message, "error");
    } finally {
      setSubmitting(false);
      setCheckingDeposit(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-green-600 text-3xl mx-auto mb-3" />
          <p className="text-green-600 text-sm">লোড হচ্ছে...</p>
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
          <h2 className="text-xl font-bold text-green-800">উত্তোলন</h2>
          <FaTractor className="text-green-600 ml-auto text-sm" />
        </div>

        {/* ব্যালেন্স কার্ড */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 shadow-md mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs mb-0.5">বর্তমান ব্যালেন্স</p>
              <div className="flex items-center gap-1">
                <FaBangladeshiTakaSign className="text-white text-sm" />
                <p className="text-white text-2xl font-bold">{user?.balance?.toLocaleString() || 0}</p>
              </div>
            </div>
            <div className="bg-white/20 p-2 rounded-xl">
              <FaWallet className="text-white text-xl" />
            </div>
          </div>
        </div>

        {/* অ্যাকাউন্ট সিলেক্ট */}
        <div className="mb-5">
          <label className="block text-green-800 text-sm font-semibold mb-2">
            অ্যাকাউন্ট নির্বাচন করুন
          </label>

          {accounts.length === 0 ? (
            <div className="text-center py-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm">কোন অ্যাকাউন্ট নেই</p>
              <Link to="/add_account">
                <button className="mt-2 text-green-600 text-sm font-medium">
                  + অ্যাকাউন্ট যোগ করুন
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {accounts.map((account) => (
                <div
                  key={account._id}
                  onClick={() => handleAccountSelect(account)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedAccount?._id === account._id
                      ? "border-green-500 bg-green-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-green-300"
                    }`}
                >
                  <div className="text-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${selectedAccount?._id === account._id
                        ? "bg-green-100"
                        : "bg-gray-50"
                      }`}>
                      {getAccountIcon(account.accountType)}
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm">
                      {getAccountName(account.accountType)}
                    </h3>
                    <p className="text-gray-500 text-[10px] mt-0.5">
                      {account.accountNumber}
                    </p>
                    {selectedAccount?._id === account._id && (
                      <span className="inline-block mt-1 text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                        নির্বাচিত
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ফর্ম কার্ড */}
        {accounts.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-green-100 p-5 mb-5">

            {/* টাকার পরিমাণ */}
            <div className="mb-4">
              <label className="block text-green-800 text-sm font-semibold mb-2">
                টাকার পরিমাণ
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 font-bold">৳</span>
                <input
                  type="number"
                  placeholder="ন্যূনতম ২০০ টাকা"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full pl-8 pr-3 py-2.5 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm placeholder:text-green-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[200, 500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setForm({ ...form, amount: amt })}
                    className="flex-1 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-green-100 transition"
                  >
                    ৳{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* পাসওয়ার্ড */}
            <div className="mb-5">
              <label className="block text-green-800 text-sm font-semibold mb-2">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <FaLock className="text-green-500 text-xs" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="আপনার পাসওয়ার্ড দিন"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-9 pr-9 py-2.5 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm placeholder:text-green-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            {/* উত্তোলন সারাংশ */}
            {form.amount && Number(form.amount) >= 200 && (
              <div className="bg-green-50 rounded-lg p-3 mb-5">
                <p className="text-green-800 text-xs font-semibold mb-2 flex items-center gap-1">
                  <FaMoneyBill className="text-green-600" />
                  উত্তোলন সারাংশ
                </p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">উত্তোলন পরিমাণ:</span>
                    <span className="text-green-800 font-semibold">৳{AMOUNT.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">সার্ভিস চার্জ (১৩%):</span>
                    <span className="text-orange-600 font-semibold">৳{SERVICE_CHARGE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1 border-t border-green-200">
                    <span className="text-green-800 font-semibold">মোট কাটা:</span>
                    <span className="text-red-600 font-bold">৳{TOTAL_DEDUCTION.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">নতুন ব্যালেন্স:</span>
                    <span className={`font-semibold ${REMAINING_BALANCE >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ৳{REMAINING_BALANCE >= 0 ? REMAINING_BALANCE.toFixed(2) : "0"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* বাটন */}
            <button
              onClick={handleSubmit}
              disabled={submitting || checkingDeposit}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-all active:scale-95 disabled:opacity-50 mb-3"
            >
              {submitting || checkingDeposit ? (
                <div className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  <span>{checkingDeposit ? "ডিপোজিট চেক করা হচ্ছে..." : "প্রসেসিং..."}</span>
                </div>
              ) : (
                "উত্তোলন করুন"
              )}
            </button>

            <Link to={isMaxAccountReached ? "#" : "/add_account"}>
              <button
                disabled={isMaxAccountReached}
                className={`w-full py-2 rounded-lg font-medium text-sm transition ${isMaxAccountReached
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
              >
                + নতুন অ্যাকাউন্ট যোগ করুন
              </button>
            </Link>
          </div>
        )}

        {/* তথ্য বক্স */}
        <div className="bg-green-100 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <FaCheckCircle className="text-green-600 text-sm mt-0.5" />
            <div>
              <p className="text-green-800 text-xs font-semibold mb-1">উত্তোলন নির্দেশিকা</p>
              <p className="text-green-700 text-[10px]">• ন্যূনতম উত্তোলন: ২০০ টাকা</p>
              <p className="text-green-700 text-[10px]">• সার্ভিস চার্জ: <span className="font-bold">১৩%</span></p>
              <p className="text-green-700 text-[10px]">• <span className="font-bold text-orange-600">ডিপোজিটের পরেই উত্তোলন করা যাবে</span></p>
              <p className="text-green-700 text-[10px]">• 1-24 ঘন্টার মধ্যে টাকা পাঠানো হবে</p>
              <p className="text-green-700 text-[10px]">• উত্তোলন + ১৩% চার্জ = মোট কাটা হবে</p>
            </div>
          </div>
        </div>

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

export default WithdrawPage;
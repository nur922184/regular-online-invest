// WithdrawPage.jsx - শুধুমাত্র Withdrawal Collection এ ডাটা সেভ হবে

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
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import useUser from "../hooks/useUsers";

const WithdrawPage = () => {
  const { user, refresh } = useUser();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingInvestment, setCheckingInvestment] = useState(false);
  const [hasPaidInvestment, setHasPaidInvestment] = useState(false);
  const [investmentChecked, setInvestmentChecked] = useState(false);

  const hasLoaded = useRef(false);
  const isMaxAccountReached = accounts.length >= 2;

  const [form, setForm] = useState({
    amount: "",
    password: ""
  });

  // সার্ভিস চার্জ ১৩%
  const AMOUNT = Number(form.amount) || 0;
  const SERVICE_CHARGE = AMOUNT * 0.13;
  const TOTAL_DEDUCTION = AMOUNT + SERVICE_CHARGE;
  const REMAINING_BALANCE = user?.balance - TOTAL_DEDUCTION;

  // ✅ পেইড ইনভেস্টমেন্ট চেক করা (শুধুমাত্র সাবমিটের সময়)
  const checkUserHasPaidInvestment = async () => {
    if (!user?._id) return false;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://investify-fixed.vercel.app/api/investments/user/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        console.error("API Error:", res.status);
        return false;
      }

      const data = await res.json();
      const investments = data?.investments || [];

      // চেক করা productType === "paid" আছে কিনা
      const hasPaid = investments.some(inv => inv.productType === "paid");
      setHasPaidInvestment(hasPaid);
      setInvestmentChecked(true);
      return hasPaid;
    } catch (error) {
      console.error("Error checking paid investment:", error);
      setInvestmentChecked(true);
      return false;
    }
  };

  useEffect(() => {
    if (!user) return;
    
    const init = async () => {
      if (!hasLoaded.current) {
        hasLoaded.current = true;
        await loadAccounts();
        // ❌ পেইড ইনভেস্টমেন্ট চেক করা হচ্ছে না (পেজ লোড হলে না)
        // checkUserHasPaidInvestment() - এটি সরানো হয়েছে
      }
    };
    init();
  }, [user]);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://investify-fixed.vercel.app/api/accounts/user/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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
    }

    // ✅ পেইড ইনভেস্টমেন্ট চেক করা (শুধুমাত্র সাবমিটের সময়)
    setCheckingInvestment(true);
    const hasPaid = await checkUserHasPaidInvestment();
    setCheckingInvestment(false);
    
    if (!hasPaid) {
      Swal.fire({
        icon: "info",
        title: "🛒 ডিপজিট করে একটি পণ্য ক্রয় করুন",
        html: `
          <div class="text-center">
            <div class="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl mb-3">
              <p class="text-amber-800 font-bold">প্রয়োজন: সক্রিয় পণ্য</p>
            </div>
            <p class="text-gray-700 text-sm mb-3">
              উত্তোলন করতে হলে ডিপজিট করে <span class="font-bold text-green-600">অন্তত একটি পেইড পণ্য</span> ক্রয় করতে হবে।
            </p>
            <button id="buy-product-btn" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition w-full">
              🛒 এখনই পণ্য কিনুন
            </button>
          </div>
        `,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: "পরে",
        cancelButtonColor: "#6b7280",
        didOpen: () => {
          const buyBtn = document.getElementById("buy-product-btn");
          if (buyBtn) {
            buyBtn.onclick = () => {
              Swal.close();
              navigate("/");
            };
          }
        }
      });
      return;
    }

    // ✅ শুধুমাত্র Withdrawal Collection-এ ডাটা সেভ হবে
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');

      const res = await fetch(`https://investify-fixed.vercel.app/api/withdrawals/request`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user._id,
          amount: withdrawAmount,
          accountId: selectedAccount._id,
          password: form.password,
          serviceCharge: SERVICE_CHARGE,
          totalDeduction: TOTAL_DEDUCTION,
          accountType: selectedAccount.accountType,
          accountNumber: selectedAccount.accountNumber,
          accountHolderName: selectedAccount.accountHolderName
        })
      });

      const data = await res.json();

      if (data.success) {
        // ✅ সফল হলে ইউজার ডাটা রিফ্রেশ
        if (refresh) await refresh();
        
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
              </div>
              <p class="text-xs text-gray-500 mt-3">
                ⏱️ এডমিন অনুমোদন সাপেক্ষে টাকা পাঠানো হবে (১-২৪ ঘন্টা)
              </p>
              <p class="text-xs text-green-600 mt-2">
                📌 ট্র্যাকিং আইডি: ${data.withdrawal?._id?.slice(-8) || 'N/A'}
              </p>
            </div>
          `,
          confirmButtonColor: "#16a34a"
        });

        // ফর্ম রিসেট
        setForm({ amount: "", password: "" });
        navigate("/withdrawHistory");
      } else {
        throw new Error(data.message || "উত্তোলন রিকোয়েস্ট ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.error("Withdraw error:", err);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: err.message || "উত্তোলন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // লোডিং স্টেট
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

        {/* ❌ পেইড ইনভেস্টমেন্ট ওয়ার্নিং সরানো হয়েছে - এখন শুধুমাত্র সাবমিটের সময় দেখাবে */}

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
                    className="flex-1 py-1.5 text-xs rounded-lg transition bg-gray-100 text-gray-700 hover:bg-green-100"
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
              disabled={submitting || checkingInvestment}
              className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all active:scale-95 disabled:opacity-50 mb-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              {submitting || checkingInvestment ? (
                <div className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  <span>{checkingInvestment ? "ইনভেস্টমেন্ট চেক করা হচ্ছে..." : "প্রসেসিং..."}</span>
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
        <div className="bg-green-100 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <FaCheckCircle className="text-green-600 text-sm mt-0.5" />
            <div>
              <p className="text-green-800 text-sm font-semibold mb-2">
                উত্তোলন নির্দেশিকা
              </p>
              <div className="space-y-1 text-green-700 text-[11px]">
                <p className="flex items-center gap-1 bg-white/50 p-2 rounded-lg">
                  <span className="text-lg">🛒</span>
                  <span><span className="font-bold text-green-800">পণ্য ক্রয়ের পরেই</span> উত্তোলন করা যাবে</span>
                </p>
                <p>
                  • ন্যূনতম উত্তোলন: <span className="font-bold">২০০ টাকা</span>
                </p>
                <p>
                  • সার্ভিস চার্জ: <span className="font-bold text-orange-600">১৩%</span>
                </p>
                <p>
                  • উত্তোলন + ১৩% চার্জ = মোট ব্যালেন্স থেকে কাটা হবে
                </p>
                <p>
                  • অনুমোদিত হতে <span className="font-bold">১-২৪ ঘন্টা</span> সময় লাগতে পারে
                </p>
                <Link to="/">
                  <button className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-center gap-2">
                    <span>🛒</span>
                    পণ্যের তালিকা দেখুন
                  </button>
                </Link>
              </div>
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
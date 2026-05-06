import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser,
  FaPhoneAlt,
  FaLock,
  FaUserFriends,
  FaArrowRight,
  FaSpinner,
  FaEyeSlash,
  FaEye,
  FaGift,
  FaLink,
  FaLeaf,
  FaTractor,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    referredBy: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [referralFromUrl, setReferralFromUrl] = useState(null);
  const [showReferralMessage, setShowReferralMessage] = useState(false);
  const [isReferralDisabled, setIsReferralDisabled] = useState(false);

  useEffect(() => {
    const refCode = new URLSearchParams(location.search).get("ref");
    if (refCode) {
      setReferralFromUrl(refCode);
      setForm(prev => ({ ...prev, referredBy: refCode }));
      setIsReferralDisabled(true);
      setShowReferralMessage(true);
    }
  }, [location]);

  const generateReferralCode = () => {
    return `AGRO${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "referredBy" && isReferralDisabled) return;
    
    setForm({ ...form, [name]: value });
    setErrorMessage("");
    setSuccessMessage("");
    
    if (name === "referredBy" && value) {
      setShowReferralMessage(!!(referralFromUrl && value === referralFromUrl));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const { name, phone, password, confirmPassword, referredBy } = form;

    if (!name || !phone || !password || !confirmPassword || !referredBy) {
      setErrorMessage("সব ফিল্ড পূরণ করুন");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("পাসওয়ার্ড মেলেনি");
      setLoading(false);
      return;
    }

    if (!/^(01[3-9]\d{8})|(\+8801[3-9]\d{8})$/.test(phone)) {
      setErrorMessage("সঠিক ফোন নম্বর দিন (017XXXXXXXX)");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("পাসওয়ার্ড ৬ অক্ষরের হতে হবে");
      setLoading(false);
      return;
    }

    const userRefCode = generateReferralCode();

    try {
      const response = await axios.post("https://investify-backend.vercel.app/api/users/register", {
        name, phone, password, referredBy,
        refCode: userRefCode,
      });

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("userId", response.data.user._id);
      }

      Swal.fire({
        icon: 'success',
        title: 'স্বাগতম!',
        background: '#ffffff',
        backdrop: true,
        html: `
          <div class="text-center">
            <div class="text-5xl mb-3">🌾</div>
            <p class="text-lg font-semibold text-gray-800 mb-2">অ্যাকাউন্ট তৈরি হয়েছে!</p>
            <div class="bg-green-50 rounded-lg p-3 my-3">
              <p class="text-sm text-gray-600">আপনার রেফারেল কোড</p>
              <p class="text-xl font-bold text-green-600 tracking-wider">${userRefCode}</p>
            </div>
            <p class="text-green-600 font-semibold">🎁 বোনাস: ৳৫০</p>
          </div>
        `,
        confirmButtonText: 'প্রোফাইলে যান',
        confirmButtonColor: '#059669',
        confirmButtonClass: 'px-6 py-2 rounded-lg',
      }).then(() => navigate('/profile'));

    } catch (err) {
      setErrorMessage(err.response?.data?.message || "নিবন্ধন ব্যর্থ হয়েছে");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* হেডার সেকশন - ব্লার ইফেক্ট সহ */}
      <div className="relative h-72 w-full overflow-hidden">
        {/* ব্যাকগ্রাউন্ড ইমেজ */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ 
            backgroundImage: `url('https://i.ibb.co.com/j1rBJPx/IMG-20260405-133227.png')`,
          }}
        />
        
        {/* গ্রেডিয়েন্ট ওভারলে */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        
        {/* প্যাটার্ন ওভারলে */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} />
        
        {/* কন্টেন্ট */}
        <div className="absolute bottom-8 left-6 right-6 animate-fadeInUp">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
              <FaLeaf className="text-white text-xl" />
            </div>
            <span className="text-white/80 font-extrabold text-lg tracking-wide">AgroFund</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">স্বাগতম!</h1>
          <p className="text-white/80 text-sm">নতুন অ্যাকাউন্ট তৈরি করুন ও বোনাস পান</p>
        </div>
      </div>

      {/* ফর্ম সেকশন - কার্ড স্টাইল */}
      <div 
        className="relative -mt-6 mx-4 bg-white rounded-2xl shadow-xl animate-slideUp"
        style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}
      >
        {/* সাকসেস মেসেজ */}
        {successMessage && (
          <div className="absolute -top-12 left-4 right-4 bg-green-500 text-white rounded-xl px-4 py-2 flex items-center gap-2 animate-fadeIn">
            <FaCheckCircle />
            <p className="text-sm flex-1">{successMessage}</p>
          </div>
        )}

        {/* এরর মেসেজ */}
        {errorMessage && (
          <div className="absolute -top-12 left-4 right-4 bg-red-500 text-white rounded-xl px-4 py-2 flex items-center gap-2 animate-fadeIn shadow-lg">
            <div className="w-1 h-8 bg-white/50 rounded-full"></div>
            <p className="text-sm flex-1">{errorMessage}</p>
          </div>
        )}

        {/* রেফারেল বোনাস মেসেজ */}
        {showReferralMessage && (
          <div className="mx-4 mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3 animate-fadeIn">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <FaGift className="text-amber-600" />
            </div>
            <div>
              <p className="text-amber-800 font-semibold text-sm">রেফারেল লিংক থেকে এসেছেন!</p>
              <p className="text-amber-600 text-xs">নিবন্ধন সম্পূর্ণ হলে বোনাস পাবেন <strong>৳৫০</strong></p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* নাম ফিল্ড */}
          <div className="group">
            <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">সম্পূর্ণ নাম</label>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-1 border border-gray-100 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all duration-200">
              <FaUser className="text-gray-400 group-focus-within:text-green-500" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="আপনার নাম লিখুন"
                className="bg-transparent outline-none w-full text-gray-700 placeholder:text-gray-400 text-sm"
              />
            </div>
          </div>

          {/* ফোন ফিল্ড */}
          <div className="group">
            <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">ফোন নম্বর</label>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-1 border border-gray-100 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all duration-200">
              <FaPhoneAlt className="text-gray-400 group-focus-within:text-green-500" />
              <span className="text-gray-500 font-medium text-sm">+88</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="017XXXXXXXX"
                className="bg-transparent outline-none w-full text-gray-700 placeholder:text-gray-400 text-sm"
              />
            </div>
          </div>

          {/* পাসওয়ার্ড ফিল্ড */}
          <div className="group">
            <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">পাসওয়ার্ড</label>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-1 border border-gray-100 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all duration-200">
              <FaLock className="text-gray-400 group-focus-within:text-green-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="কমপক্ষে ৬ অক্ষর"
                className="bg-transparent outline-none w-full text-gray-700 placeholder:text-gray-400 text-sm"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          {/* কনফার্ম পাসওয়ার্ড */}
          <div className="group">
            <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">কনফার্ম পাসওয়ার্ড</label>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-1 border border-gray-100 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all duration-200">
              <FaLock className="text-gray-400 group-focus-within:text-green-500" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="পাসওয়ার্ড পুনরায় দিন"
                className="bg-transparent outline-none w-full text-gray-700 placeholder:text-gray-400 text-sm"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-gray-600">
                {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          {/* রেফারেল কোড */}
          <div className="group">
            <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">
              রেফারেল কোড <span className="text-red-400">*</span>
              {isReferralDisabled && (
                <span className="ml-2 text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">লিংক থেকে</span>
              )}
            </label>
            <div className={`flex items-center gap-3 rounded-xl px-4 py-1 border transition-all duration-200 ${isReferralDisabled ? 'bg-gray-100 border-gray-200' : 'bg-gray-50 border-gray-100 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100'}`}>
              <FaUserFriends className={`text-gray-400 ${!isReferralDisabled && 'group-focus-within:text-green-500'}`} />
              <input
                type="text"
                name="referredBy"
                value={form.referredBy}
                onChange={handleChange}
                placeholder="রেফারেল কোড দিন"
                disabled={isReferralDisabled}
                className={`bg-transparent outline-none w-full text-sm uppercase ${isReferralDisabled ? 'text-gray-500' : 'text-gray-700 placeholder:text-gray-400'}`}
              />
              {referralFromUrl && form.referredBy === referralFromUrl && <FaLink className="text-green-500" size={14} />}
            </div>
          </div>

          {/* টার্মস */}
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="terms" className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500" required />
            <label htmlFor="terms" className="text-xs text-gray-500">
              আমি <span className="text-green-600 font-medium">শর্তাবলী</span> ও <span className="text-green-600 font-medium">গোপনীয়তা নীতি</span> মেনে নিচ্ছি
            </label>
          </div>

          {/* সাবমিট বাটন */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all duration-200 transform active:scale-98 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" size={18} />
                <span>নিবন্ধন হচ্ছে...</span>
              </>
            ) : (
              <>
                <span>নিবন্ধন করুন</span>
                <FaArrowRight size={14} />
              </>
            )}
          </button>

          {/* ডিভাইডার */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-gray-400 text-xs">অথবা</span>
            </div>
          </div>

          {/* লগইন লিংক */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full border-2 border-green-200 bg-green-50 hover:bg-green-100 text-green-700 py-1 rounded-xl font-semibold text-sm transition-all duration-200 transform active:scale-98"
          >
            লগইন করুন
          </button>
        </form>
      </div>

      {/* ফুটার */}
      <div className="text-center py-6">
        <p className="text-xs text-gray-400">
          <FaTractor className="inline mr-1 text-gray-400" size={12} />
          AgroFund - আপনার কৃষি সঙ্গী
        </p>
      </div>

      {/* অ্যানিমেশন স্টাইল */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default SignUp;
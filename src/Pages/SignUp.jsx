import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser,
  FaPhoneAlt,
  FaLock,
  FaUserFriends,
  FaCheckCircle,
  FaArrowRight,
  FaSpinner,
  FaEyeSlash,
  FaEye,
  FaGift,
  FaInfoCircle,
  FaLink,
  FaLeaf,
  FaTractor,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/logo.jpg"
const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    referredBy: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [referralFromUrl, setReferralFromUrl] = useState(null);
  const [showReferralMessage, setShowReferralMessage] = useState(false);
  const [showMissingMessage, setShowMissingMessage] = useState(false);

  // Get referral code from URL query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const refCode = queryParams.get("ref");
    
    if (refCode) {
      setReferralFromUrl(refCode);
      setForm(prev => ({ ...prev, referredBy: refCode }));
    }
  }, [location]);

  
  // Generate random referral code for new user
  const generateReferralCode = () => {
    const prefix = "AGRO";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}${timestamp}${random}`;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (errorMessage) setErrorMessage("");
    
    if (name === "referredBy") {
      if (!value) {
        setShowMissingMessage(true);
        setShowReferralMessage(false);
      } else {
        setShowMissingMessage(false);
        if (referralFromUrl && value === referralFromUrl) {
          setShowReferralMessage(true);
        } else {
          setShowReferralMessage(false);
        }
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "referredBy") {
      if (!value) {
        setShowMissingMessage(true);
        setShowReferralMessage(false);
      } else {
        setShowMissingMessage(false);
      }
    }
  };

  const handleFocus = (e) => {
    const { name, value } = e.target;
    if (name === "referredBy") {
      if (value) {
        setShowMissingMessage(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setShowSuccess(false);

    if (!form.name || !form.phone || !form.password) {
      setErrorMessage("দয়া করে নাম, ফোন নম্বর এবং পাসওয়ার্ড দিন");
      setLoading(false);
      return;
    }

    const phoneRegex = /^(01[3-9]\d{8})|(\+8801[3-9]\d{8})$/;
    if (!phoneRegex.test(form.phone)) {
      setErrorMessage("সঠিক ফোন নম্বর দিন (যেমন: 017XXXXXXXX)");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setErrorMessage("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      setLoading(false);
      return;
    }

    if (!form.referredBy) {
      setErrorMessage("রেফারেল কোড আবশ্যক! একটি রেফারেল কোড দিন");
      setLoading(false);
      setShowMissingMessage(true);
      return;
    }

    const userRefCode = generateReferralCode();
    
    try {
      const res = await axios.post(
        "https://backend-project-invest.vercel.app/api/users/register",
        {
          ...form,
          refCode: userRefCode,
          balance: 50
        }
      );

      const msg = res.data.message || "নিবন্ধন সফল হয়েছে!";
      setSuccessMessage(msg);
      setShowSuccess(true);

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("userId", res.data.user._id);
      }

      Swal.fire({
        icon: 'success',
        title: 'স্বাগতম!',
        html: `
          <div class="text-left">
            <p class="mb-2">🌾 আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!</p>
            <p class="mb-2">🌟 আপনার রেফারেল কোড: <strong class="text-green-600">${userRefCode}</strong></p>
            <p>💰 ওয়েলকাম বোনাস: <strong class="text-green-600">৳৫০</strong></p>
          </div>
        `,
        confirmButtonText: 'প্রোফাইলে যান',
        confirmButtonColor: '#059669',
        background: '#fff',
        iconColor: '#059669'
      }).then(() => {
        navigate('/profile');
      });

      setForm({
        name: "",
        phone: "",
        password: "",
        referredBy: "",
      });
      setShowReferralMessage(false);
      setShowMissingMessage(false);

    } catch (err) {
      const errorMsg = err.response?.data?.message || "নিবন্ধন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col justify-end">
      {/* Background with gradient (mobile optimized) */}
       {/* Background Image */}
      <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
        <div
          className="absolute inset-0 bg-cover bg-top"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
      </div>
      
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Success Toast */}
      {showSuccess && (
        <div className="absolute top-5 left-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-green-500/90 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
            <FaCheckCircle className="text-white text-xl" />
            <p className="text-white font-medium text-sm flex-1">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {errorMessage && (
        <div className="absolute top-5 left-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-red-500/90 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
            <div className="w-1 h-8 bg-white/50 rounded-full"></div>
            <p className="text-white font-medium text-sm flex-1">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Sign Up Card - Bottom Sheet Style */}
      <div className="relative z-10 w-full bg-white rounded-t-3xl  shadow-2xl animate-in slide-in-from-bottom-5 duration-300 overflow-y-auto max-h-[90vh]">
        <div className="px-5 pt-8 pb-10">
          
          {/* ========== LOGO SECTION ========== */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
                <img 
                  src={logo}
                  alt="Agro Fund Logo" 
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="text-white text-3xl">🌾</div>';
                  }}
                />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <FaLeaf className="text-green-600 text-xl" />
              Agro Fund
              <FaTractor className="text-green-600 text-xl" />
            </h1>
            <p className="text-gray-500 text-sm mt-1">নতুন অ্যাকাউন্ট তৈরি করুন</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400">নিবন্ধন তথ্য</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                সম্পূর্ণ নাম
              </label>
              <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all">
                <FaUser className="text-gray-400 text-lg mr-3" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="আপনার নাম লিখুন"
                  className="bg-transparent outline-none w-full text-gray-700 placeholder:text-gray-400 text-base"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                ফোন নম্বর
              </label>
              <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all">
                <FaPhoneAlt className="text-gray-400 text-lg mr-3" />
                <span className="text-gray-500 font-medium mr-1">+88</span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0১XXXXXXXXX"
                  className="bg-transparent outline-none w-full text-gray-700 placeholder:text-gray-400 text-base"
                  autoComplete="tel"
                  inputMode="numeric"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                পাসওয়ার্ড
              </label>
              <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all">
                <FaLock className="text-gray-400 text-lg mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  className="bg-transparent outline-none w-full text-gray-700 placeholder:text-gray-400 text-base"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            {/* Referral Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                রেফারেল কোড <span className="text-red-500">*</span>
              </label>
              <div className={`flex items-center bg-gray-50 rounded-xl px-4 py-3 border transition-all ${
                form.referredBy 
                  ? 'border-green-300 focus-within:border-green-400' 
                  : 'border-gray-100 focus-within:border-green-400'
              } focus-within:ring-2 focus-within:ring-green-100`}>
                <FaUserFriends className="text-gray-400 text-lg mr-3" />
                <input
                  type="text"
                  name="referredBy"
                  value={form.referredBy}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  placeholder="আপনার রেফারেল কোড"
                  className="bg-transparent outline-none w-full text-gray-700 placeholder:text-gray-400 text-base uppercase"
                />
                {referralFromUrl && form.referredBy === referralFromUrl && (
                  <FaLink className="text-green-500 text-lg" />
                )}
              </div>
            </div>

            {/* Conditional Messages */}
            {showReferralMessage && referralFromUrl && form.referredBy === referralFromUrl && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
                <FaGift className="text-green-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-green-700">
                  <p className="font-semibold">🎉 রেফারেল লিংক থেকে এসেছেন!</p>
                  <p>নিবন্ধন সম্পূর্ণ হলে বোনাস পাবেন <strong>৳৫০</strong></p>
                </div>
              </div>
            )}
            
            {showMissingMessage && !form.referredBy && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <FaInfoCircle className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-700">
                  <p className="font-semibold">রেফারেল কোড আবশ্যক!</p>
                  <p>আপনার বন্ধুর কাছ থেকে রেফারেল কোড নিয়ে নিবন্ধন করুন</p>
                </div>
              </div>
            )}

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-tight">
                আমি <span className="text-green-600 font-semibold">শর্তাবলী</span> এবং
                <span className="text-green-600 font-semibold"> গোপনীয়তা নীতি</span> মেনে নিচ্ছি
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all active:scale-[0.98] shadow-md disabled:opacity-70"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-lg" />
                  <span>নিবন্ধন হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>নিবন্ধন করুন</span>
                  <FaArrowRight className="text-lg" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400">ইতিমধ্যে সদস্য?</span>
              </div>
            </div>

            {/* Login Link */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full border border-green-200 bg-green-50 text-green-700 py-3.5 rounded-xl font-semibold transition-all active:scale-[0.98]"
            >
              লগইন করুন
            </button>
          </form>

          {/* Features Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                ওয়েলকাম বোনাস ৳৫০
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                ২৪/৭ সাপোর্ট
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                বিনামূল্যে অ্যাকাউন্ট
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style >{`
        @keyframes slideInFromBottom {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideInFromTop {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-in {
          animation-duration: 0.3s;
          animation-fill-mode: both;
        }
        .slide-in-from-bottom-5 {
          animation-name: slideInFromBottom;
        }
        .slide-in-from-top-2 {
          animation-name: slideInFromTop;
        }
        .fade-in {
          animation-name: fadeIn;
        }
      `}</style>
    </div>
  );
};

export default SignUp;
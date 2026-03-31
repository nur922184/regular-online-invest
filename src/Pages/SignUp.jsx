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
  FaLink
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

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
    const prefix = "REF";
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
    
    // Clear error message when user starts typing
    if (errorMessage) setErrorMessage("");
    
    // Show missing message only when user tries to clear referral code
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

    // Basic validation
    if (!form.name || !form.phone || !form.password) {
      setErrorMessage("দয়া করে নাম, ফোন নম্বর এবং পাসওয়ার্ড পূরণ করুন!");
      setLoading(false);
      return;
    }

    // Phone number validation (Bangladesh format basic)
    const phoneRegex = /^(01[3-9]\d{8})|(\+8801[3-9]\d{8})$/;
    if (!phoneRegex.test(form.phone)) {
      setErrorMessage("সঠিক ফোন নম্বর দিন (যেমন: 017XXXXXXXX বা +8801XXXXXXXXX)");
      setLoading(false);
      return;
    }

    // Password validation
    if (form.password.length < 6) {
      setErrorMessage("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!");
      setLoading(false);
      return;
    }

    // Check if referral code is provided (MANDATORY)
    if (!form.referredBy) {
      setErrorMessage("রেফারেল কোড আবশ্যক! দয়া করে একটি রেফারেল কোড দিন।");
      setLoading(false);
      setShowMissingMessage(true);
      return;
    }

    // Generate automatic referral code for the new user
    const userRefCode = generateReferralCode();
    
    try {
      const res = await axios.post(
        "https://backend-project-invest.vercel.app/api/users/register",
        {
          ...form,
          refCode: userRefCode, // Auto-generated referral code
          balance: 50 // Welcome bonus
        }
      );

      // Success message from API
      const msg = res.data.message || "নিবন্ধন সফল হয়েছে! 🎉";
      setSuccessMessage(msg);
      setShowSuccess(true);

      // Store user data in localStorage
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("userId", res.data.user._id);
      }

      // Show welcome bonus alert
      Swal.fire({
        icon: 'success',
        title: 'স্বাগতম!',
        html: `
          <div class="text-left">
            <p class="mb-2">🎉 আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!</p>
            <p class="mb-2">✨ আপনার রেফারেল কোড: <strong class="text-teal-600">${userRefCode}</strong></p>
            <p>💰 ওয়েলকাম বোনাস: <strong class="text-green-600">৳৫০</strong></p>
          </div>
        `,
        confirmButtonText: 'প্রোফাইলে যান',
        confirmButtonColor: '#10b981',
        background: '#fff',
        iconColor: '#10b981'
      }).then(() => {
        navigate('/profile');
      });

      // Clear form after success
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
      
      // Auto hide error after 5 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex items-center justify-center p-4">
      {/* Main Container with Animation */}
      <div className="w-full max-w-md transform transition-all duration-500 ease-out">

        {/* Success Toast Notification */}
        {showSuccess && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
            <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-sm bg-opacity-95">
              <FaCheckCircle className="text-2xl" />
              <div>
                <p className="font-bold text-lg">সফল!</p>
                <p className="text-sm">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Toast Notification */}
        {errorMessage && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
            <div className="bg-rose-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-sm bg-opacity-95 max-w-md">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold text-lg">ত্রুটি!</p>
                <p className="text-sm break-words">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sign Up Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:shadow-3xl">

          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-8 text-white text-center">
            <div className="inline-flex items-center justify-center bg-white/20 rounded-full p-3 mb-4">
              <FaUserFriends className="text-3xl" />
            </div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">স্বাগতম!</h1>
            <p className="text-teal-50 text-sm">নতুন অ্যাকাউন্ট তৈরি করুন এবং আমাদের কমিউনিটির অংশ হোন</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">

            {/* Full Name Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-teal-400 group-focus-within:text-teal-600 transition-colors" />
              </div>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="আপনার সম্পূর্ণ নাম"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none bg-gray-50 focus:bg-white"
                autoComplete="name"
                required
              />
              <label className="absolute -top-2.5 left-8 bg-white px-1 text-xs text-gray-500">
                নাম *
              </label>
            </div>

            {/* Phone Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhoneAlt className="text-teal-400 group-focus-within:text-teal-600" />
              </div>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="মোবাইল নম্বর"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none bg-gray-50 focus:bg-white"
                autoComplete="tel"
                required
              />
              <label className="absolute -top-2.5 left-8 bg-white px-1 text-xs text-gray-500">
                ফোন নম্বর *
              </label>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-teal-400 group-focus-within:text-teal-600" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="পাসওয়ার্ড দিন"
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none bg-gray-50 focus:bg-white"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-teal-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <label className="absolute -top-2.5 left-8 bg-white px-1 text-xs text-gray-500 font-medium">
                পাসওয়ার্ড *
              </label>
            </div>

            {/* Referral Code Input - Required */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUserFriends className="text-teal-400 group-focus-within:text-teal-600 transition-colors" />
              </div>
              <input
                type="text"
                name="referredBy"
                value={form.referredBy}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="রেফারেল কোড (আবশ্যক)"
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 transition-all outline-none bg-gray-50 focus:bg-white ${
                  form.referredBy 
                    ? 'border-teal-500 focus:border-teal-500 focus:ring-teal-200'
                    : 'border-gray-200 focus:border-teal-500 focus:ring-teal-200'
                }`}
                required
              />
              <label className="absolute -top-2.5 left-8 bg-white px-1 text-xs text-gray-500 font-medium">
                রেফারেল কোড *
              </label>
              
              {/* Auto-filled from URL indicator */}
              {referralFromUrl && form.referredBy === referralFromUrl && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <FaLink className="text-teal-500 text-lg" title="URL থেকে অটো ফিল করা হয়েছে" />
                </div>
              )}
            </div>

            {/* Conditional Messages - Only show when needed */}
            
            {/* Show when user came from referral link and code is still there */}
            {showReferralMessage && referralFromUrl && form.referredBy === referralFromUrl && (
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 flex items-start gap-2 animate-fadeIn">
                <FaGift className="text-teal-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-teal-700">
                  <p className="font-semibold">রেফারেল লিংক থেকে এসেছেন!</p>
                  <p>আপনার রেফারেল কোড: <strong>{referralFromUrl}</strong></p>
                  <p className="mt-1">নিবন্ধন সম্পন্ন হলে বোনাস পাবেন ৳৫০</p>
                </div>
              </div>
            )}
            
            {/* Show only when user tries to remove referral code */}
            {showMissingMessage && !form.referredBy && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 animate-shake">
                <FaInfoCircle className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-700">
                  <p className="font-semibold">রেফারেল কোড আবশ্যক!</p>
                  <p>আপনাকে অবশ্যই একটি রেফারেল কোড দিয়ে নিবন্ধন করতে হবে।</p>
                  <p className="mt-1">💡 টিপ: আপনার বন্ধুকে জিজ্ঞাসা করুন তাদের রেফারেল কোড!</p>
                </div>
              </div>
            )}

            {/* Terms & Conditions Checkbox */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-tight">
                আমি <span className="text-teal-600 font-semibold">শর্তাবলী</span> এবং
                <span className="text-teal-600 font-semibold"> গোপনীয়তা নীতি</span> মেনে নিচ্ছি।
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-teal-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>নিবন্ধন হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>নিবন্ধন করুন</span>
                  <FaArrowRight />
                </>
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-gray-500 text-sm">
                ইতিমধ্যে অ্যাকাউন্ট আছে?
                <Link to="/login">
                  <span className="text-teal-600 font-semibold ml-2 hover:text-teal-800 transition-colors cursor-pointer">
                    লগইন করুন
                  </span>
                </Link>
              </p>
            </div>
          </form>

          {/* Decorative Footer */}
          <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <FaCheckCircle className="text-emerald-400" />
              সুরক্ষিত নিবন্ধন | ১০০% নিরাপদ
            </p>
          </div>
        </div>

        {/* Extra Info Card */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 bg-teal-400 rounded-full"></span> ওয়েলকাম বোনাস ৳৫০</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full"></span> ২৪/৭ সাপোর্ট</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 bg-cyan-400 rounded-full"></span> বিনামূল্যে অ্যাকাউন্ট</span>
          </p>
        </div>
      </div>

      {/* Animation keyframes style */}
      <style jsx>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: translateX(-50%) scale(0.8);
          }
          60% {
            opacity: 1;
            transform: translateX(-50%) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) scale(1);
          }
        }
        .animate-bounce-in {
          animation: bounceIn 0.4s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default SignUp;
import React, { useState } from "react";
import axios from "axios";
import {
  FaPhoneAlt,
  FaLock,
  FaSignInAlt,
  FaSpinner,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaUserCheck,
  FaShieldAlt,
} from "react-icons/fa";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    // Clear error when user types
    if (errorMessage) setErrorMessage("");
  };

  const navigate = useNavigate(); // ✅ useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setShowSuccess(false);

    // Basic validation
    if (!form.phone || !form.password) {
      setErrorMessage("দয়া করে ফোন নম্বর এবং পাসওয়ার্ড পূরণ করুন!");
      setLoading(false);
      return;
    }

    // Phone number validation (Bangladesh format)
    const phoneRegex = /^(01[3-9]\d{8})|(\+8801[3-9]\d{8})$/;
    if (!phoneRegex.test(form.phone)) {
      setErrorMessage("সঠিক ফোন নম্বর দিন (যেমন: 017XXXXXXXX বা +8801XXXXXXXXX)");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", form);

      // Success message
      const msg = res.data.message || "লগইন সফল হয়েছে! 🎉";
      setSuccessMessage(msg);
      setShowSuccess(true);

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUserData(res.data.user);

      // Auto hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

      // Clear form after success
      setForm({ phone: "", password: "" });

      // ✅ Redirect to Home page
      navigate("/"); // "/" হলো হোম পেইজের route
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "লগইন করতে সমস্যা হয়েছে। ফোন নম্বর এবং পাসওয়ার্ড যাচাই করুন।";
      setErrorMessage(errorMsg);

      // Auto hide error after 5 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-md transform transition-all duration-500 ease-out">

        {/* Success Toast Notification */}
        {showSuccess && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
            <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-sm bg-opacity-95">
              <FaCheckCircle className="text-2xl" />
              <div>
                <p className="font-bold text-lg">স্বাগতম!</p>
                <p className="text-sm">{successMessage}</p>
                {userData && userData.name && (
                  <p className="text-xs mt-1 opacity-90">{userData.name} ভাই/বোন</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Toast Notification */}
        {errorMessage && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
            <div className="bg-rose-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-sm bg-opacity-95">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold text-lg">লগইন ব্যর্থ!</p>
                <p className="text-sm">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:shadow-3xl">

          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-8 text-white text-center">
            <div className="inline-flex items-center justify-center bg-white/20 rounded-full p-3 mb-4">
              <FaUserCheck className="text-3xl" />
            </div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">আবার স্বাগতম!</h1>
            <p className="text-teal-50 text-sm">আপনার অ্যাকাউন্টে লগইন করুন এবং সংযুক্ত থাকুন</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">

            {/* Phone Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdOutlinePhoneAndroid className="text-teal-400 group-focus-within:text-teal-600 text-xl" />
              </div>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="মোবাইল নম্বর দিন"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none bg-gray-50 focus:bg-white"
                autoComplete="tel"
              />
              <label className="absolute -top-2.5 left-8 bg-white px-1 text-xs text-gray-500 font-medium">
                ফোন নম্বর
              </label>
              <p className="text-xs text-gray-400 mt-1 ml-2">উদাহরণ: 017XXXXXXXX বা +8801XXXXXXXXX</p>
            </div>

            {/* Password Input with Show/Hide */}
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
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-teal-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <label className="absolute -top-2.5 left-8 bg-white px-1 text-xs text-gray-500 font-medium">
                পাসওয়ার্ড
              </label>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => alert("পাসওয়ার্ড রিসেট লিংক পাঠানো হবে (আপনার ইমেইলে)")}
                className="text-sm text-teal-600 hover:text-teal-800 font-medium transition-colors"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
              />
              <label htmlFor="remember" className="text-sm text-gray-600">
                আমাকে মনে রাখুন
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-teal-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>লগইন হচ্ছে...</span>
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  <span>লগইন করুন</span>
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-gray-500 text-sm">
                নতুন ব্যবহারকারী?
                <Link to="/signup">
                  <button
                    type="button"
                    className="text-teal-600 font-semibold ml-2 hover:text-teal-800 transition-colors"
                  >
                    অ্যাকাউন্ট তৈরি করুন
                  </button>
                </Link>

              </p>
            </div>
          </form>

          {/* Decorative Footer */}
          <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
              <FaShieldAlt className="text-emerald-400" />
              সুরক্ষিত লগইন | ২৫৬-বিট এনক্রিপশন
            </p>
          </div>
        </div>

        {/* Extra Features Card */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-all">
            <FaPhoneAlt className="text-teal-500 mx-auto mb-1" />
            <p className="text-xs text-gray-600">২৪/৭ সহায়তা</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-all">
            <FaShieldAlt className="text-emerald-500 mx-auto mb-1" />
            <p className="text-xs text-gray-600">নিরাপদ অ্যাকাউন্ট</p>
          </div>
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
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .card-enter {
          animation: fadeSlideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
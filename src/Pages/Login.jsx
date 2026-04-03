import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSignInAlt,
  FaSpinner,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaLeaf,
  FaTractor,
} from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FcIphone } from "react-icons/fc";
import logo from "../assets/logo.jpg"
const Login = () => {
  const [form, setForm] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [bgIndex, setBgIndex] = useState(0);

  const navigate = useNavigate();

  // কৃষি/প্রকৃতি সম্পর্কিত ব্যাকগ্রাউন্ড ইমেজ
  const bgImages = [
    // "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format",
    // "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&auto=format",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format",
  ];

  // ব্যাকগ্রাউন্ড পরিবর্তন
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setShowSuccess(false);

    if (!form.phone || !form.password) {
      setErrorMessage("দয়া করে ফোন নম্বর এবং পাসওয়ার্ড দিন");
      setLoading(false);
      return;
    }

    const phoneRegex = /^(01[3-9]\d{8}|\+8801[3-9]\d{8})$/;
    if (!phoneRegex.test(form.phone)) {
      setErrorMessage("সঠিক ফোন নম্বর দিন (যেমন: 017XXXXXXXX)");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("https://backend-project-invest.vercel.app/api/users/login", form);
      const msg = res.data.message || "লগইন সফল হয়েছে!";
      setSuccessMessage(msg);
      setShowSuccess(true);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setTimeout(() => setShowSuccess(false), 3000);
      setForm({ phone: "", password: "" });
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "ফোন নম্বর বা পাসওয়ার্ড ভুল";
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="fixed inset-0 flex flex-col justify-end">
      {/* Background Image */}
      <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
        <div
          className="absolute inset-0 bg-cover bg-top"
          style={{ backgroundImage: `url(${bgImages[bgIndex]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="absolute top-5 left-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-green-500/90 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
            <FaCheckCircle className="text-white text-xl" />
            <p className="text-white font-medium text-sm flex-1">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Login Card - Bottom Sheet Style */}
      <div className="relative z-10 w-full bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
        <div className="px-5 pt-8 pb-10">
          
          {/* ========== LOGO SECTION - আপনি এখানে আপনার লোগো বসাবেন ========== */}
          <div className="text-center mb-6">
            {/* লোগোর জন্য ডিফল্ট ডিজাইন (আপনার ইমেজ লিঙ্ক দিন) */}
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
                {/* আপনার লোগো ইমেজ */}
                <img 
                  src={logo}  // ← আপনার লোগোর পাথ দিন
                  alt="Agro Fund Logo" 
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    // ইমেজ না থাকলে ফলের জন্য ফালব্যাক আইকন দেখাবে
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<FaLeaf className="text-white text-3xl" />';
                  }}
                />
              </div>
            </div>
            
            {/* ব্র্যান্ড নাম */}
            <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <FaLeaf className="text-green-600 text-xl" />
              Agro Fund
              <FaTractor className="text-green-600 text-xl" />
            </h1>
            <p className="text-gray-500 text-sm mt-1">কৃষকের বিশ্বস্ত সঙ্গী</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400">লগইন করুন</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Phone Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                ফোন নম্বর
              </label>
              <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all">
                <FcIphone className="text-gray-400 text-lg mr-3" />
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
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                পাসওয়ার্ড
              </label>
              <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all">
                <MdOutlinePassword className="text-gray-400 text-lg mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="আপনার পাসওয়ার্ড"
                  className="bg-transparent outline-none w-full text-gray-700 placeholder:text-gray-400 text-base"
                  autoComplete="current-password"
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

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all active:scale-[0.98] shadow-md ${
                loading ? "opacity-80" : "hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-lg" />
                  <span>লগইন হচ্ছে...</span>
                </>
              ) : (
                <>
                  <FaSignInAlt className="text-lg" />
                  <span>লগইন করুন</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400">নতুন ব্যবহারকারী?</span>
              </div>
            </div>

            {/* Signup Button */}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="w-full border border-green-200 bg-green-50 text-green-700 py-3.5 rounded-xl font-semibold transition-all active:scale-[0.98]"
            >
              নতুন অ্যাকাউন্ট খুলুন
            </button>

            {/* Forgot Password */}
            <div className="text-center mt-5">
              <button
                type="button"
                className="text-gray-400 text-sm hover:text-green-500 transition-colors"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>
          </form>

          {/* Error Message Toast */}
          {errorMessage && (
            <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
              <div className="bg-red-500/95 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
                <div className="w-1 h-8 bg-white/50 rounded-full"></div>
                <p className="text-white font-medium text-sm flex-1">{errorMessage}</p>
              </div>
            </div>
          )}
        </div>
      </div>

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

export default Login;
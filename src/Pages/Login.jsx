import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSignInAlt,
  FaSpinner,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaLeaf,
  FaTractor,
} from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FcIphone } from "react-icons/fc";

const Login = () => {
  const [form, setForm] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* হেডার সেকশন - সাইনআপের মতো একই ইমেজ */}
      <div className="relative h-72 w-full overflow-hidden">
        {/* ব্যাকগ্রাউন্ড ইমেজ - সাইনআপের মতো একই */}
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
          <p className="text-white/80 text-sm">আপনার অ্যাকাউন্টে লগইন করুন</p>
        </div>
      </div>

      {/* ফর্ম সেকশন - কার্ড স্টাইল */}
      <div 
        className="relative -mt-6 mx-4 bg-white rounded-2xl shadow-xl animate-slideUp"
        style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}
      >
        {/* সাকসেস মেসেজ */}
        {showSuccess && (
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* ফোন ফিল্ড */}
          <div className="group">
            <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">ফোন নম্বর</label>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-1 border border-gray-100 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all duration-200">
              <FcIphone className="text-gray-400 text-lg" />
              <span className="text-gray-500 font-medium text-sm">+88</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="017XXXXXXXX"
                className="bg-transparent outline-none w-full text-gray-700 placeholder:text-gray-400 text-sm"
                autoComplete="tel"
                inputMode="numeric"
              />
            </div>
          </div>

          {/* পাসওয়ার্ড ফিল্ড */}
          <div className="group">
            <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">পাসওয়ার্ড</label>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-1 border border-gray-100 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all duration-200">
              <MdOutlinePassword className="text-gray-400 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="আপনার পাসওয়ার্ড"
                className="bg-transparent outline-none w-full text-gray-700 placeholder:text-gray-400 text-sm"
                autoComplete="current-password"
              />
              <button 
                type="button" 
                onClick={togglePasswordVisibility} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          {/* ফরগট পাসওয়ার্ড লিংক */}
          <div className="text-right">
            <button
              type="button"
              className="text-xs text-green-600 hover:text-green-700 font-medium"
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </button>
          </div>

          {/* লগইন বাটন */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all duration-200 transform active:scale-98 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" size={18} />
                <span>লগইন হচ্ছে...</span>
              </>
            ) : (
              <>
                <FaSignInAlt size={14} />
                <span>লগইন করুন</span>
              </>
            )}
          </button>

          {/* ডিভাইডার */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-gray-400 text-xs">নতুন ব্যবহারকারী?</span>
            </div>
          </div>

          {/* সাইনআপ লিংক */}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="w-full border-2 border-green-200 bg-green-50 hover:bg-green-100 text-green-700 py-1 rounded-xl font-semibold text-sm transition-all duration-200 transform active:scale-98"
          >
            নতুন অ্যাকাউন্ট খুলুন
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

export default Login;
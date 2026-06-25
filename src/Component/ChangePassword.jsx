// ChangePassword.jsx - AgroFund Green Theme with Password Visibility
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  FaArrowLeft, 
  FaEye, 
  FaEyeSlash, 
  FaLock, 
  FaKey, 
  FaCheckCircle,
  FaLeaf,
  FaTractor,
  FaSeedling
} from "react-icons/fa";
import useUser from "../hooks/useUsers";

const ChangePassword = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "সব তথ্য দিন",
        text: "দয়া করে সব ফিল্ড পূরণ করুন",
        confirmButtonColor: "#16a34a"
      });
      return false;
    }

    if (form.newPassword.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "পাসওয়ার্ড ছোট",
        text: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে",
        confirmButtonColor: "#16a34a"
      });
      return false;
    }

    if (form.newPassword !== form.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "পাসওয়ার্ড মিলছে না",
        text: "নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড একই হতে হবে",
        confirmButtonColor: "#ef4444"
      });
      return false;
    }

    if (form.oldPassword === form.newPassword) {
      Swal.fire({
        icon: "warning",
        title: "একই পাসওয়ার্ড",
        text: "পুরাতন এবং নতুন পাসওয়ার্ড একই হতে পারে না",
        confirmButtonColor: "#16a34a"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("https://investify-backend.vercel.app/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user._id,
          oldPassword: form.oldPassword,
          newPassword: form.newPassword
        })
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে",
          confirmButtonColor: "#16a34a"
        });
        setForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        navigate("/profile");
      } else {
        throw new Error(data.message);
      }

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: err.message || "পাসওয়ার্ড পরিবর্তন করতে ব্যর্থ হয়েছে",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setLoading(false);
    }
  };

  // পাসওয়ার্ড শক্তি পরীক্ষা
  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, text: "", color: "bg-gray-200" };
    if (password.length < 6) return { level: 1, text: "দুর্বল", color: "bg-red-500" };
    if (password.length < 8) return { level: 2, text: "মাঝারি", color: "bg-yellow-500" };
    return { level: 3, text: "শক্তিশালী", color: "bg-green-500" };
  };

  const strength = getPasswordStrength(form.newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="max-w-md mx-auto px-4 py-5">
        
        {/* হেডার */}
        <div className="flex items-center gap-3 mb-5">
          <button 
            onClick={() => navigate(-1)} 
            className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center active:bg-green-200 transition"
          >
            <FaArrowLeft className="text-green-700 text-sm" />
          </button>
          <h2 className="text-xl font-bold text-green-800">পাসওয়ার্ড পরিবর্তন</h2>
          <FaLock className="text-green-600 ml-auto text-sm" />
        </div>

        {/* ফর্ম কার্ড */}
        <div className="bg-white rounded-xl shadow-md border border-green-100 p-5 mb-5">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* পুরাতন পাসওয়ার্ড */}
            <div>
              <label className="block text-green-800 text-sm font-semibold mb-2">
                পুরাতন পাসওয়ার্ড
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <FaKey className="text-green-500 text-xs" />
                </span>
                <input
                  type={showPasswords.old ? "text" : "password"}
                  name="oldPassword"
                  placeholder="আপনার পুরাতন পাসওয়ার্ড দিন"
                  value={form.oldPassword}
                  onChange={handleChange}
                  className="w-full pl-9 pr-10 py-2.5 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm placeholder:text-green-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("old")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-700"
                >
                  {showPasswords.old ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            {/* নতুন পাসওয়ার্ড */}
            <div>
              <label className="block text-green-800 text-sm font-semibold mb-2">
                নতুন পাসওয়ার্ড
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <FaLock className="text-green-500 text-xs" />
                </span>
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  placeholder="নতুন পাসওয়ার্ড দিন"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="w-full pl-9 pr-10 py-2.5 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm placeholder:text-green-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-700"
                >
                  {showPasswords.new ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
              
              {/* পাসওয়ার্ড শক্তি ইন্ডিকেটর */}
              {form.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${(strength.level / 3) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-[10px] font-medium ${
                      strength.level === 1 ? "text-red-500" : 
                      strength.level === 2 ? "text-yellow-500" : 
                      strength.level === 3 ? "text-green-500" : "text-gray-400"
                    }`}>
                      {strength.text}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* কনফার্ম পাসওয়ার্ড */}
            <div>
              <label className="block text-green-800 text-sm font-semibold mb-2">
                নতুন পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <FaCheckCircle className="text-green-500 text-xs" />
                </span>
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="আবার নতুন পাসওয়ার্ড দিন"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-9 pr-10 py-2.5 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm placeholder:text-green-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-700"
                >
                  {showPasswords.confirm ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            {/* পাসওয়ার্ড ম্যাচ ইন্ডিকেটর */}
            {form.confirmPassword && form.newPassword && (
              <div className="text-right">
                {form.newPassword === form.confirmPassword ? (
                  <span className="text-green-600 text-[10px] flex items-center justify-end gap-1">
                    <FaCheckCircle size={10} />
                    পাসওয়ার্ড মিলেছে
                  </span>
                ) : (
                  <span className="text-red-500 text-[10px]">পাসওয়ার্ড মিলছে না</span>
                )}
              </div>
            )}

            {/* তথ্য বক্স */}
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-green-600 text-sm mt-0.5" />
                <div>
                  <p className="text-green-800 text-xs font-semibold mb-1">পাসওয়ার্ড নির্দেশিকা</p>
                  <p className="text-green-700 text-[10px]">✓ কমপক্ষে ৬ অক্ষরের হতে হবে</p>
                  <p className="text-green-700 text-[10px]">✓ শক্তিশালী পাসওয়ার্ড ব্যবহার করুন</p>
                  <p className="text-green-700 text-[10px]">✓ অন্যের সাথে শেয়ার করবেন না</p>
                </div>
              </div>
            </div>

            {/* বাটন */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>পরিবর্তন হচ্ছে...</span>
                </div>
              ) : (
                "পাসওয়ার্ড পরিবর্তন করুন"
              )}
            </button>

          </form>
        </div>

        {/* ফুটার */}
        <div className="text-center">
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

export default ChangePassword;
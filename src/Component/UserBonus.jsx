// UserBonus.jsx - ইউজার বোনাস ক্লেইম পেজ
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaArrowLeft,
  FaGift,
  FaTicketAlt,
  FaSpinner,
  FaCheckCircle,
  FaLeaf,
  FaTractor,
  FaSeedling,
  FaInfoCircle
} from "react-icons/fa";
import useUser from "../hooks/useUsers";

const UserBonus = () => {
  const navigate = useNavigate();
  const { user, refresh } = useUser();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [codeValid, setCodeValid] = useState(null);
  const [bonusAmount, setBonusAmount] = useState(0);

  const checkCode = async () => {
    if (!code.trim()) {
      Swal.fire({ icon: "warning", title: "কোড দিন", timer: 1500, showConfirmButton: false });
      return;
    }
    
    setChecking(true);
    try {
      const res = await fetch("https://backend-project-invest.vercel.app/api/bonus-code/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.toUpperCase() })
      });
      
      const data = await res.json();
      
      if (data.valid) {
        setCodeValid(true);
        setBonusAmount(data.amount);
        Swal.fire({
          icon: "success",
          title: "ভ্যালিড কোড!",
          text: `আপনি ৳${data.amount} বোনাস পাবেন`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        setCodeValid(false);
        Swal.fire({
          icon: "error",
          title: "ভুল কোড!",
          text: data.message,
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "ত্রুটি!", text: error.message });
    } finally {
      setChecking(false);
    }
  };

  const claimBonus = async () => {
    if (!code.trim()) {
      Swal.fire({ icon: "warning", title: "কোড দিন", timer: 1500, showConfirmButton: false });
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("https://backend-project-invest.vercel.app/api/bonus-code/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?._id,
          code: code.toUpperCase()
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "অভিনন্দন! 🎉",
          html: `
            <div class="text-center">
              <div class="text-5xl mb-2">🎁</div>
              <p class="text-lg font-bold text-green-600">৳${data.bonusAmount} বোনাস</p>
              <p class="text-sm text-gray-500">আপনার অ্যাকাউন্টে যোগ করা হয়েছে</p>
              <p class="text-xs text-green-600 mt-2">নতুন ব্যালেন্স: ৳${data.newBalance}</p>
            </div>
          `,
          confirmButtonColor: "#16a34a"
        });
        setCode("");
        setCodeValid(null);
        refresh();
        navigate("/profile");
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি!",
          text: data.message,
          confirmButtonColor: "#ef4444"
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: error.message,
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-md mx-auto px-4 py-5">
        
        {/* হেডার */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(-1)} className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <FaArrowLeft className="text-green-700 text-sm" />
          </button>
          <div className="flex items-center gap-2">
            <FaGift className="text-green-600 text-lg" />
            <h1 className="text-lg font-bold text-green-800">বোনাস ক্লেইম</h1>
          </div>
        </div>

        {/* ব্যালেন্স কার্ড */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 shadow-md mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs mb-0.5">বর্তমান ব্যালেন্স</p>
              <p className="text-white text-2xl font-bold">৳ {user?.balance?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-xl">
              <FaGift className="text-white text-xl" />
            </div>
          </div>
        </div>

        {/* বোনাস কার্ড */}
        <div className="bg-white rounded-xl shadow-md border border-green-100 p-5 mb-5">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaTicketAlt className="text-white text-3xl" />
            </div>
            <h2 className="text-green-800 font-bold text-lg">বোনাস কোড দিন</h2>
            <p className="text-gray-500 text-xs">এডমিনের দেওয়া কোড ব্যবহার করে বোনাস নিন</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-green-700 text-sm font-medium mb-1 block">বোনাস কোড</label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setCodeValid(null);
                }}
                placeholder="যেমন: ABCD1234"
                className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center font-mono text-lg tracking-wider focus:outline-none focus:border-green-500"
                autoCapitalize="characters"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={checkCode}
                disabled={checking || !code.trim()}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium text-sm transition disabled:opacity-50"
              >
                {checking ? <FaSpinner className="animate-spin mx-auto" /> : "চেক করুন"}
              </button>
              
              <button
                onClick={claimBonus}
                disabled={loading || !code.trim()}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm transition active:scale-95 disabled:opacity-50"
              >
                {loading ? <FaSpinner className="animate-spin mx-auto" /> : "ক্লেইম করুন"}
              </button>
            </div>
          </div>
          
          {codeValid === true && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                <span className="text-green-700 text-sm font-medium">ভ্যালিড কোড! বোনাস: ৳{bonusAmount}</span>
              </div>
            </div>
          )}
        </div>

        {/* নির্দেশিকা */}
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-amber-600 text-lg mt-0.5" />
            <div>
              <h3 className="text-amber-800 font-semibold text-sm mb-1">কিভাবে বোনাস পাবেন?</h3>
              <ul className="text-amber-700 text-xs space-y-1">
                <li>• এডমিনের দেওয়া বোনাস কোড ব্যবহার করুন</li>
                <li>• প্রতিটি কোড একবারই ব্যবহার করা যাবে</li>
                <li>• বোনাস সরাসরি আপনার অ্যাকাউন্টে যুক্ত হবে</li>
                <li>• কোডের মেয়াদ শেষ হয়ে গেলে কাজ করবে না</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ফুটার */}
        <div className="text-center mt-6 pt-4 border-t border-green-100">
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

export default UserBonus;
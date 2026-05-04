// AdminBonus.jsx - এডমিন বোনাস প্যানেল
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaArrowLeft,
  FaGift,
  FaCopy,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaSyncAlt,
  FaSpinner,
  FaLeaf,
  FaTractor,
  FaSeedling,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import useUser from "../hooks/useUsers";

const AdminBonus = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [amount, setAmount] = useState(50);
  const [maxUses, setMaxUses] = useState(100);

  const fetchCodes = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://backend-project-invest.onrender.com/api/bonus-code/admin/all");
      const data = await res.json();
      if (data.success) {
        setCodes(data.data);
      }
    } catch (error) {
      console.error("Error fetching codes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const generateCode = async () => {
    try {
      setGenerating(true);
      const res = await fetch("https://backend-project-invest.onrender.com/api/bonus-code/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: user?._id,
          amount: amount,
          maxUses: maxUses
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "কোড তৈরি হয়েছে!",
          html: `<p class="text-2xl font-bold text-green-600">${data.data.code}</p>`,
          confirmButtonColor: "#16a34a"
        });
        fetchCodes();
        setAmount(50);
        setMaxUses(100);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: error.message,
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setGenerating(false);
    }
  };

  const deleteCode = async (id, code) => {
    const confirm = await Swal.fire({
      title: "কোড ডিলিট করবেন?",
      text: `কোড: ${code} ডিলিট করতে চান?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, ডিলিট",
      cancelButtonText: "না",
      confirmButtonColor: "#ef4444"
    });
    
    if (!confirm.isConfirmed) return;
    
    try {
      const res = await fetch(`https://backend-project-invest.onrender.com/api/bonus-code/admin/delete/${id}`, {
        method: "DELETE"
      });
      
      const data = await res.json();
      
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "ডিলিট হয়েছে!",
          timer: 1500,
          showConfirmButton: false
        });
        fetchCodes();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: error.message,
        confirmButtonColor: "#ef4444"
      });
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`https://backend-project-invest.onrender.com/api/bonus-code/admin/toggle/${id}`, {
        method: "PUT"
      });
      
      const data = await res.json();
      
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: data.message,
          timer: 1500,
          showConfirmButton: false
        });
        fetchCodes();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: error.message,
        confirmButtonColor: "#ef4444"
      });
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    Swal.fire({
      icon: "success",
      title: "কপি হয়েছে!",
      timer: 1000,
      showConfirmButton: false
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("bn-BD");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-green-600" />
      </div>
    );
  }

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
            <h1 className="text-lg font-bold text-green-800">বোনাস কোড</h1>
          </div>
          <button onClick={fetchCodes} className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <FaSyncAlt className="text-green-600 text-sm" />
          </button>
        </div>

        {/* জেনারেট কার্ড */}
        <div className="bg-white rounded-xl shadow-md border border-green-100 p-4 mb-5">
          <h2 className="text-green-800 font-semibold text-sm mb-3 flex items-center gap-2">
            <FaGift className="text-green-600" />
            নতুন বোনাস কোড তৈরি করুন
          </h2>
          
          <div className="space-y-3">
            <div>
              <label className="text-green-700 text-xs mb-1 block">বোনাস পরিমাণ (৳)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm"
                placeholder="৫০"
              />
            </div>
            
            <div>
              <label className="text-green-700 text-xs mb-1 block">সর্বোচ্চ ব্যবহার সংখ্যা</label>
              <input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(Number(e.target.value))}
                className="w-full px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm"
                placeholder="১০০"
              />
            </div>
            
            <button
              onClick={generateCode}
              disabled={generating}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-lg font-semibold text-sm transition active:scale-95 disabled:opacity-50"
            >
              {generating ? <FaSpinner className="animate-spin mx-auto" /> : "কোড জেনারেট করুন"}
            </button>
          </div>
        </div>

        {/* বোনাস কোড লিস্ট */}
        <div className="space-y-3">
          <h2 className="text-green-800 font-semibold text-sm flex items-center gap-2">
            <FaUsers className="text-green-600" />
            তৈরি করা কোডসমূহ ({codes.length})
          </h2>
          
          {codes.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center border border-green-100">
              <FaGift className="text-green-300 text-4xl mx-auto mb-2" />
              <p className="text-green-500 text-sm">কোন বোনাস কোড তৈরি করা হয়নি</p>
            </div>
          ) : (
            codes.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-sm border border-green-100 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-700 font-mono font-bold text-base">{item.code}</span>
                      <button onClick={() => copyCode(item.code)} className="text-green-500">
                        <FaCopy size={12} />
                      </button>
                    </div>
                    <p className="text-gray-500 text-[10px] mt-1">
                      তৈরি: {formatDate(item.createdAt)} | মেয়াদ: {formatDate(item.expiresAt)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleStatus(item._id, item.isActive)}
                      className={`p-1.5 rounded-lg ${item.isActive ? "text-green-600" : "text-gray-400"}`}
                    >
                      {item.isActive ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                    </button>
                    <button
                      onClick={() => deleteCode(item._id, item.code)}
                      className="p-1.5 text-red-500 rounded-lg"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-green-50 rounded-lg p-2">
                    <p className="text-gray-500 text-[9px]">পরিমাণ</p>
                    <p className="text-green-600 font-bold">৳{item.amount}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2">
                    <p className="text-gray-500 text-[9px]">ব্যবহার</p>
                    <p className="text-blue-600 font-bold">{item.usedCount}/{item.maxUses}</p>
                  </div>
                  <div className={`rounded-lg p-2 ${item.isActive ? "bg-green-50" : "bg-red-50"}`}>
                    <p className="text-gray-500 text-[9px]">স্ট্যাটাস</p>
                    <p className={`font-bold ${item.isActive ? "text-green-600" : "text-red-600"}`}>
                      {item.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                    </p>
                  </div>
                </div>
                
                {item.usedBy.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-green-100">
                    <p className="text-gray-500 text-[9px] mb-1">ব্যবহারকারী ({item.usedCount})</p>
                    <div className="flex flex-wrap gap-1">
                      {item.usedBy.slice(0, 3).map((use, idx) => (
                        <span key={idx} className="text-[8px] bg-gray-100 px-2 py-0.5 rounded">
                          {use.userId?.name || "ইউজার"}
                        </span>
                      ))}
                      {item.usedCount > 3 && <span className="text-[8px] text-gray-400">+{item.usedCount - 3}</span>}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* ফুটার */}
        <div className="text-center mt-6 pt-4 border-t border-green-100">
          <div className="flex justify-center gap-2 mb-1">
            <FaLeaf className="text-green-400 text-xs" />
            <FaSeedling className="text-green-500 text-xs" />
            <FaTractor className="text-green-600 text-xs" />
          </div>
          <p className="text-gray-400 text-[10px]">AgroFund - এডমিন প্যানেল</p>
        </div>

      </div>
    </div>
  );
};

export default AdminBonus;
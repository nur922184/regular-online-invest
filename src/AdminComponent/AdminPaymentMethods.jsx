// pages/admin/AdminPaymentMethods.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaMobileAlt,
  FaCheckCircle,
  FaBan,
  FaEye
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const AdminPaymentMethods = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [formData, setFormData] = useState({
    name: "bkash",
    displayName: "",
    number: "",
    accountHolder: "",
    icon: "",
    minAmount: 400,
    maxAmount: 50000,
    txnPattern: "^[A-Z0-9]{8,15}$",
    txnExample: "8X7X6X5X",
    sortOrder: 0
  });

  useEffect(() => {
    loadMethods();
  }, []);

  const loadMethods = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://investify-fixed.vercel.app/api/payment-methods/all");
      const data = await res.json();
      if (data.success) {
        setMethods(data.methods);
      }
    } catch (error) {
      console.error("Error loading methods:", error);
      Swal.fire("ত্রুটি!", "মেথড লোড করতে ব্যর্থ হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (methods.length >= 2 && !editingMethod) {
      Swal.fire("সীমা অতিক্রম!", "সর্বোচ্চ ২টি পেমেন্ট মেথড যোগ করা যাবে!", "warning");
      return;
    }

    try {
      const url = editingMethod 
        ? `https://investify-fixed.vercel.app/api/payment-methods/update/${editingMethod._id}`
        : "https://investify-fixed.vercel.app/api/payment-methods/create";
      
      const method = editingMethod ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("সফল!", editingMethod ? "আপডেট করা হয়েছে" : "যোগ করা হয়েছে", "success");
        setShowModal(false);
        setEditingMethod(null);
        setFormData({
          name: "bkash",
          displayName: "",
          number: "",
          accountHolder: "",
          icon: "",
          minAmount: 400,
          maxAmount: 50000,
          txnPattern: "^[A-Z0-9]{8,15}$",
          txnExample: "8X7X6X5X",
          sortOrder: 0
        });
        loadMethods();
      } else {
        Swal.fire("ত্রুটি!", data.message, "error");
      }
    } catch (error) {
      console.error("Error saving method:", error);
      Swal.fire("ত্রুটি!", "সেভ করতে ব্যর্থ হয়েছে", "error");
    }
  };

  const handleDelete = async (method) => {
    const result = await Swal.fire({
      title: "ডিলিট করবেন?",
      text: `${method.displayName} ডিলিট করতে চান?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "হ্যাঁ, ডিলিট",
      cancelButtonText: "না"
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`https://investify-fixed.vercel.app/api/payment-methods/delete/${method._id}`, {
          method: "DELETE"
        });
        
        const data = await res.json();
        
        if (data.success) {
          Swal.fire("ডিলিট!", "মেথড ডিলিট করা হয়েছে", "success");
          loadMethods();
        } else {
          Swal.fire("ত্রুটি!", data.message, "error");
        }
      } catch (error) {
        console.error("Error deleting method:", error);
        Swal.fire("ত্রুটি!", "ডিলিট করতে ব্যর্থ হয়েছে", "error");
      }
    }
  };

  const handleEdit = (method) => {
    setEditingMethod(method);
    setFormData({
      name: method.name,
      displayName: method.displayName,
      number: method.number,
      accountHolder: method.accountHolder,
      icon: method.icon || "",
      minAmount: method.minAmount,
      maxAmount: method.maxAmount,
      txnPattern: method.txnPattern,
      txnExample: method.txnExample,
      sortOrder: method.sortOrder || 0
    });
    setShowModal(true);
  };

  const handleToggleStatus = async (method) => {
    try {
      const res = await fetch(`https://investify-fixed.vercel.app/api/payment-methods/update/${method._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...method, isActive: !method.isActive })
      });
      
      const data = await res.json();
      if (data.success) {
        Swal.fire("সফল!", `মেথড ${method.isActive ? "বন্ধ" : "চালু"} করা হয়েছে`, "success");
        loadMethods();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      Swal.fire("ত্রুটি!", "স্ট্যাটাস পরিবর্তন করতে ব্যর্থ হয়েছে", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-green-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* হেডার */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">পেমেন্ট মেথড ম্যানেজমেন্ট</h1>
            <p className="text-gray-500 text-sm mt-1">সর্বোচ্চ ২টি পেমেন্ট মেথড যুক্ত করা যাবে</p>
          </div>
          <button
            onClick={() => {
              setEditingMethod(null);
              setFormData({
                name: "bkash",
                displayName: "",
                number: "",
                accountHolder: "",
                icon: "",
                minAmount: 400,
                maxAmount: 50000,
                txnPattern: "^[A-Z0-9]{8,15}$",
                txnExample: "8X7X6X5X",
                sortOrder: methods.length
              });
              setShowModal(true);
            }}
            disabled={methods.length >= 2}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              methods.length >= 2
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            <FaPlus size={14} />
            নতুন মেথড যোগ করুন
          </button>
        </div>

        {/* মেথড লিস্ট */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {methods.map((method) => (
            <div key={method._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {method.icon ? (
                    <img src={method.icon} alt={method.displayName} className="w-8 h-8 rounded-full bg-white p-1" />
                  ) : (
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <FaMobileAlt className="text-white" />
                    </div>
                  )}
                  <h2 className="text-white font-bold">{method.displayName}</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(method)}
                    className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition"
                    title={method.isActive ? "বন্ধ করুন" : "চালু করুন"}
                  >
                    {method.isActive ? <FaCheckCircle size={14} className="text-green-300" /> : <FaBan size={14} className="text-red-300" />}
                  </button>
                  <button
                    onClick={() => handleEdit(method)}
                    className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition"
                    title="এডিট করুন"
                  >
                    <FaEdit size={14} className="text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(method)}
                    className="p-1.5 bg-red-500/50 rounded-lg hover:bg-red-600/70 transition"
                    title="ডিলিট করুন"
                  >
                    <FaTrash size={14} className="text-white" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-sm">নম্বর:</span>
                    <span className="font-mono font-bold text-gray-800">{method.number}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-sm">অ্যাকাউন্ট হোল্ডার:</span>
                    <span className="text-gray-800">{method.accountHolder}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-sm">সীমা:</span>
                    <div className="flex items-center gap-1">
                      <FaBangladeshiTakaSign className="text-green-600 text-xs" />
                      <span className="text-gray-800">{method.minAmount} - {method.maxAmount}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-sm">TxN উদাহরণ:</span>
                    <span className="font-mono text-gray-600">{method.txnExample}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      method.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {method.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* নো ডাটা */}
        {methods.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <FaMobileAlt className="text-gray-300 text-5xl mx-auto mb-3" />
            <p className="text-gray-500">কোন পেমেন্ট মেথড যোগ করা হয়নি</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
            >
              প্রথম মেথড যোগ করুন
            </button>
          </div>
        )}
      </div>

      {/* মডাল */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {editingMethod ? "মেথড এডিট করুন" : "নতুন মেথড যোগ করুন"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingMethod(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">মেথড নাম</label>
                <select
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, displayName: e.target.value === "bkash" ? "বিকাশ" : "নগদ" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  required
                >
                  <option value="bkash">বিকাশ (bkash)</option>
                  <option value="nagad">নগদ (nagad)</option>
                  <option value="rocket">রকেট (rocket)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">ডিসপ্লে নাম</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="যেমন: বিকাশ"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">নম্বর</label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 font-mono"
                  placeholder="01XXXXXXXXX"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">অ্যাকাউন্ট হোল্ডার</label>
                <input
                  type="text"
                  value={formData.accountHolder}
                  onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="নাম"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">ন্যূনতম (টাকা)</label>
                  <input
                    type="number"
                    value={formData.minAmount}
                    onChange={(e) => setFormData({ ...formData, minAmount: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">সর্বোচ্চ (টাকা)</label>
                  <input
                    type="number"
                    value={formData.maxAmount}
                    onChange={(e) => setFormData({ ...formData, maxAmount: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">TxN উদাহরণ</label>
                <input
                  type="text"
                  value={formData.txnExample}
                  onChange={(e) => setFormData({ ...formData, txnExample: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 font-mono"
                  placeholder="8X7X6X5X"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
                >
                  {editingMethod ? "আপডেট করুন" : "যোগ করুন"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingMethod(null);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition"
                >
                  বাতিল করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentMethods;
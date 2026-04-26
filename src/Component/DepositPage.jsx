// components/DepositPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import useUser from "../hooks/useUsers";
import { FaCopy, FaCheck, FaWallet, FaMobileAlt } from "react-icons/fa";

const DepositPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("bkash");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (location.state?.amount) {
      setAmount(location.state.amount.toString());
    }
  }, [location]);

  const methods = {
    bkash: { 
      name: "বিকাশ", 
      number: "01745624188", 
      icon: "https://i.ibb.co.com/gZpmSgNq/image.png" 
    },
    nagad: { 
      name: "নগদ", 
      number: "01345124414", 
      icon: "https://i.ibb.co.com/m5YqjDpS/image.png" 
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(methods[selectedMethod].number);
    setCopied(true);
    Swal.fire({ 
      title: "কপি হয়েছে!", 
      icon: "success", 
      timer: 1000, 
      showConfirmButton: false 
    });
    setTimeout(() => setCopied(false), 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) < 300) {
      return Swal.fire("ন্যূনতম ৩০০ টাকা", "", "warning");
    }
    if (!transactionId) {
      return Swal.fire("ট্রানজেকশন আইডি দিন", "", "warning");
    }
    
    setSubmitting(true);
    try {
      const res = await fetch("https://backend-project-invest.vercel.app/api/transactions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          amount: parseFloat(amount),
          transactionId,
          paymentMethod: methods[selectedMethod].name,
          phoneNumber: methods[selectedMethod].number,
          status: "pending"
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      Swal.fire({ 
        title: "সফল!", 
        text: "ট্রানজেকশন সাবমিট হয়েছে", 
        icon: "success", 
        confirmButtonColor: "#16a34a" 
      }).then(() => navigate("/transition_history"));
      
      setTransactionId("");
    } catch (error) {
      Swal.fire("ত্রুটি!", error.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-md mx-auto px-4 py-4">
        
        {/* হেডার */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-xl shadow-md mb-2">
            <FaWallet className="text-white text-xl" />
          </div>
          <h1 className="text-lg font-bold text-green-800">রিসার্জ করুন</h1>
        </div>

        {/* ব্যালেন্স কার্ড */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl px-4 py-2 shadow-md mb-4">
          <div className="flex justify-between items-center">
            <p className="text-white/80 text-xs">ব্যালেন্স</p>
            <p className="text-white font-bold text-lg">৳{user?.balance?.toLocaleString() || '0'}</p>
          </div>
        </div>

        {/* মেথড সিলেক্ট */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4 mb-4">
          <div className="flex gap-3 mb-4">
            {Object.keys(methods).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedMethod(key)}
                className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 transition ${
                  selectedMethod === key ? "border-green-600 bottom-5 bg-green-100" : "border-gray-200"
                }`}
              >
                <img 
                  src={methods[key].icon} 
                  alt={methods[key].name}
                  className="w-7 h-7 object-contain"
                />
                <span className={`text-sm font-medium ${selectedMethod === key ? "text-green-700" : "text-gray-600"}`}>
                  {methods[key].name}
                </span>
              </button>
            ))}
          </div>

          {/* পেমেন্ট ইনফো */}
          <div className="bg-green-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FaMobileAlt className="text-green-600 text-xs" />
                <span className="text-green-700 text-xs">এই অ্যাকাউন্টে পেমেন্ট করুন</span>
              </div>
              <button 
                onClick={handleCopy} 
                className="px-2 py-1 bg-white rounded-md text-green-600 text-xs flex items-center gap-1"
              >
                {copied ? <FaCheck size={10} /> : <FaCopy size={10} />}
                {copied ? "কপি হয়েছে" : "কপি"}
              </button>
            </div>
            <p className="text-green-700 font-bold text-center text-base tracking-wider">
              {methods[selectedMethod].number}
            </p>
            <div className="flex justify-between mt-2 pt-2 border-t border-green-200">
              <span className="text-gray-500 text-xs">পরিমাণ</span>
              <span className="text-green-700 font-bold">৳{amount || '0'}</span>
            </div>
          </div>

          {/* ফর্ম */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="TxnID লিখুন"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 mb-3"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-medium text-sm transition active:scale-95 disabled:opacity-50"
            >
              {submitting ? "জমা হচ্ছে..." : "জমা দিন"}
            </button>
          </form>
        </div>

        {/* নোটিশ */}
        <div className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
          <p className="text-amber-700 text-[10px] text-center">
            ⚠️ সঠিক পরিমাণ ও TxnID প্রদান করুন
          </p>
        </div>

      </div>
    </div>
  );
};

export default DepositPage;
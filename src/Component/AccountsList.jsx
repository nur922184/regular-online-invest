// AccountsList.jsx - AgroFund Green Theme
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  FaArrowLeft, 
  FaPlus, 
  FaTrash, 
  FaStar, 
  FaWallet,
  FaCheckCircle,
  FaLeaf,
  FaTractor,
  FaSeedling,
  FaEdit,
  FaPhone,
  FaUser,
  FaBiking
} from 'react-icons/fa';
import useUser from "../hooks/useUsers";

const AccountsList = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`https://backend-project-invest.vercel.app/api/accounts/user/${user._id}`);
      const data = await response.json();
      
      if (data.success) {
        setAccounts(data.accounts);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (accountId) => {
    try {
      const response = await fetch(`https://backend-project-invest.vercel.app/api/accounts/set-default/${accountId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id })
      });
      
      const data = await response.json();
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'সফল!',
          text: 'ডিফল্ট অ্যাকাউন্ট সেট করা হয়েছে',
          confirmButtonColor: '#16a34a',
          timer: 1500
        });
        fetchAccounts();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'ত্রুটি!',
        text: 'ডিফল্ট সেট করতে ব্যর্থ',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleDelete = async (accountId) => {
    const confirm = await Swal.fire({
      title: 'অ্যাকাউন্ট ডিলিট করবেন?',
      text: 'আপনি কি নিশ্চিত? এই কাজটি অপরিবর্তনীয়।',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ, ডিলিট',
      cancelButtonText: 'না',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280'
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`https://backend-project-invest.vercel.app/api/accounts/delete/${accountId}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        if (data.success) {
          Swal.fire({
            icon: 'success',
            title: 'ডিলিট!',
            text: 'অ্যাকাউন্ট ডিলিট করা হয়েছে',
            confirmButtonColor: '#16a34a'
          });
          fetchAccounts();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'ত্রুটি!',
          text: 'ডিলিট করতে ব্যর্থ',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  const getAccountIcon = (type) => {
    if (type === 'bkash') {
      return <FaBiking className="text-pink-500 text-2xl" />;
    }
    return <FaBiking className="text-orange-500 text-2xl" />;
  };

  const getAccountName = (type) => {
    return type === 'bkash' ? 'বিকাশ' : 'নগদ';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="max-w-md mx-auto px-4 py-5">
        
        {/* হেডার */}
        <div className="flex items-center justify-between mb-5">
          <button 
            onClick={() => navigate(-1)} 
            className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center active:bg-green-200 transition"
          >
            <FaArrowLeft className="text-green-700 text-sm" />
          </button>
          
          <div className="flex items-center gap-2">
            <FaWallet className="text-green-600 text-lg" />
            <h1 className="text-lg font-bold text-green-800">আমার অ্যাকাউন্ট</h1>
          </div>
          
          <button
            onClick={() => navigate('/add_account')}
            className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-700 transition"
          >
            <FaPlus className="text-white text-sm" />
          </button>
        </div>

        {/* সামারি কার্ড */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 shadow-md mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs mb-0.5">মোট অ্যাকাউন্ট</p>
              <p className="text-white text-2xl font-bold">{accounts.length}টি</p>
            </div>
            <div className="bg-white/20 p-2 rounded-xl">
              <FaWallet className="text-white text-xl" />
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-white/20">
            <p className="text-white/70 text-[10px]">
              ডিফল্ট: {accounts.find(a => a.isDefault)?.accountType === 'bkash' ? 'বিকাশ' : 'নগদ' || 'নেই'}
            </p>
          </div>
        </div>

        {/* লিস্ট */}
        {loading ? (
          <div className="text-center py-10">
            <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-green-600 text-sm">অ্যাকাউন্ট লোড হচ্ছে...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-green-100">
            <FaWallet className="text-green-300 text-4xl mx-auto mb-3" />
            <p className="text-green-500 text-sm">কোনো অ্যাকাউন্ট যোগ করা হয়নি</p>
            <p className="text-green-400 text-[10px] mt-1">উত্তোলনের জন্য অ্যাকাউন্ট প্রয়োজন</p>
            <button
              onClick={() => navigate('/add_account')}
              className="mt-4 px-6 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
            >
              + অ্যাকাউন্ট যোগ করুন
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account._id}
                className={`bg-white rounded-xl p-4 border transition-all ${
                  account.isDefault 
                    ? 'border-green-500 shadow-md bg-gradient-to-r from-green-50 to-white' 
                    : 'border-green-100 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between">
                  {/* বাম পাশ - আইকন ও তথ্য */}
                  <div className="flex gap-3 flex-1">
                    {/* আইকন */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      account.isDefault ? 'bg-green-100' : 'bg-gray-50'
                    }`}>
                      {getAccountIcon(account.accountType)}
                    </div>
                    
                    {/* তথ্য */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800">
                          {getAccountName(account.accountType)}
                        </h3>
                        {account.isDefault && (
                          <span className="flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            <FaStar size={8} />
                            ডিফল্ট
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs flex items-center gap-1">
                        <FaUser size={10} className="text-green-500" />
                        {account.holderName}
                      </p>
                      <p className="text-gray-600 text-xs flex items-center gap-1 mt-1">
                        <FaPhone size={10} className="text-green-500" />
                        {account.accountNumber}
                      </p>
                      {account.accountName && (
                        <p className="text-gray-400 text-[10px] mt-1">
                          {account.accountName}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* ডান পাশ - অ্যাকশন বাটন */}
                  <div className="flex flex-col gap-2">
                    {!account.isDefault && (
                      <button
                        onClick={() => handleSetDefault(account._id)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition text-xs flex items-center gap-1"
                        title="ডিফল্ট সেট"
                      >
                        <FaStar size={12} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(account._id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="ডিলিট"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
                
                {/* ডিফল্ট অ্যাকাউন্টের জন্য ফুটার */}
                {account.isDefault && (
                  <div className="mt-3 pt-2 border-t border-green-100">
                    <p className="text-green-600 text-[10px] flex items-center gap-1">
                      <FaCheckCircle size={10} />
                      উত্তোলনের জন্য ডিফল্ট অ্যাকাউন্ট
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* অ্যাকাউন্ট যোগ বাটন (নিচে) */}
        {accounts.length > 0 && (
          <div className="mt-5">
            <button
              onClick={() => navigate('/add_account')}
              className="w-full py-2.5 border-2 border-dashed border-green-300 bg-green-50 text-green-600 rounded-lg font-medium text-sm hover:bg-green-100 transition"
            >
              + নতুন অ্যাকাউন্ট যোগ করুন
            </button>
          </div>
        )}

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

export default AccountsList;
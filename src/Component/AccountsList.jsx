import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
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
        Swal.fire('সফল!', 'ডিফল্ট অ্যাকাউন্ট সেট করা হয়েছে', 'success');
        fetchAccounts(); // রিফ্রেশ
      }
    } catch (error) {
      Swal.fire('ত্রুটি!', 'সেট করতে ব্যর্থ', 'error');
    }
  };

  const handleDelete = async (accountId) => {
    const confirm = await Swal.fire({
      title: 'অ্যাকাউন্ট ডিলিট করবেন?',
      text: 'আপনি কি নিশ্চিত?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ, ডিলিট',
      cancelButtonText: 'না'
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`https://backend-project-invest.vercel.app/api/accounts/delete/${accountId}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        if (data.success) {
          Swal.fire('ডিলিট!', 'অ্যাকাউন্ট ডিলিট করা হয়েছে', 'success');
          fetchAccounts();
        }
      } catch (error) {
        Swal.fire('ত্রুটি!', 'ডিলিট করতে ব্যর্থ', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">আমার অ্যাকাউন্টসমূহ</h1>
            <button
              onClick={() => navigate('/add_account')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              + নতুন অ্যাকাউন্ট
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">কোনো অ্যাকাউন্ট যোগ করা হয়নি</p>
              <button
                onClick={() => navigate('/add_account')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                অ্যাকাউন্ট যোগ করুন
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {accounts.map((account) => (
                <div
                  key={account._id}
                  className={`border rounded-lg p-4 ${
                    account.isDefault ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">
                          {account.accountType === 'bkash' ? '📱' : '💳'}
                        </span>
                        <span className="font-bold text-lg">
                          {account.accountType === 'bkash' ? 'বিকাশ' : 'নগদ'}
                        </span>
                        {account.isDefault && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            ডিফল্ট
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700">
                        <span className="font-semibold">নাম:</span> {account.accountName}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">হোল্ডার:</span> {account.holderName}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">নম্বর:</span> {account.accountNumber}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!account.isDefault && (
                        <button
                          onClick={() => handleSetDefault(account._id)}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          ডিফল্ট সেট
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(account._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountsList;
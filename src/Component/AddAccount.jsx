import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useUser from "../hooks/useUsers";

const AddAccount = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountType: 'bkash',
    accountName: '',
    accountNumber: '',
    holderName: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { accountName, accountNumber, holderName } = formData;

    if (!accountName || !accountNumber || !holderName) {
      Swal.fire('ত্রুটি!', 'সব তথ্য পূরণ করুন', 'warning');
      return false;
    }

    const regex = /^01[3-9]\d{8}$/;
    if (!regex.test(accountNumber)) {
      Swal.fire('ত্রুটি!', 'সঠিক নম্বর দিন (01XXXXXXXXX)', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire('লগইন করুন');
      return navigate('/login');
    }

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch('https://backend-project-invest.vercel.app/api/accounts/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, ...formData })
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire('সফল!', 'অ্যাকাউন্ট যোগ হয়েছে', 'success');
        navigate('/withdraw');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      Swal.fire('ত্রুটি!', err.message, 'error');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-4 px-3">
      <div className="max-w-sm mx-auto">

        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold">অ্যাকাউন্ট যোগ করুন</h1>
          <p className="text-xs text-gray-500">বিকাশ / নগদ</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow p-4">
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Type */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {['bkash', 'nagad'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, accountType: type })}
                  className={`py-2 rounded border ${
                    formData.accountType === type
                      ? 'bg-green-100 border-green-500'
                      : 'border-gray-300'
                  }`}
                >
                  {type === 'bkash' ? 'বিকাশ' : 'নগদ'}
                </button>
              ))}
            </div>

            {/* Name */}
            <input
              name="accountName"
              placeholder="অ্যাকাউন্ট নাম"
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />

            {/* Holder */}
            <input
              name="holderName"
              placeholder="হোল্ডার নাম"
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />

            {/* Number */}
            <input
              name="accountNumber"
              placeholder="01XXXXXXXXX"
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
            />

            {/* Info */}
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              ✔ সঠিক নম্বর দিন  
              ✔ Withdraw এর জন্য ব্যবহার হবে
            </div>

            {/* Buttons */}
            <div className="flex gap-2 text-sm">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-2 bg-gray-200 rounded"
              >
                বাতিল
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 bg-green-600 text-white rounded"
              >
                {loading ? 'লোডিং...' : 'যোগ করুন'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAccount;
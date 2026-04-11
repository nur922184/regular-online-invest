import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUsers";

const WithdrawPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    accountId: "",
    amount: "",
    password: ""
  });

  // 🔄 load accounts
  useEffect(() => {
    if (!user) return;

    fetch(`https://backend-project-invest.vercel.app/api/accounts/user/${user._id}`)
      .then(res => res.json())
      .then(data => {
        if (data.accounts.length === 0) {
          Swal.fire({
            title: "অ্যাকাউন্ট নেই!",
            text: "প্রথমে অ্যাকাউন্ট যোগ করুন",
            icon: "warning"
          }).then(() => navigate("/add_account"));
        }
        setAccounts(data.accounts);
      });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.accountId || !form.amount || !form.password) {
      return Swal.fire("সব তথ্য দিন");
    }

    try {
      const res = await fetch("https://backend-project-invest.vercel.app/api/withdrawals/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user._id,
          ...form
        })
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("সফল!", "Withdraw request হয়েছে", "success");
        navigate('/withdrawHisotory')
        setForm({ accountId: "", amount: "", password: "" });
      } else {
        throw new Error(data.message);
      }

    } catch (err) {
      Swal.fire("ত্রুটি!", err.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-4">

        <h2 className="text-lg font-bold mb-3 text-center">
          💸 টাকা তুলুন
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">

          {/* account select */}
          <select
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, accountId: e.target.value })}
          >
            <option value="">অ্যাকাউন্ট নির্বাচন করুন</option>
            {accounts.map(acc => (
              <option key={acc._id} value={acc._id}>
                {acc.accountType.toUpperCase()} - {acc.accountNumber}
              </option>
            ))}
          </select>

          {/* amount */}
          <input
            type="number"
            placeholder="টাকার পরিমাণ"
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          {/* password */}
          <input
            type="password"
            placeholder="পাসওয়ার্ড"
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* info */}
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            ✔ Withdraw করতে পাসওয়ার্ড লাগবে  
            ✔ সঠিক অ্যাকাউন্ট নির্বাচন করুন
          </div>

          <button className="w-full bg-green-600 text-white py-2 rounded">
            Withdraw করুন
          </button>
        </form>

      </div>
    </div>
  );
};

export default WithdrawPage;
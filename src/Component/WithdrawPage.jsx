import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaLock,
  FaMoneyBillWave
} from "react-icons/fa";
import useUser from "../hooks/useUsers";

const WithdrawPage = () => {
  const { user, refetchUser } = useUser(); // 🔥 refetch added
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    accountId: "",
    amount: "",
    password: ""
  });

  // 🔄 Load accounts
  useEffect(() => {
    if (!user) return;

    fetch(
      `https://backend-project-invest.vercel.app/api/accounts/user/${user._id}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.accounts || data.accounts.length === 0) {
          Swal.fire({
            title: "অ্যাকাউন্ট নেই!",
            text: "প্রথমে অ্যাকাউন্ট যোগ করুন",
            icon: "warning"
          }).then(() => navigate("/add_account"));
        } else {
          setAccounts(data.accounts);
        }
      })
      .catch(() => {
        Swal.fire("Error", "Account load failed", "error");
      });
  }, [user, navigate]);

  // 🧠 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.accountId || !form.amount || !form.password) {
      return Swal.fire("সব তথ্য দিন");
    }

    const amount = Number(form.amount);

    if (amount <= 0) {
      return Swal.fire("ভুল!", "সঠিক amount দিন", "warning");
    }

    // ❗ balance check (frontend)
    if (amount > user.balance) {
      return Swal.fire("Error", "পর্যাপ্ত ব্যালেন্স নেই", "error");
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://backend-project-invest.vercel.app/api/withdrawals/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: user._id,
            ...form
          })
        }
      );

      const data = await res.json();

      if (data.success) {
        Swal.fire("সফল!", "Withdraw request হয়েছে", "success");

        // 🔥 update latest balance
        refetchUser && refetchUser();

        navigate("/withdrawHistory");
      } else {
        throw new Error(data.message);
      }

    } catch (err) {
      Swal.fire("ত্রুটি!", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black p-4">
      <div className="max-w-md mx-auto bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)}>
            <FaArrowLeft className="text-white text-lg" />
          </button>
          <h2 className="text-white font-bold">Withdraw</h2>
        </div>

        {/* 💰 Balance */}
        <div className="bg-gradient-to-r from-amber-500 to-yellow-400 p-4 rounded-xl mb-4">
          <p className="text-black text-xs">Available Balance</p>
          <h2 className="text-black text-xl font-bold">
            ৳ {user?.balance?.toLocaleString() || 0}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">

          {/* Account */}
          <div className="bg-white/10 rounded-lg p-2">
            <select
              value={form.accountId}
              onChange={(e) =>
                setForm({ ...form, accountId: e.target.value })
              }
              className="w-full bg-transparent text-white outline-none"
            >
              <option value="">অ্যাকাউন্ট নির্বাচন করুন</option>
              {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                  {acc.accountType.toUpperCase()} - {acc.accountNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="flex items-center bg-white/10 px-2 rounded-lg">
            <FaMoneyBillWave className="text-white/50" />
            <input
              type="number"
              placeholder="টাকার পরিমাণ"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              className="bg-transparent outline-none text-white p-2 w-full"
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-white/10 px-2 rounded-lg">
            <FaLock className="text-white/50" />
            <input
              type="password"
              placeholder="পাসওয়ার্ড"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="bg-transparent outline-none text-white p-2 w-full"
            />
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg"
          >
            {loading ? "Processing..." : "Withdraw করুন"}
          </button>
          <Link to={"/add_account"}>
            <button
              className="w-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 rounded-full my-3"
            >
              একাউন্ট যোগ করুন
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default WithdrawPage;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaArrowLeft,
  FaUser,
  FaPhone,
  FaIdCard
} from "react-icons/fa";
import useUser from "../hooks/useUsers";

const AddAccount = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    accountType: "bkash",
    accountName: "",
    accountNumber: "",
    holderName: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Validation
  const validate = () => {
    const { accountName, accountNumber, holderName } = formData;

    if (!accountName || !accountNumber || !holderName) {
      Swal.fire("ত্রুটি!", "সব তথ্য পূরণ করুন", "warning");
      return false;
    }

    const regex = /^01[3-9]\d{8}$/;
    if (!regex.test(accountNumber)) {
      Swal.fire("ত্রুটি!", "সঠিক নম্বর দিন (01XXXXXXXXX)", "error");
      return false;
    }

    return true;
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire("লগইন করুন");
      return navigate("/login");
    }

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await fetch(
        "https://backend-project-invest.vercel.app/api/accounts/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id, ...formData })
        }
      );

      const data = await res.json();

      if (data.success) {
        Swal.fire("সফল!", "অ্যাকাউন্ট যোগ হয়েছে", "success");
        navigate("/withdraw");
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
          <h2 className="text-white font-bold">Add Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">

          {/* Account Type */}
          <div className="grid grid-cols-2 gap-2">
            {["bkash", "nagad"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, accountType: type })
                }
                className={`py-2 rounded-lg border text-xs ${
                  formData.accountType === type
                    ? "bg-green-500/20 border-green-500 text-green-400"
                    : "border-white/20 text-white/60"
                }`}
              >
                {type === "bkash" ? "বিকাশ" : "নগদ"}
              </button>
            ))}
          </div>

          {/* Account Name */}
          <div className="flex items-center bg-white/10 px-2 rounded-lg">
            <FaIdCard className="text-white/50" />
            <input
              name="accountName"
              placeholder="অ্যাকাউন্ট নাম"
              onChange={handleChange}
              className="bg-transparent outline-none text-white p-2 w-full"
            />
          </div>

          {/* Holder Name */}
          <div className="flex items-center bg-white/10 px-2 rounded-lg">
            <FaUser className="text-white/50" />
            <input
              name="holderName"
              placeholder="হোল্ডার নাম"
              onChange={handleChange}
              className="bg-transparent outline-none text-white p-2 w-full"
            />
          </div>

          {/* Number */}
          <div className="flex items-center bg-white/10 px-2 rounded-lg">
            <FaPhone className="text-white/50" />
            <input
              name="accountNumber"
              placeholder="01XXXXXXXXX"
              onChange={handleChange}
              className="bg-transparent outline-none text-white p-2 w-full"
            />
          </div>

          {/* Info */}
          <div className="text-xs text-white/60 bg-white/5 p-2 rounded">
            ✔ সঠিক নম্বর দিন <br />
            ✔ Withdraw এর জন্য ব্যবহার হবে
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-2 bg-white/10 text-white rounded-lg"
            >
              বাতিল
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold"
            >
              {loading ? "Processing..." : "যোগ করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccount;
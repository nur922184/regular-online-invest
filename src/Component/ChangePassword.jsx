import React, { useState } from "react";
import Swal from "sweetalert2";
import useUser from "../hooks/useUsers";

const ChangePassword = () => {
  const { user } = useUser();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      Swal.fire("সব তথ্য দিন");
      return false;
    }

    if (form.newPassword.length < 6) {
      Swal.fire("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return false;
    }

    if (form.newPassword !== form.confirmPassword) {
      Swal.fire("নতুন পাসওয়ার্ড মিলছে না");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch("https://backend-project-invest.vercel.app/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user._id,
          oldPassword: form.oldPassword,
          newPassword: form.newPassword
        })
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("সফল!", "পাসওয়ার্ড পরিবর্তন হয়েছে", "success");
        setForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        throw new Error(data.message);
      }

    } catch (err) {
      Swal.fire("ত্রুটি!", err.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-4">

        <h2 className="text-lg font-bold text-center mb-4">
          🔐 পাসওয়ার্ড পরিবর্তন
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">

          {/* old password */}
          <input
            type="password"
            name="oldPassword"
            placeholder="পুরাতন পাসওয়ার্ড"
            value={form.oldPassword}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* new password */}
          <input
            type="password"
            name="newPassword"
            placeholder="নতুন পাসওয়ার্ড"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* confirm */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="নতুন পাসওয়ার্ড নিশ্চিত করুন"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* info */}
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            ✔ কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড ব্যবহার করুন  
            ✔ নিরাপত্তার জন্য শক্তিশালী পাসওয়ার্ড দিন
          </div>

          <button className="w-full bg-green-600 text-white py-2 rounded">
            পরিবর্তন করুন
          </button>

        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
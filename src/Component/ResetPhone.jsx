import React, { useState } from "react";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPhone = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    otp: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("https://investify-backend.vercel.app/api/auth/reset-password-phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: state.phone,
        otp: form.otp,
        newPassword: form.password
      })
    });

    const data = await res.json();

    if (data.success) {
      Swal.fire("সফল!", "পাসওয়ার্ড রিসেট হয়েছে", "success");
      navigate("/login");
    } else {
      Swal.fire("ত্রুটি!", data.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow w-full max-w-sm">

        <h2 className="text-lg font-bold mb-3 text-center">
          🔑 Reset Password
        </h2>

        <input
          placeholder="OTP"
          onChange={(e) => setForm({ ...form, otp: e.target.value })}
          className="w-full border p-2 rounded text-sm mb-2"
        />

        <input
          type="password"
          placeholder="নতুন পাসওয়ার্ড"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border p-2 rounded text-sm mb-3"
        />

        <button className="w-full bg-green-600 text-white py-2 rounded text-sm">
          Reset করুন
        </button>

      </form>
    </div>
  );
};

export default ResetPhone;
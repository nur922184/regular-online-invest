import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ForgotPhone = () => {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("https://investify-backend.vercel.app/api/auth/forgot-password-phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });

    const data = await res.json();

    if (data.success) {
      Swal.fire("OTP পাঠানো হয়েছে");
      navigate("/reset-phone", { state: { phone } });
    } else {
      Swal.fire("ত্রুটি!", data.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow w-full max-w-sm">

        <h2 className="text-lg font-bold mb-3 text-center">
          📱 Forgot Password
        </h2>

        <input
          placeholder="01XXXXXXXXX"
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-2 rounded text-sm mb-3"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded text-sm">
          OTP পাঠান
        </button>

      </form>
    </div>
  );
};

export default ForgotPhone;
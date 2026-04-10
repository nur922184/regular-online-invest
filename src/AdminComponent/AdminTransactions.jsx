import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch সব transaction
  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        "https://backend-project-invest.vercel.app/api/transactions/all"
      );

      setTransactions(res.data.transactions || []);
    } catch (err) {
      Swal.fire("Error", "ডাটা লোড হয়নি", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ✅ Approve
  const handleApprove = async (id) => {
    const confirm = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই ট্রানজেকশন এপ্রুভ করলে ব্যালেন্স যোগ হবে",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, এপ্রুভ করুন",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.patch(
        `https://backend-project-invest.vercel.app/api/transactions/approve/${id}`
      );

      Swal.fire("Success", "এপ্রুভ হয়েছে", "success");

      fetchTransactions();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message, "error");
    }
  };

  // ❌ Reject
  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: "Reject করবেন?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.patch(
        `https://backend-project-invest.vercel.app/api/transactions/reject/${id}`
      );

      Swal.fire("Rejected", "ট্রানজেকশন বাতিল করা হয়েছে", "success");

      fetchTransactions();
    } catch (err) {
      Swal.fire("Error", "Failed", "error");
    }
  };

  // ⏳ Loading
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-4">
        📊 Admin Transaction Panel
      </h2>

      {transactions.length === 0 ? (
        <p>কোনো ট্রানজেকশন নেই</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((trx) => (
            <div
              key={trx._id}
              className="bg-white p-4 rounded-xl shadow"
            >
              <div className="flex justify-between">
                <h3 className="font-bold">
                  ৳{trx.amount}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    trx.status === "pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : trx.status === "approved"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {trx.status}
                </span>
              </div>

              <p className="text-sm mt-1">
                🆔 {trx.transactionId}
              </p>

              <p className="text-sm">
                💳 {trx.paymentMethod} ({trx.phoneNumber})
              </p>

              <p className="text-xs text-gray-500">
                {new Date(trx.createdAt).toLocaleString("bn-BD")}
              </p>

              {/* Buttons */}
              {trx.status === "pending" && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleApprove(trx._id)}
                    className="flex-1 bg-green-500 text-white py-2 rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(trx._id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;
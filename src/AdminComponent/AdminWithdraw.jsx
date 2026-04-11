import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AdminWithdraw = () => {
  const [data, setData] = useState([]);

  const loadData = () => {
    fetch("https://backend-project-invest.vercel.app/api/withdrawals/admin/all")
      .then(res => res.json())
      .then(res => setData(res.withdrawals || []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (id, status) => {
    const confirm = await Swal.fire({
      title: `আপনি কি ${status} করতে চান?`,
      icon: "question",
      showCancelButton: true
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch(`https://backend-project-invest.vercel.app/api/withdrawals/admin/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    const data = await res.json();

    if (data.success) {
      Swal.fire("সফল!", data.message, "success");
      loadData();
    } else {
      Swal.fire("ত্রুটি!", data.message, "error");
    }
  };

  const statusStyle = (s) => {
    if (s === "approved") return "bg-green-100 text-green-700";
    if (s === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">

        <h2 className="text-lg font-bold mb-4 text-center">
          👨‍💼 Withdraw Management
        </h2>

        <div className="space-y-3">
          {data.map(item => (
            <div key={item._id} className="bg-white p-3 rounded shadow text-sm">

              <div className="flex justify-between">
                <span className="font-semibold">
                  ৳ {item.amount}
                </span>

                <span className={`px-2 py-1 text-xs rounded ${statusStyle(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div className="text-gray-600 text-xs mt-1">
                👤 {item.userId?.name}
              </div>

              <div className="text-gray-600 text-xs">
                💳 {item.accountType?.toUpperCase()} - {item.accountNumber}
              </div>

              <div className="text-gray-400 text-xs">
                🕒 {new Date(item.createdAt).toLocaleString()}
              </div>

              {item.status === "pending" && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => updateStatus(item._id, "approved")}
                    className="flex-1 bg-green-600 text-white py-1 rounded text-xs"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(item._id, "rejected")}
                    className="flex-1 bg-red-600 text-white py-1 rounded text-xs"
                  >
                    Reject
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminWithdraw;
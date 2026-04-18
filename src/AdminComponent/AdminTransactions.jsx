import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaMoneyBillWave,
  FaSyncAlt,
  FaSearch,
} from "react-icons/fa";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔍 FILTER + SEARCH STATE
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // ================= FETCH =================
  const fetchTransactions = async () => {
    try {
      setRefreshing(true);

      const res = await axios.get(
        "https://backend-project-invest.vercel.app/api/transactions/all"
      );

      setTransactions(res.data.transactions || []);
    } catch (err) {
      Swal.fire("Error", "ডাটা লোড হয়নি", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ================= APPROVE =================
  const handleApprove = async (id) => {
    const confirm = await Swal.fire({
      title: "Approve করবেন?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!confirm.isConfirmed) return;

    await axios.patch(
      `https://backend-project-invest.vercel.app/api/transactions/approve/${id}`
    );

    Swal.fire("Success", "Approved!", "success");
    fetchTransactions();
  };

  // ================= REJECT =================
  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: "Reject করবেন?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!confirm.isConfirmed) return;

    await axios.patch(
      `https://backend-project-invest.vercel.app/api/transactions/reject/${id}`
    );

    Swal.fire("Rejected", "Done", "success");
    fetchTransactions();
  };

  // ================= STATUS STYLE =================
  const getStatus = (status) => {
    switch (status) {
      case "approved":
        return {
          color: "text-green-600",
          bg: "bg-green-100",
          icon: <FaCheckCircle />,
          label: "Approved",
        };
      case "rejected":
        return {
          color: "text-red-600",
          bg: "bg-red-100",
          icon: <FaTimesCircle />,
          label: "Rejected",
        };
      default:
        return {
          color: "text-yellow-600",
          bg: "bg-yellow-100",
          icon: <FaClock />,
          label: "Pending",
        };
    }
  };

  // ================= FILTER + SEARCH LOGIC =================
  const filteredData = transactions.filter((trx) => {
    const matchFilter =
      filter === "all" ? true : trx.status === filter;

    const matchSearch = trx.transactionId
      ?.toLowerCase()
      .includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold">📊 Transactions</h1>

        <button
          onClick={fetchTransactions}
          className="flex items-center gap-2 px-3 py-2 bg-white shadow rounded-lg"
        >
          <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex items-center bg-white p-2 rounded-lg shadow mb-3">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search Transaction ID..."
          className="w-full outline-none text-sm"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "pending", "approved", "rejected"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
              filter === item
                ? "bg-green-500 text-white"
                : "bg-white shadow text-gray-600"
            }`}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No Transaction Found
          </div>
        ) : (
          filteredData.map((trx) => {
            const status = getStatus(trx.status);

            return (
              <div
                key={trx._id}
                className="bg-white rounded-2xl shadow p-4 border hover:shadow-lg transition"
              >
                {/* TOP */}
                <div className="flex justify-between items-center">
                  <h2 className="font-bold flex items-center gap-2">
                    <FaMoneyBillWave className="text-green-500" />
                    ৳ {trx.amount}
                  </h2>

                  <span
                    className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full ${status.bg} ${status.color}`}
                  >
                    {status.icon}
                    {status.label}
                  </span>
                </div>

                {/* INFO */}
                <div className="text-sm text-gray-600 mt-2 space-y-1">
                  <p>🆔 {trx.transactionId}</p>
                  <p>💳 {trx.paymentMethod}</p>
                  <p>📱 {trx.phoneNumber}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(trx.createdAt).toLocaleString("bn-BD")}
                  </p>
                </div>

                {/* ACTION */}
                {trx.status === "pending" && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleApprove(trx._id)}
                      className="flex-1 bg-green-500 text-white py-2 rounded-xl"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(trx._id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-xl"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminTransactions;
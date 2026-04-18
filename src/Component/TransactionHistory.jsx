import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHistory,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaArrowLeft,
  FaSync,
  FaSearch,
  FaCopy
} from "react-icons/fa";
import useUser from "../hooks/useUsers";

const TransactionHistory = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const hasFetched = useRef(false);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // first load only
  const [refreshing, setRefreshing] = useState(false); // button refresh
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  // ✅ Only first load
  useEffect(() => {
    if (user?._id && !hasFetched.current) {
      fetchTransactions(true);
      hasFetched.current = true;
    }
  }, [user]);

  const fetchTransactions = async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const res = await fetch(
        `https://backend-project-invest.vercel.app/api/transactions/user/${user._id}`
      );

      const data = await res.json();

      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusConfig = (status) => {
    if (status === "approved")
      return { color: "text-green-400", icon: FaCheckCircle, label: "অনুমোদিত" };
    if (status === "rejected")
      return { color: "text-red-400", icon: FaTimesCircle, label: "বাতিল" };
    return { color: "text-yellow-400", icon: FaClock, label: "পেন্ডিং" };
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("bn-BD");

  // Filter + Search + Sort
  let filtered = transactions.filter((trx) => {
    const matchFilter = filter === "all" || trx.status === filter;
    const matchSearch = trx.transactionId
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  filtered.sort((a, b) =>
    sort === "latest"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
  );

  const totalBalance = transactions
    .filter((t) => t.status === "approved")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black p-4">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)}>
            <FaArrowLeft className="text-white text-lg" />
          </button>

          <h1 className="text-white font-bold">Transaction History</h1>

          <FaSync
            onClick={() => fetchTransactions(false)}
            className={`text-white cursor-pointer ${
              refreshing ? "animate-spin" : ""
            }`}
          />
        </div>

        {/* Balance */}
        <div className="bg-gradient-to-r from-amber-500 to-yellow-400 p-4 rounded-xl mb-4 shadow-lg">
          <p className="text-black text-xs">Total Approved</p>
          <h2 className="text-black text-xl font-bold">
            ৳ {totalBalance.toLocaleString()}
          </h2>
        </div>

        {/* Search + Sort */}
        <div className="flex gap-2 mb-3">
          <div className="flex items-center bg-white/10 px-2 rounded-lg flex-1">
            <FaSearch className="text-white/50" />
            <input
              type="text"
              placeholder="Search ID..."
              className="bg-transparent outline-none text-white text-xs p-2 w-full"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="bg-white/10 text-white text-xs rounded-lg px-2"
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-3">
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1 text-xs rounded-lg ${
                filter === f
                  ? "bg-amber-500 text-black"
                  : "bg-white/10 text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center text-white/50 py-10">
            Loading transactions...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-white/50 py-10">
            No Transactions Found
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((t) => {
              const { icon: Icon, color, label } = getStatusConfig(t.status);

              return (
                <div
                  key={t._id}
                  className="bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur hover:scale-[1.02] transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={color} />
                      <span className="text-white text-sm font-semibold">
                        ৳ {t.amount}
                      </span>
                    </div>
                    <span className={`${color} text-xs`}>{label}</span>
                  </div>

                  <div className="text-xs text-white/60 space-y-1">
                    <div className="flex justify-between">
                      <span>ID:</span>
                      <span className="flex items-center gap-1">
                        {t.transactionId}
                        <FaCopy
                          className="cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(t.transactionId);
                            alert("Copied!");
                          }}
                        />
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{formatDate(t.createdAt)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Method:</span>
                      <span>{t.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
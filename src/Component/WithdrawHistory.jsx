import React, { useEffect, useState, useRef } from "react";
import {
  FaArrowLeft,
  FaSync,
  FaSearch,
  FaCopy,
  FaCheckCircle,
  FaTimesCircle,
  FaClock
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUsers";

const WithdrawHistory = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const hasFetched = useRef(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user?._id && !hasFetched.current) {
      fetchWithdraws(true);
      hasFetched.current = true;
    }
  }, [user]);

  const fetchWithdraws = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setRefreshing(true);

      const res = await fetch(
        `https://backend-project-invest.vercel.app/api/withdrawals/user/${user._id}`
      );
      const json = await res.json();

      setData(json.withdrawals || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusConfig = (status) => {
    if (status === "approved")
      return { color: "text-green-400", icon: FaCheckCircle, label: "Approved" };
    if (status === "rejected")
      return { color: "text-red-400", icon: FaTimesCircle, label: "Rejected" };
    return { color: "text-yellow-400", icon: FaClock, label: "Pending" };
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("bn-BD");

  // 🔎 Search filter
  const filtered = data.filter((item) =>
    item.accountNumber?.toLowerCase().includes(search.toLowerCase())
  );

  // 💰 Total approved withdraw
  const totalWithdraw = data
    .filter((d) => d.status === "approved")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black p-4">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)}>
            <FaArrowLeft className="text-white text-lg" />
          </button>

          <h1 className="text-white font-bold">Withdraw History</h1>

          <FaSync
            onClick={() => fetchWithdraws(false)}
            className={`text-white cursor-pointer ${
              refreshing ? "animate-spin" : ""
            }`}
          />
        </div>

        {/* Total Withdraw */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-xl mb-4 shadow-lg">
          <p className="text-white text-xs">Total Withdraw (Approved)</p>
          <h2 className="text-white text-xl font-bold">
            ৳ {totalWithdraw.toLocaleString()}
          </h2>
        </div>

        {/* Search */}
        <div className="flex items-center bg-white/10 px-2 rounded-lg mb-3">
          <FaSearch className="text-white/50" />
          <input
            type="text"
            placeholder="Search account..."
            className="bg-transparent outline-none text-white text-xs p-2 w-full"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center text-white/50 py-10">
            Loading withdraws...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-white/50 py-10">
            No Withdraw Found
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const { icon: Icon, color, label } = getStatusConfig(item.status);

              return (
                <div
                  key={item._id}
                  className="bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur hover:scale-[1.02] transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={color} />
                      <span className="text-white text-sm font-semibold">
                        ৳ {item.amount}
                      </span>
                    </div>
                    <span className={`${color} text-xs`}>{label}</span>
                  </div>

                  <div className="text-xs text-white/60 space-y-1">
                    <div className="flex justify-between">
                      <span>Account:</span>
                      <span className="flex items-center gap-1">
                        {item.accountType?.toUpperCase()} - {item.accountNumber}
                        <FaCopy
                          className="cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(item.accountNumber);
                            alert("Copied!");
                          }}
                        />
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{formatDate(item.createdAt)}</span>
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

export default WithdrawHistory;
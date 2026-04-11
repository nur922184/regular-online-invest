import React, { useEffect, useState } from "react";
import useUser from "../hooks/useUsers";

const WithdrawHistory = () => {
  const { user } = useUser();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!user) return;

    fetch(`https://backend-project-invest.vercel.app/api/withdrawals/user/${user._id}`)
      .then(res => res.json())
      .then(res => setData(res.withdrawals || []));
  }, [user]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4">
      <div className="max-w-md mx-auto">

        <h2 className="text-lg font-bold mb-4 text-center">
          📄 Withdraw History
        </h2>

        {data.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">
            কোনো Withdraw history নেই
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow p-3 text-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">
                    ৳ {item.amount}
                  </span>

                  <span
                    className={`px-2 py-1 rounded text-xs ${getStatusStyle(item.status)}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="text-gray-600 mt-1 text-xs">
                  {item.accountType?.toUpperCase()} - {item.accountNumber}
                </div>

                <div className="text-gray-400 text-xs mt-1">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawHistory;
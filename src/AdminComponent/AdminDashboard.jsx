import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    blockedUsers: 0,
    activeUsers: 0
  });

  useEffect(() => {
    fetch("https://backend-project-invest.vercel.app/api/users/admin/dashboard")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data);
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">

        <h2 className="text-lg font-bold text-center mb-5">
          📊 Admin Dashboard
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">

          {/* Total Users */}
          <div className="bg-white shadow rounded p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalUsers}
            </div>
            <div className="text-gray-600 mt-1">Total Users</div>
          </div>

          {/* Active Users */}
          <div className="bg-white shadow rounded p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.activeUsers}
            </div>
            <div className="text-gray-600 mt-1">Active Users</div>
          </div>

          {/* Blocked Users */}
          <div className="bg-white shadow rounded p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.blockedUsers}
            </div>
            <div className="text-gray-600 mt-1">Blocked Users</div>
          </div>

        </div>

        {/* Info Card */}
        <div className="bg-white mt-4 p-3 rounded shadow text-xs text-gray-500 text-center">
          🔐 Real-time user analytics dashboard
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
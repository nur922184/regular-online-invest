import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = () => {
    fetch("https://backend-project-invest.vercel.app/api/users/all")
      .then(res => res.json())
      .then(data => setUsers(data.users || []));
  };

  useEffect(() => {
    loadUsers();
  }, []);
 
  // 🚫 Block / Unblock
  const handleBlock = async (id) => {
    const res = await fetch(
      `https://backend-project-invest.vercel.app/api/users/admin/block-user/${id}`,
      { method: "PUT" }
    );

    const data = await res.json();

    if (data.success) {
      Swal.fire("সফল!", data.message, "success");
      loadUsers();
    }
  };

  // ❌ Delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "ডিলিট করবেন?",
      icon: "warning",
      showCancelButton: true
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch(
      `https://backend-project-invest.vercel.app/api/users/admin/delete-user/${id}`,
      { method: "DELETE" }
    );

    const data = await res.json();

    if (data.success) {
      Swal.fire("ডিলিট হয়েছে!", "", "success");
      loadUsers();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">

        <h2 className="text-lg font-bold text-center mb-4">
          👥 User Management
        </h2>

        <div className="space-y-3">

          {users.map(user => (
            <div
              key={user._id}
              className="bg-white p-3 rounded shadow text-sm"
            >

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-gray-500 text-xs">{user.phone}</p>
                </div>

                <span className={`text-xs px-2 py-1 rounded ${
                  user.isBlocked
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}>
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>

              <div className="flex gap-2 mt-2 text-xs">

                <button
                  onClick={() => handleBlock(user._id)}
                  className={`text-xs px-2 py-1 rounded ${
                  user.isBlocked
                    ? "flex-1 bg-gray-400 text-gray-700 py-1 rounded"
                    : "flex-1 bg-yellow-500 text-white py-1 rounded"
                }`}
                 
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>

                <button
                  onClick={() => handleDelete(user._id)}
                  className="flex-1 bg-red-600 text-white py-1 rounded"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default AdminUsers;
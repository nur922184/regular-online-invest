import { useState, useEffect } from "react";
import axiosInstance from "../Api/axiosInstance";


// 🔥 Get Current User ID
const getCurrentUserId = () => {
  const userId =
    localStorage.getItem("userId") ||
    localStorage.getItem("user_id") ||
    localStorage.getItem("currentUserId");

  const userObj = JSON.parse(localStorage.getItem("user"));

  if (userId) return userId;
  if (userObj?._id) return userObj._id;
  if (userObj?.id) return userObj.id;

  return null;
};

const useUser = (intervalTime = 3000) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const currentUserId = getCurrentUserId();
      if (!currentUserId) return;

      const res = await axiosInstance.get("/users/all");

      const users = res.data?.users || [];

      const currentUser = users.find((u) => u._id === currentUserId);

      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      }
    } catch (err) {
      console.log("User fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    const interval = setInterval(fetchUser, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return { user, loading, refresh: fetchUser };
};

export default useUser;
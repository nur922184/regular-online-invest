import axios from "axios";

const axiosInstance = axios.create({
   baseURL: "https://107.167.94.212/api",  // ✅ বর্তমান URL এর সাথে /api যোগ করবে
  timeout: 10000,
});

// optional: token add (future use)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://107.167.94.212:3001/api",
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
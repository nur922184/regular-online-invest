import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // ইউজার না থাকলে
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // admin না হলে
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
import { Navigate } from "react-router-dom";

const RequireAdminAuth = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const token = localStorage.getItem("token");
  return isAdmin && token ? children : <Navigate to="/admin-login" replace />;
};

export default RequireAdminAuth;
import { Navigate } from "react-router-dom";

const RequireCustomerAuth = ({ children }) => {
  const isPortalAdmin = localStorage.getItem("isPortalAdmin") === "true";
  const token = localStorage.getItem("token");

  return isPortalAdmin && token ? children : <Navigate to="/admin-login" replace />;
};

export default RequireCustomerAuth;
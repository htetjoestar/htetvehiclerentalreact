import { Navigate } from "react-router-dom";

const RequireCustomerAuth = ({ children }) => {
  const isCustomer = localStorage.getItem("isCustomer") === "true";
  const token = localStorage.getItem("token");

  return isCustomer && token ? children : <Navigate to="/customer-login" replace />;
};

export default RequireCustomerAuth;
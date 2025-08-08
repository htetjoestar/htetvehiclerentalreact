import React from "react";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const PortalAdminHeader = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
    const name = localStorage.getItem("adminName");

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isPortalAdmin");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    localStorage.removeItem("adminId");
    navigate("/portal-admin-login");
  };

  return (
    <header className="flex items-center justify-between px-5 py-2 bg-gray-100 border-b border-gray-300">
      <h3> Portal Admin</h3>
        <button 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => navigate("/dashboard")}>Reports Dashboard</button>
        <button 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => navigate("/manage-employee")}>Manage Employee Accounts</button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" 
          onClick={() => navigate("/managecustomers")}>Manage Customer Accounts</button>


    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
      >
        {name}
      </button>
            {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
          <button
            onClick={() => {
              navigate("/portalaccountsettings/"+localStorage.getItem("adminId"));
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Account Settings
          </button>
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
          </div>
    </header>
  );
};

export default PortalAdminHeader;
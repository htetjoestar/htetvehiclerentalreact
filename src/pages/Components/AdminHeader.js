import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("token");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    navigate("/");
  };

  const name = localStorage.getItem("adminName");

  return (
    <header className="flex items-center justify-between px-5 py-2 bg-gray-100 border-b border-gray-300">
      <Link
        to="/admin"
        className="text-lg font-semibold text-blue-600 hover:underline"
      >
        Admin Dashboard
      </Link>

      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => navigate("/managevehicle")}
        >
          Manage Vehicles
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => navigate("/managereservations")}
        >
          Manage Reservations
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => navigate("/managemaintenance")}
        >
          Manage Maintenance
        </button>
      </div>

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
                navigate("/employeeaccountsettings/" + localStorage.getItem("adminId"));
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

export default AdminHeader;
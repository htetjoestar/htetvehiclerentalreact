import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { handleInputChange } from "../../formUtils";

const PasswordResetPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("Missing or invalid reset token.");
    }
  }, [token]);


  const handleChange = handleInputChange(setPasswords);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setStatus("Passwords do not match.");
      return;
    }

    try {
      await axios.post("https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/customer/reset-password", null, {
        params: {
          token,
          newPassword: passwords.newPassword
        }
      });

      setStatus("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/customer-login"), 3000);
    } catch (error) {
      setStatus(error.response?.data || "Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-4 left-4 px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
      >
        Home
      </button>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-700">Reset Your Password</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            name="newPassword"
            type="password"
            value={passwords.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            className="form-input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            value={passwords.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            className="form-input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-sm text-center text-blue-600 min-h-[1.5rem]">
          {status || "\u2800"}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          disabled={!token}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default PasswordResetPage;
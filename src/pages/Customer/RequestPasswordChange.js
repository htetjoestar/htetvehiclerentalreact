import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleInputChange } from "../../formUtils";

const RequestPasswordPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", lastName: "" });
  const [loading,setLoading] =useState(false);
  const [status, setStatus] = useState("");

  const handleChange = handleInputChange(setForm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      await axios.post("http://localhost:8080/api/customer/request-password-reset", null, {
        params: {
          email: form.email,
          lastName: form.lastName
        }
      });
      setStatus("If your info is correct, you'll receive a password reset email.");
      navigate("/");
    } catch (error) {
      setStatus(error.response?.data || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-4 left-4 mb-4 px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
      >
        Home
      </button>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-700">Request Password Reset</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
          name="email"
            type="text"
            placeholder="Your email"
            value={form.email}
            onChange={handleChange}
            className="form-input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
          name="lastName"
            type="text"
            placeholder="Your last name"
            value={form.lastName}
            onChange={handleChange}
            className="form-input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="text-sm text-center text-blue-600 min-h-[1.5rem]">
          {status || "\u2800"}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Send Reset Email
        </button>
      </div>
    </div>
  );
};

export default RequestPasswordPage;
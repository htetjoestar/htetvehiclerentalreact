import React, { useState } from "react";
import axios from "axios";

import PhoneInput from 'react-phone-input-2';
import "./EmployeeForm.css"; // We’ll style it below

export default function EmployeeForm() {
  const [form, setForm] = useState({
    emp_first_name: "",
    emp_last_name: "",
    emp_password: "",
    emp_date_of_birth: "",
    emp_phone_number: "",
    emp_emergency_contact_name: "",
    emp_emergency_contact_number: "",
    emp_active: true,
    emp_last_action: "Created",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const handlePhoneChange = (value) => {
    setForm({
      ...form,
      ['emp_phone_number']: value
    });
  };
    const handleEmergencyPhoneChange = (value) => {
    setForm({
      ...form,
      ['emp_emergency_contact_number']: value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date().toISOString();
    const payload = {
      ...form,
      emp_created_date: now,
      emp_modified_date: now,
      emp_deactivated_date: null
    };

    try {
      const res = await axios.post("https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/employee", payload);
      alert("Employee created successfully!");
      setForm({
        emp_first_name: "",
        emp_last_name: "",
        emp_password: "",
        emp_role: "",
        emp_phone_number: "",
        emp_emergency_contact_name: "",
        emp_emergency_contact_number: "",
        emp_active: true,
        emp_last_action: "Created",
      });
    } catch (err) {
      alert("Failed to create employee");
      console.error(err);
    }
  };

  return (
<div className="max-w-xl mx-auto p-6 bg-green-50 rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Create New Employee</h2>
  <form className="space-y-4" onSubmit={handleSubmit}>
    <div>
      <label className="block text-green-800 font-semibold mb-1">Email:</label>
      <input
        type="text"
        name="emp_email"
        value={form.emp_email}
        onChange={handleChange}
        required
        className="w-full border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    <div>
      <label className="block text-green-800 font-semibold mb-1">First Name:</label>
      <input
        type="text"
        name="emp_first_name"
        value={form.emp_first_name}
        onChange={handleChange}
        required
        className="w-full border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    <div>
      <label className="block text-green-800 font-semibold mb-1">Last Name:</label>
      <input
        type="text"
        name="emp_last_name"
        value={form.emp_last_name}
        onChange={handleChange}
        required
        className="w-full border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    <div>
      <label className="block text-green-800 font-semibold mb-1">Password:</label>
      <input
        type="password"
        name="emp_password"
        value={form.emp_password}
        onChange={handleChange}
        required
        className="w-full border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

<div>
  <label className="block text-green-800 font-semibold mb-1">Role:</label>
  <select
    name="emp_role"
    value={form.emp_role}
    onChange={handleChange}
    required
    className="w-full border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
  >
    <option value="">Select a role</option>
    <option value="Vehicle Executive">Vehicle Executive</option>
    <option value="Portal Admin">Portal Admin</option>
  </select>
</div>
        <div>
          <label className=" flex block text-sm font-medium mb-1">
             <p className="block text-sm font-medium text-red-500">*</p>
              Phone number:
          </label>   
        <PhoneInput
          country={'us'}
          value={form.emp_phone_number}
          onChange={handlePhoneChange}
          inputStyle={{ width: '100%' }}
          className="w-full border"
        />
        </div>

    <div>
      <label className="block text-green-800 font-semibold mb-1">Emergency Contact Name:</label>
      <input
        type="text"
        name="emp_emergency_contact_name"
        value={form.emp_emergency_contact_name}
        onChange={handleChange}
        required
        className="w-full border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>


        <div>
          <label className=" flex block text-sm font-medium mb-1">
             <p className="block text-sm font-medium text-red-500">*</p>
              Phone number:
          </label>   
        <PhoneInput
          country={'us'}
          value={form.emp_emergency_contact_number}
          onChange={handleEmergencyPhoneChange}
          inputStyle={{ width: '100%' }}
          className="w-full border"
        />
        </div>



    <button
      type="submit"
      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors duration-200"
    >
      Submit
    </button>
  </form>
</div>
  );
}
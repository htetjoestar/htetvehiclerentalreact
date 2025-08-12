import React, { useEffect, useState } from "react";
import {useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './employee.css'

export default function EmployeeDetail() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const nav = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
      let processedValue = value;
  if (name === "emp_active") {
    processedValue = value === "true"; // Convert string to boolean
  }

    setEmployee({
      ...employee,
      [name]: type === 'checkbox' ? checked : processedValue
    });
  };
const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date().toISOString();
    console.log('Employee Data Submitted:', employee);
    const payload = {
        ...employee,
        emp_created_date: now,
        emp_modified_date: now,
        emp_deactivated_date: null,
        emp_last_action: "Updated"
    }
    e.preventDefault();
    fetch(`https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/employee/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(() => {
      console.log("Vehicle updated");
    });
  };
  useEffect(() => {
    axios.get(`https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/employee/${id}`)
      .then(response => setEmployee(response.data))
      .catch(error => console.error("Error fetching employee:", error));
  }, [id]);

  if (!employee) return <p>Loading...</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg max-w-2xl mx-auto">
        <p>
    <button 
      onClick={() => nav(-1)} 
      className="px-4 py-2 mb-5 bg-gray-200 hover:bg-gray-300 rounded"
    >
      Back
    </button>
  </p>
      <h2>Inspect Employee #{employee.employee_id}</h2>
      <p><strong>Name:</strong> {employee.emp_first_name} {employee.emp_last_name}</p>
      <p><strong>Phone:</strong> {employee.emp_phone_number}</p>
      <p><strong>Emergency Contact:</strong> {employee.emp_emergency_contact_name} ({employee.emp_emergency_contact_number})</p>
      <p><strong>Created:</strong> {employee.emp_created_date}</p>
      <p><strong>Last Action:</strong> {employee.emp_last_action}</p>
         <form className="mb-4" onSubmit={handleSubmit}>  
        <div className="w-1/4">

        <label className="block text-gray-700 text-sm font-bold mb-2 capitalize">
              Role:
        </label>
        <select
        name="Role"
        value={employee.role}
        onChange={handleChange}
        required
        className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
        <option value="Portal Admin">Portal Admin</option>
        <option value="Vehicle Executive">Vehicle Executive</option>
      </select>
      </div>
        <div className="w-1/4">
        <label className="block text-gray-700 text-sm font-bold mb-2 capitalize">
              Active Status:
        </label>
<select
  name="emp_active" // match the state key
  value={String(employee.emp_active)} // convert boolean to string for select
  onChange={handleChange}
  required
  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
>
  <option value="true">Active</option>
  <option value="false">Inactive</option>
</select>
      </div>
              <button 
        className="bg-green-500 hover:bg-green-600 mt-5 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
        type="submit">Save</button>
</form>   


    </div>
  );
}
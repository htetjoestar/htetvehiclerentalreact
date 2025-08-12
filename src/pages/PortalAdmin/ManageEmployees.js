import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './employee.css'
import AdminHeader from "../Components/AdminHeader";
const ManageEmployees = () => {
  const now = new Date();
  const [reservations, setReservations] = useState([]);
  const [filters, setFilters] = useState({
    startDate:'',
    endDate:'',
  });
    const [error, setError] = useState('');
  const navigate = useNavigate();

      const [page, setPage] = useState(0);
      const [totalPages, setTotalPages] = useState(1); // backend sends this
      const pageSize = 10;  
        const [sortField, setSortField] = useState("");
      const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

      const fetchCustomers = async (filters, page) => {
  const sortParam = sortField ? `${sortField},${sortOrder}` : "";

  try {
    const response = await axios.post(
      `https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/employee/filter?page=${page}&size=${pageSize}${sortParam ? `&sort=${sortParam}` : ""}`,
      filters
    );
    setReservations(response.data.content);
    setTotalPages(response.data.totalPages);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
  }
};
  useEffect(() => {
    fetchCustomers(filters, page);
  }, [sortField, sortOrder,page]);

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle sort order
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // Set new sort field and default to ascending
      setSortField(field);
      setSortOrder("asc");
    }

    // Reset to page 0 and refetch
    setPage(0);
  };
  function formatDateTime(dateString) {
  const date = new Date(dateString);

  // Get time components
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Get date components
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  // Return formatted string
  return `${hours}:${minutes}:${seconds} ${month}/${day}/${year}`;
}
  function formatLocalDate(dateStr) {
    if(dateStr == null){
      return;
    }
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString();
  }
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
          let processedValue = value;
  if (name === "active") {
    if (value === "") {
      processedValue = null; // user selected "All"
    } else {
      processedValue = value === "true"; // convert string to boolean
    }
  } else {
    processedValue = type === "checkbox" ? checked : value;
  }
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : processedValue,
    });
  };

    const handleClick = async (e) => {
    e.preventDefault();
    const now = new Date();
    setError("");
    if (!filters.startDate ^ !filters.endDate) {
      setError('Please select both pickup and drop-off dates.');
      return;
    }

    if (new Date(filters.startDate) > new Date(filters.endDate)) {
      setError('End date must be after start date.');
      return;
    }


    try {
      
      const response = await axios.post('https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/employee/filter', filters);
      setReservations(response.data.content);
      console.log("Filtered vehicles:", response.data.content);
    } catch (error) {
      console.error("Error fetching filtered vehicles:", error);
    }
  }


  return (
  <div>
    <h2 className="m-6 text-2xl font-semibold mb-4">Manage Admin Accounts</h2>

  <div className="flex flex-wrap bg-gray-100 ml-6 mr-6 items-end">
    <h2 className="w-full ml-4 text-lg font-semibold">Filters</h2>
    <div className="ml-4 px-2 py-2">
    <div className="w-40">
    <label className="flex flex-col text-sm">
      Keyword:

    <input
      type="text"
      name="keyword"
      onChange={handleChange}
      value={filters.keyword}
      required
      className="mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
    />
    </label>

    </div>

<div className="flex flex-row items-end space-x-4">
    <label className="flex ml-6 mr-6 mb-2 flex-col text-sm">
      Active:
<select
  name="active" // match the state key
  value={String(filters.active)} // convert boolean to string for select
  onChange={handleChange}
  required
 className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
>
  <option value="">All</option>
  <option value="true">Active</option>
  <option value="false">Inactive</option>
</select>
    </label>    
  <label className="flex flex-col text-sm">
    Start Date:
    <input
      type="date"
      name="startDate"
      value={filters.startDate}
      onChange={handleChange}
      required
      className="mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </label>
  <label className="flex flex-col text-sm">
    End Date:
    <input
      type="date"
      name="endDate"
      value={filters.endDate}
      onChange={handleChange}
      required
      className="mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </label>


  <button
    onClick={handleClick}
    className="px-3 py-2 h-[40px] bg-green-600 text-white rounded hover:bg-green-700 transition"
  >
    Save
  </button>

              {/* Error Message */}
        {error && (
          <div className="text-red-600 font-medium mt-4 w-full text-center">
            {error}
          </div>
        )}  

</div>    
</div>
</div>
      <button
    className="mt-6 ml-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
    onClick={() => navigate("/adminemployee")}
  >
    New Employee
  </button>

<div className="overflow-x-auto max-w-full">
    <table className="min-w-full table-auto border-collapse">
      <thead>
      <tr className="bg-gray-100 text-black">
      <th className="border px-4 py-2 text-left">#</th>
      <th className="border px-4 py-2 text-left">email</th>
      <th
        className="border px-4 py-2 text-left cursor-pointer"
        onClick={() => handleSort('emp_first_name')}
      >
        first name{" "}
        <span className="text-gray-400">
          {sortField === 'emp_first_name' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
        </span>
      </th>
      <th
        className="border px-4 py-2 text-left cursor-pointer"
        onClick={() => handleSort('emp_last_name')}
      >
        last name{" "}
        <span className="text-gray-400">
          {sortField === 'emp_last_name' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
        </span>
      </th>
      <th className="border px-4 py-2 text-left">role</th>
      <th className="border px-4 py-2 text-left">phone number</th>
      <th
  className="border px-4 py-2 text-left cursor-pointer"
  onClick={() => handleSort('emp_created_date')}
>
  created date{" "}
  <span className="text-gray-400">
    {sortField === 'emp_created_date' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
  </span>
</th>
      <th className="border px-4 py-2 text-left">last action</th>      
      <th
  className="border px-4 py-2 text-left cursor-pointer"
  onClick={() => handleSort('emp_modified_date')}
>
  modified date{" "}
  <span className="text-gray-400">
    {sortField === 'emp_modified_date' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
  </span>
</th>
      <th className="border px-4 py-2 text-left">active</th>
      <th className="border px-4 py-2 text-left">Action</th>

      </tr>
      </thead>
      <tbody>
        {reservations.map(maint => (
          <tr key={maint.employee_id} style={{ borderBottom: "1px solid #ccc" }}>
            <td>{maint.employee_id}</td>
            <td>{maint.emp_email}</td>
            <td>{maint.emp_first_name}</td>
            <td>{maint.emp_last_name}</td>
            <td>{maint.emp_role}</td>
            <td>+{maint.emp_phone_number}</td>
            <td>{formatDateTime(maint.emp_created_date)}</td>
            <td>{maint.emp_last_action}</td>            
            <td>{formatDateTime(maint.emp_modified_date)}</td>

              <td>{maint.emp_active ? "Yes" : "No"}</td>
            
              <td>
                <button
                  onClick={() => navigate(`/inspect-employee/${maint.employee_id}`)}
                  style={{ padding: "6px 12px", backgroundColor: "#0077cc", color: "#fff", border: "none", borderRadius: "4px" }}
                >
                  Inspect
                </button>
              </td>
            </tr>
          ))}
      </tbody>
      </table>
</div>
  <div className="flex justify-center items-center space-x-4 mt-4">
  <button
    onClick={() => setPage(prev => Math.max(prev - 1, 0))}
    disabled={page === 0}
    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
  >
    Previous
  </button>

  <span className="text-sm">
    Page {page + 1} of {totalPages}
  </span>

  <button
    onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
    disabled={page >= totalPages - 1}
    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
  >
    Next
  </button>
</div>
    </div>
    );
}

export default ManageEmployees;
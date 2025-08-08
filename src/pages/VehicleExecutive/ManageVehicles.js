import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './employee.css'
import Admin from "../Admin";
import AdminHeader from "../Components/AdminHeader";

export default function ManageVehicles() {
  const [vehicles, setVehicles] = useState([]);
    const [filters, setFilters] = useState({
    });
      const [error, setError] = useState('');
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1); // backend sends this
  const pageSize = 10;  
  const [sortField, setSortField] = useState("");
const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
const fetchVehicles = async (filters, page) => {
  const sortParam = sortField ? `${sortField},${sortOrder}` : "";

  try {
    const response = await axios.post(
      `http://localhost:8080/api/vehicle/adminfilter?page=${page}&size=${pageSize}${sortParam ? `&sort=${sortParam}` : ""}`,
      filters
    );
    setVehicles(response.data.content);
    setTotalPages(response.data.totalPages);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
  }
};

  useEffect(() => {
    fetchVehicles(filters, page);
  }, [sortField, sortOrder,page]);


  const handleSort = (field) => {
  if (sortField === field) {
    setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
  } else {
    setSortField(field);
    setSortOrder("asc");
  }

  setPage(0);
  fetchVehicles(filters, 0);
  };
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
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  
    const handleClick = async (e) => {
    e.preventDefault();
    const now = new Date();
    setError("");

    setPage(0); // Reset to first page on filter
    fetchVehicles(filters, 0);
   }

  return (
<div>
  <AdminHeader />
  <h2 className="m-6 text-2xl font-semibold mb-4">Manage Vehicles</h2>


    <div className="flex flex-wrap bg-gray-100 ml-6 mr-6 items-end">
    <h2 className="w-full ml-4 text-lg font-semibold">Filters</h2>
    <div className="ml-4 px-2 py-2">
    <label className="w-1/2 flex flex-col text-sm">
    Search:
    <input
      type="text"
      name="keyword"
      value={filters.keyword}
      onChange={handleChange}
      required
      className="mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </label>

<div className="mr-6 flex flex-row items-end space-x-4">


    <label className="flex flex-col text-sm">
      Type:
      <select
        name="type"
        value={filters.type || ''}
        onChange={handleChange}
        className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">-- Select Type --</option>
        <option value="Sedan">Sedan</option>
        <option value="Truck">Truck</option>
        <option value="Sport">Sport</option>
        <option value="SUV">SUV</option>
        <option value="Van">Van</option>        
      </select>
    </label>

    <div className="w-40">
    <label className="flex flex-col text-sm">
      Status:

  <select
    name="vehicle_status"
    value={filters.vehicle_status}
    onChange={handleChange}
    className="px-4 py-2 border rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">-- Select Status --</option>
    <option value="Listed">Listed</option>
    <option value="Unlisted">Unlisted</option>
    <option value="Maintenance">Maintenance</option>
  </select>
    </label>

    </div>

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
    onClick={() => navigate("/newvehicle")}
  >
    New Vehicle
  </button>
<div className="mr-6">
  <table className="ml-4 w-full table-auto border-collapse">
<thead>
  <tr className="bg-gray-100 text-black">
    <th className="border px-4 py-2 text-left">ID</th>

    <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('license_plate')}>
      License Plate {sortField === 'license_plate' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
    </th>

    <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('model')}>
      Model {sortField === 'model' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
    </th>

    <th className="border px-4 py-2 text-left">Image</th>
    <th className="border px-4 py-2 text-left">Color</th>

    <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('type')}>
      Type {sortField === 'type' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
    </th>

    <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('num_seats')}>
      Number of Seats {sortField === 'num_seats' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
    </th>
<th className="border px-4 py-2 text-left">Fuel</th>
    <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('vehicle_status')}>
      Status {sortField === 'vehicle_status' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
    </th>

    <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('base_charge_per_day')}>
      Base Charge/Day {sortField === 'base_charge_per_day' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
    </th>

    <th className="border px-4 py-2 text-left">Action</th>
  </tr>
</thead>
    <tbody>
      {vehicles.map((veh) => (
        <tr key={veh.vehicle_id} className="border-b">
          <td>{veh.vehicle_id}</td>
          <td>{veh.license_plate}</td>
          <td>{veh.model} {veh.brand} {veh.make_year}</td>
          <td>
            {veh.image_url ? (
              <img
                src={'http://localhost:8080' + veh.image_url}
                alt="Vehicle"
                className="w-20 rounded"
              />
            ) : (
              <span>No image</span>
            )}
          </td>
          <td>{veh.color}</td>
          <td>{veh.type}</td>
          <td>{veh.num_seats}</td>
          <td>{veh.fuel}</td>
          <td>{veh.vehicle_status}</td>
          <td>{veh.base_charge_per_day}</td>
          <td>
            <button
              onClick={() => navigate(`/vehicle/${veh.vehicle_id}`)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Inspect
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

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

</div>
  );
}
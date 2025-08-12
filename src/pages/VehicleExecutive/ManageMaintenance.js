import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './employee.css'
import AdminHeader from "../Components/AdminHeader";
import { handleInputChange } from '../../formUtils';
const ManageMaintenance = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [vehicle, setVehicle] = useState({});
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1); // backend sends this
  const navigate = useNavigate();

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
const fetchMainteance = async (page) => {
  const sortParam = sortField ? `${sortField},${sortOrder}` : "";
  try {
    const response = await axios.post(
      `https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/maintenance/status?${status ? `&status=${status}` : ""}?page=${page}&size=10${sortParam ? `&sort=${sortParam}` : ""}`
    );
    setMaintenance(response.data.content);
    setTotalPages(response.data.totalPages);
  } catch (error) {
    console.error("Error fetching reservations:", error);
  }
};

useEffect(() => {
  fetchMainteance(page);
}, [sortField, sortOrder, status, page]);


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
    setStatus(value);
  };
  
  return (
  <div>
    <AdminHeader />
    <div className="container mr-5">
    <h2 className="m-6 text-2xl font-semibold mb-4">Manage Maintenance</h2>
    <h2 className="m-7 text-lg font-semibold">Filter</h2>
    <select
      className="ml-8 mr-6 px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
      name="maint_status" value={status} onChange={handleChange}>
        <option value="">-- Select Status --</option>s
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
    </select>

  <div className="overflow-x-auto max-w-full ml-6">
    <table className="min-w-full table-auto border-collapse">
      <thead>
      <tr className="bg-gray-100 text-black">
      <th className="border px-4 py-2 text-left">#</th>
      
      <th className="border px-4 py-2 text-left">vehicle</th>
      <th className="border px-4 py-2 text-left">maintenance status</th>
      <th className="border px-4 py-2 text-left">details</th>
      <th className="border px-4 py-2 text-left">start date</th>
      <th className="border px-4 py-2 text-left">end date</th>
      <th className="border px-4 py-2 text-left">Action</th>
      </tr>
      </thead>
      <tbody>
        {maintenance.map(maint => (
          <tr key={maint.vehicle_id} style={{ borderBottom: "1px solid #ccc" }}>
            <td>{maint.maintenance_id}</td>
            <td>{maint.vehicle}</td>
            <td>{maint.maint_status}</td>
            <td>{maint.details}</td>
            <td>{formatLocalDate(maint.start_date)}</td>
            <td>{formatLocalDate(maint.end_date)}</td>
              <td>
                <button
                  onClick={() => navigate(`/maintenance/${maint.maintenance_id}`)}
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
    </div>
    );
}

export default ManageMaintenance;
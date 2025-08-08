import React, { useState,useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import AdminHeader from './Components/AdminHeader';
import axios from 'axios';

function Admin() {
  const location = useLocation();
  const id = localStorage.getItem("adminId");
  const [employee, setEmployee] = useState([]);
    const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
const [page, setPage] = useState(0);
const [totalPages, setTotalPages] = useState(1); // backend sends this

  const [sortField, setSortField] = useState("reservation_id");
  const [sortOrder, setSortOrder] = useState("desc");
const pageSize = 10; 

  const fetchReservations = async (filters) => {
    const sortParam = sortField ? `${sortField},${sortOrder}` : "";
    try {
      const response = await axios.post(
        `http://localhost:8080/api/reservation/nextweek?page=${page}&size=10${sortParam ? `&sort=${sortParam}` : ""}`,
        filters
      );
      setReservations(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  useEffect(() => {
    axios.get("http://localhost:8080/api/employee/"+id)
      .then(response => setEmployee(response.data))
      .catch(error => console.error("Error fetching employees:", error));
    }, []);

  useEffect(() => {
    fetchReservations();
  }, [page,sortField, sortOrder]);

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
    function formatLocalDate(dateStr) {
    if(dateStr == null){
      return;
    }
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString();
  }

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
  return (
    
    <div>
      <AdminHeader />
      <h2 className="m-6 text-lg font-semibold mb-4">Welcome back, {employee.emp_first_name}</h2>
      

      <h2 className="m-6 text-lg font-semibold mb-4">Reservations due this week</h2>


    <div className="overflow-x-auto max-w-full ml-2 mr-2">
        <table className="min-w-full table-auto border-collapse">
      <thead>
        <tr className="bg-gray-100 text-black">
          <th className="border px-4 py-2 text-left">#</th>
          <th
            className="border px-4 py-2 text-left cursor-pointer"
            onClick={() => handleSort('res_created_date')}
          >
            created date{" "}
            <span className="text-gray-400">
              {sortField === 'res_created_date' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
            </span>
          </th>
          <th className="border px-4 py-2 text-left">customer id</th>
          <th className="border px-4 py-2 text-left">vehicle id</th>
          <th className="border px-4 py-2 text-left">status</th>

          <th
            className="border px-4 py-2 text-left cursor-pointer"
            onClick={() => handleSort('pick_up_date')}
          >
            pick up date{" "}
            <span className="text-gray-400">
              {sortField === 'pick_up_date' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
            </span>
          </th>

          <th
            className="border px-4 py-2 text-left cursor-pointer"
            onClick={() => handleSort('drop_off_date')}
          >
            drop off date{" "}
            <span className="text-gray-400">
              {sortField === 'drop_off_date' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
            </span>
          </th>
          <th
            className="border px-4 py-2 text-left cursor-pointer"
            onClick={() => handleSort('actual_pick_up_date')}
          >
            actual pick up date{" "}
            <span className="text-gray-400">
              {sortField === 'actual_pick_up_date' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
            </span>
          </th>
          <th
            className="border px-4 py-2 text-left cursor-pointer"
            onClick={() => handleSort('actual_drop_off_date')}
          >
            actual drop off date{" "}
            <span className="text-gray-400">
              {sortField === 'actual_drop_off_date' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
            </span>
          </th>

                    <th className="border px-4 py-2 text-left">baby seat</th>
                    <th className="border px-4 py-2 text-left">insurance</th>
                    <th className="border px-4 py-2 text-left">late fee</th>
                    <th className="border px-4 py-2 text-left">damages</th>
          <th
            className="border px-4 py-2 text-left cursor-pointer"
            onClick={() => handleSort('total_charge')}
          >
            total cost{" "}
            <span className="text-gray-400">
              {sortField === 'total_charge' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
            </span>
          </th>          
          <th className="border px-4 py-2 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map(maint => (
          <tr key={maint.resevation_id} style={{ borderBottom: "1px solid #ccc" }}>
            <td>{maint.reservation_id}</td>
            <td>{maint.res_created_date ? formatDateTime(maint.res_created_date) : "N/A"}</td>
            <td>{maint.customer}</td>
            <td>{maint.vehicle}</td>
            <td>{maint.res_status}</td>
            <td>{formatLocalDate(maint.pick_up_date)}</td>
            <td>{formatLocalDate(maint.drop_off_date)}</td>
            <td>{maint.actual_pick_up_date ? formatLocalDate(maint.actual_pick_up_date) : "N/A"}</td>
            <td>{maint.actual_drop_off_date ? formatLocalDate(maint.actual_drop_off_date) : "N/A"}</td>
            
            <td>{maint.baby_seat}</td>
            <td>{maint.insurance}</td>
            <td>{maint.late_fee ? `$${maint.late_fee}` : "N/A"}</td>
            <td>{maint.damages ? `$${maint.damages}` : "N/A"}</td>
            <td>{`$${maint.total_charge}`}</td>
            
              <td>
                <button
                  onClick={() => navigate(`/emp_reservation/${maint.reservation_id}`)}
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

export default Admin;
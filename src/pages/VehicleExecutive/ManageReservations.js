import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './employee.css'
import AdminHeader from "../Components/AdminHeader";
import { handleInputChange } from '../../formUtils';
const ManageReservations = () => {
  const now = new Date();
  const [reservations, setReservations] = useState([]);
  const [filters, setFilters] = useState({
    startDate:'',
    endDate:'',
  });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1); // backend sends this

  const [sortField, setSortField] = useState("reservation_id");
  const [sortOrder, setSortOrder] = useState("desc");
  const pageSize = 10;  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchReservations = async (filters, page) => {
    const sortParam = sortField ? `${sortField},${sortOrder}` : "";
    try {
      const response = await axios.post(
        `https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/reservation/filter?page=${page}&size=10${sortParam ? `&sort=${sortParam}` : ""}`,
        filters
      );
      setReservations(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
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
  

  useEffect(() => {
    document.title = "Manage Reservations";
    fetchReservations(filters, page);
  }, []);


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

  const handleChange = handleInputChange(setFilters);

const handleClick = (e) => {
  e.preventDefault();
  setError("");
  if (!filters.startDate ^ !filters.endDate) {
    setError('Please select both pickup and drop-off dates.');
    return;
  }
  if (new Date(filters.startDate) > new Date(filters.endDate)) {
    setError('End date must be after start date.');
    return;
  }
  setPage(0); // Reset to first page on filter
  fetchReservations(filters, 0);
};

const handleClick2 = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.get(
      'https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/reservation/report/monthly',
      {
        params: filters,
        responseType: 'blob', // This is key for downloading files
      }
    );

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'monthly_report.xlsx'; // Use .xlsx extension
    a.click();

    URL.revokeObjectURL(url); // Clean up
  } catch (error) {
    console.error("Error fetching and downloading Excel report:", error);
  }
};
  return (
  <div >
    <AdminHeader />
    <h2 className="m-6 text-2xl font-semibold mb-4">Manage Reservations</h2>

  <div className="flex flex-wrap bg-gray-100 ml-6 mr-6 items-end">
    <h2 className="w-full ml-4 text-lg font-semibold">Filters</h2>
    <div className="ml-4 px-2 py-2">
    <div className="w-40">
    <label className="flex flex-col text-sm">
      Status:

  <select
    name="res_status"
    value={filters.res_status}
    onChange={handleChange}
    className="px-4 py-2 border rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">-- Select Status --</option>
    <option value="Reserved">Reserved</option>    
    <option value="Rented">Rented</option>
    <option value="Maintenance">Maintenance</option>
    <option value="Cancelled">Cancelled</option>

  </select>
    </label>

    </div>

<div className="flex flex-row items-end space-x-4">
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
  onClick={handleClick2}
  className="mt-5 ml-5  px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
>
  Generate Report
</button>


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

export default ManageReservations;
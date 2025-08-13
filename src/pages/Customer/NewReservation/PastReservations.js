import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const PastReservations = () => {
  const name = localStorage.getItem("customerName");

    const [page, setPage] = useState(0);
    const [status, setStatus] = useState('Completed');
    const [totalPages, setTotalPages] = useState(1); // backend sends this
  const [comReservations, setComReservations] = useState([]);

  const navigate = useNavigate();
  const customerId = localStorage.getItem("customerId");

  const fetchReservations = async ( page) => {

    const response = await axios.post(`https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/reservation/statuspage?page=${page}&size=10`, {
      customer_id: customerId,
      res_status: status
    })  
      setComReservations(response.data.content);
      setTotalPages(response.data.totalPages); 
  }
  

  useEffect(() => {
    if (!customerId) return;
    fetchReservations(page);
  }, [status]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStatus(value);
  };
  const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'text-green-600';
    case 'Pending':
      return 'text-yellow-500';
    case 'Rented':
      return 'text-orange-500';
    case 'failed':
    case 'cancelled':
    case null:
      return 'text-red-600';
    
    default:
      return 'text-gray-600';
  }
  };
  function formatLocalDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString();
  }
  const renderReservations = (reservations, navigate, getStatusColor) => {
return reservations.map((maint) => (
  <div
    key={maint.reservation_id}
    onClick={() =>
      navigate(`/customer-review-reservation/${maint.reservation_id}`)
    }
    className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
  >
    <div className="grid md:grid-cols-5 gap-6 text-gray-700 text-base items-start">
      {/* IMAGE + VEHICLE DETAILS */}
      <div className="col-span-1">
        {maint.image_url ? (
          <img
            src={maint.image_url}
            alt="Vehicle"
            className="h-28 object-cover rounded mb-2"
          />
        ) : (
          <span>No image</span>
        )}
        <div>
          <span className="font-semibold">Vehicle:</span>{" "}
          {maint.vehicleBrand} {maint.vehicleModel} ({maint.make_year})
        </div>
      </div>

      {/* OTHER DETAILS */}
 <div className="col-span-4 mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
  <div className="mt-15 flex flex-col">
    <span className="font-semibold">Pick Up Date:</span>
    <p className="text-2xl my-auto">{formatLocalDate(maint.pick_up_date)}</p>
  </div>

  <div className="flex flex-col">
    <span className="font-semibold">Drop Off Date:</span>
    <p className="text-2xl my-auto">{formatLocalDate(maint.drop_off_date)}</p>
  </div>

  <div className="flex flex-col">
    <span className="font-semibold">Total Cost:</span>
    <p className="text-2xl my-auto">${maint.total_charge}</p>
  </div>

  <div className="flex flex-col">
    <span className="font-semibold">Status:</span>
    <span className={`text-2xl my-auto ${getStatusColor(maint.res_status)}`}>
      {maint.res_status}
    </span>
  </div>
</div>
    </div>
  </div>
));
};

  return (

    <div className="space-y-6 p-10">
      <div className="flex flex-wrap">
      <h2 className="m-6 text-2xl font-semibold mb-4">Previous Reservations</h2>
          <select
      className="ml-8 mr-6 px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
      name="maint_status" value={status} onChange={handleChange}>
        <option value="Cancelled">Cancelled</option>
        <option value="Completed">Completed</option>
    </select>
    </div>
      {renderReservations(comReservations, navigate, getStatusColor)}

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

export default PastReservations;
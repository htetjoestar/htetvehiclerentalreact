import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const CustomerManageReservations = () => {
  const name = localStorage.getItem("customerName");
  const [reservations, setReservations] = useState([]);

  const [inReservations, setInReservations] = useState([]);

  const navigate = useNavigate();
  const customerId = localStorage.getItem("customerId");

  

  useEffect(() => {
    if (!customerId) return;

    axios.post(`http://localhost:8080/api/reservation/status`, {
      customer_id: customerId,
      res_status: "Reserved"
    })
      .then(response => setReservations(response.data))
      .catch(error => console.error("Error fetching reservations:", error));

    axios.post(`http://localhost:8080/api/reservation/status`, {
      customer_id: customerId,
      res_status: "Rented"
    })
      .then(response => setInReservations(response.data))
      .catch(error => console.error("Error fetching reservations:", error));
 
  }, []);

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
            src={`http://localhost:8080${maint.image_url}`}
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
      <h2 className="m-6 text-2xl font-semibold mb-4">In progress reservations</h2>

      {renderReservations(inReservations, navigate, getStatusColor)}

      {renderReservations(reservations, navigate, getStatusColor)}

    </div>
    );
}

export default CustomerManageReservations;
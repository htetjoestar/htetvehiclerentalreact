import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CustReviewReservation = () => {
  const nav = useNavigate();
  const { id } = useParams();

  const [reservation, setReservation] = useState({});
  const [vehicle, setVehicle] = useState({});
  const [customer, setCustomer] = useState({});

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const diffTime = new Date(reservation.drop_off_date) - new Date(reservation.pick_up_date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;


  useEffect(() => {
    axios.get(`http://localhost:8080/api/reservation/${id}`)
    .then(response => {
      setReservation(response.data);
      console.log("Fetched reservation:", response.data.vehicle);



      const vehicleRes = axios.get(`http://localhost:8080/api/vehicle/${response.data.vehicle}`);
        vehicleRes.then(vehicleResponse => {
            setVehicle(vehicleResponse.data);
            console.log("Fetched vehicle:", vehicleResponse.data);
        });


       const customerRes = axios.get(`http://localhost:8080/api/customer/${response.data.customer}`);
        customerRes.then(customerRes => {
            setCustomer(customerRes.data);
        });  
        
        
    })
    .catch(error => {
      console.error("Error fetching maintenance data:", error);
    });
  }, [id]);
 const handleReceipt = async (e) => {
  e.preventDefault();
  const now = new Date().toISOString();

  try {

    const response = await axios.get(`http://localhost:8080/api/reservation/pdf/${id}`,{
      responseType: 'blob'
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
     a.download = 'receipt.pdf'; // Use .xlsx extension
    a.href = url;
    a.click();

    URL.revokeObjectURL(url); // Clean up
  } catch (err) {
    console.error("Download failed:", err);
  }

};
  function formatLocalDate(dateStr) {
    if(dateStr == null){
      return;
    }
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString();
  }
  
  const handleCancel = async (e) => {
    const now = new Date().toISOString();
    const payload = {
        ...reservation,
        res_created_date: now,
        res_modified_date: now,
        res_cancellation_date: now,
        res_status: "Cancelled",
        res_last_action: "Cancelled"
    }
    e.preventDefault();
    await fetch(`http://localhost:8080/api/reservation/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(() => {
      console.log("Vehicle updated");
    });
    window.location.reload();
  };



  return (
    <div>
      <div className="min-h-[calc(100vh-10vh)] flex flex-col items-center justify-center px-4 py-8">

      <div className="flex flex-col md:flex-row items-start space-y-8 md:space-y-0 md:space-x-6 bg-green-100 p-8 rounded shadow-md w-full max-w-4xl">

      {/* Vehicle Card */}
      <div key={vehicle.vehicle_id} className="border border-gray-300 rounded-lg p-4 w-[300px] shadow-sm bg-white">
        {vehicle.image_url ? (
          <img
            src={'http://localhost:8080' + vehicle.image_url}
            alt="vehicle"
            className="w-full h-40 object-cover rounded mb-2"
          />
        ) : (
          <span>No image</span>
        )}
        <h3 className="mt-2 mb-1 font-semibold">Vehicle ID: {vehicle.vehicle_id}</h3>
        <p><strong>License Plate:</strong> {vehicle.license_plate}</p>
        <p><strong>Model:</strong> {vehicle.model} {vehicle.brand} ({vehicle.make_year})</p>
        <p><strong>Color:</strong> {vehicle.color}</p>
        <p><strong>Type:</strong> {vehicle.type}</p>
        <p><strong>Seats:</strong> {vehicle.num_seats}</p>
        <p><strong>Base Charge/Day:</strong> ${vehicle.base_charge_per_day}</p>
      </div>

      {/* Reservation Info Card */}
      <div className="border border-gray-300 rounded-lg p-4 w-[300px] shadow-sm bg-white">
        <h3 className="font-semibold text-green-900 mb-2">Reservation</h3>
        <div>
          <strong className='text-green-900'>Customer:</strong>
          <p>{customer.cust_first_name} {customer.cust_last_name}</p>
        </div>

        <div>
          <strong className='text-green-900'>Pick-up Date:</strong>
          <p> {formatLocalDate(reservation.pick_up_date)} </p>
        </div>

        <div>
          <strong className='text-green-900'>Drop-off Date:</strong> 
          <p>{formatLocalDate(reservation.drop_off_date)}</p>
        </div>
        
        <div>
          <strong className='text-green-900'>Baby Seat:</strong> 
          <p>{reservation.baby_seat} * $100 = ${reservation.baby_seat*100}</p>
        </div>
        
        <div>
          <strong className='text-green-900'>Insurance:</strong>
          <p> {diffDays} days * $100 = ${diffDays*100}</p>
        </div>
        <div>
          <strong className='text-green-900'>Late fee:</strong>
          <p> ${reservation.late_fee}</p>
        </div>
        <div>
          <strong className='text-green-900'>Damage fees:</strong>
          <p> ${reservation.damages}</p>
        </div>
        <div>
          <strong className='text-green-900'>Total Cost:</strong>
          <p> ${reservation.total_charge + reservation.insurance + (reservation.baby_seat*100) + reservation.late_fee + reservation.damages}</p>
        </div>
      </div>
      
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <p>
            <button 
                onClick={() => nav(-1)} 
                className="absolute top-20 left-12 mb-4 px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
            >
            Back
        </button>
        </p>

        <div className="space-y-4">

        <div className="max-w-md mx-auto mt-10 p-6 rounded-md">
        <p>
            <button 
            onClick={() => setShowDeleteModal(true)} 
            disabled={reservation.res_status === "Cancelled" || reservation.res_status === "Completed"}
            className={`mb-4 px-4 py-2 rounded transition w-full
                ${reservation.res_status === "Cancelled" || reservation.res_status === "Completed" 
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                    : "bg-green-100 text-black-800 hover:bg-red-200"}`}
            >
                Cancel
            </button>

  
    <button
      className="mb-4 px-4 py-2 rounded w-full bg-green-600 text-white hover:bg-green-700 transition"
      onClick={handleReceipt}
    >
      Print Receipt
    </button>

        </p>
        </div>
        </div>
    </div>

      
      </div>
      
{showDeleteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Confirm Cancellation</h2>
      <p className="text-gray-700 mb-6">
        Are you sure you want to cancel this reservation?
      </p>
            <p className="text-gray-700 mb-6">
         This action cannot be undone.
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
        >
          Close
        </button>
        <button
        onClick={handleCancel}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Cancel Reservation
        </button>
      </div>

      {/* Close icon (optional) */}
      <button
        onClick={() => setShowDeleteModal(false)}
        className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
      >
        &times;
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default CustReviewReservation;
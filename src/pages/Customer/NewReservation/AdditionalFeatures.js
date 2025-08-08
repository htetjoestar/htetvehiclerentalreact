import React, { useState,useEffect, useContext } from 'react';
import axios from 'axios';
import { ReservationContext } from '../../Components/ReservationContext'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';

const AdditionalFeatures = () => {
    const navigate = useNavigate();
    const { reservation, setReservation } = useContext(ReservationContext);
    const customerId = localStorage.getItem("customerId");
    const [vehicle, setVehicle] = useState([]);
    // Local input states pre-filled with context data (in case of back-navigation)
    const [baby_seat, setBaby_seat] = useState(reservation.baby_seat || 0);
    const [insurance, setInsurance] = useState(false);
    const [loading, setLoading] = useState(false);

    const diffTime = new Date(reservation.drop_off_date) - new Date(reservation.pick_up_date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

        
    useEffect(() => {
    axios.get("http://localhost:8080/api/vehicle/"+reservation.vehicle)
      .then(response => setVehicle(response.data))
      .catch(error => console.error("Error fetching employees:", error));
    }, []);

    const handleSubmit = async () => {
    // Save to context
    const now = new Date().toISOString();
    const insuranceAmount = insurance ? diffDays * 100 : 0;
    setReservation({
      ...reservation,
        customer: customerId, 
        baby_seat: baby_seat,
        total_charge: (vehicle.base_charge_per_day * diffDays) + (baby_seat*100) + insuranceAmount,
        insurance: insuranceAmount
    });

    

    navigate('/reservation/payment');
    
    }


    return (
      <div>
        <div>
            <button 
                onClick={() => navigate(-1)} 
                className="mb-4 px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
            >
            Back
        </button>
        </div>
        
<div className="flex justify-center items-center min-h-[calc(100vh-20vh)] p-6">

  <div className="flex flex- md:flex-row items-start space-y-8 md:space-y-0 md:space-x-6 bg-green-100 p-8 rounded shadow-md w-full max-w-5xl">
    
    {/* Vehicle + Reservation Info (Stacked vertically) */}
    <div className="flex flex-col space-y-6">

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
        <p><strong>License Plate:</strong> {vehicle.license_plate}</p>
        <p><strong>Model:</strong> {vehicle.model} {vehicle.brand} {vehicle.make_year}</p>
        <p><strong>Color:</strong> {vehicle.color}</p>
        <p><strong>Type:</strong> {vehicle.type}</p>
        <p><strong>Fuel:</strong> {vehicle.fuel}</p>
        <p><strong>Seats:</strong> {vehicle.num_seats}</p>
        <p><strong>Base Charge/Day:</strong> ${vehicle.base_charge_per_day}</p>
      </div>

      {/* Reservation Info Card */}
      <div className="border border-gray-300 rounded-lg p-4 w-[300px] shadow-sm bg-white">
        <h3 className="font-semibold mb-2">Reservation</h3>
        <p><strong>Pick-up Date:</strong> {reservation.pick_up_date}</p>
        <p><strong>Drop-off Date:</strong> {reservation.drop_off_date}</p>
      </div>

    </div>

        
    {/* Form Section */}
<div className="bg-white border border-gray-300 rounded-lg p-4 w-[300px] max-w-md shadow-sm">
  <div>
    <label className="block text-sm font-medium text-gray-700">Baby Seat</label>
    <input
      type="number"
      value={baby_seat}
      onChange={e => setBaby_seat(e.target.value)}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
    />
  </div>

  <div className="flex items-center justify-between mt-4">
    <label className="text-sm font-medium text-gray-700">Insurance</label>
    <button
      type="button"
      onClick={() => setInsurance(!insurance)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        insurance ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          insurance ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>

  <button 
    onClick={handleSubmit} 
    className={`w-full mt-5 mb-4 px-4 py-2 rounded transition 
      ${reservation.res_status === "Cancelled" || reservation.res_status === "Completed" 
        ? "bg-gray-500 text-gray-500 cursor-not-allowed" 
        : "bg-green-400 text-white hover:bg-green-600"}`}
  >
    Submit
  </button>
</div>
      <div className="flex flex-wrap border border-gray-300 rounded-lg p-4 w-[300px] shadow-sm bg-white">
        <h3 className="font-semibold mb-2">Reservation costs</h3>
        <p><strong>Baby seat:</strong> {baby_seat} * ${100} = ${baby_seat*100}</p>
        {insurance ?
         (<p><strong>Insurance:</strong> {diffDays} days * ${100} = ${diffDays*100}</p>
      ):(<p><strong>Insurance:</strong> {0} days * ${100} = ${0*100}</p>)
      }
        <p><strong>Base charge:</strong> {diffDays} days * ${vehicle.base_charge_per_day} = ${vehicle.base_charge_per_day * diffDays}</p>

                {insurance ?
         (<p><strong>Total charge:</strong> ${(vehicle.base_charge_per_day * diffDays) + (baby_seat*100) + (diffDays*100)}</p>
      ):(<p><strong>Total charge:</strong> ${(vehicle.base_charge_per_day * diffDays) + (baby_seat*100) + (0*100)}</p>)
      }
       
      </div>
  </div>
</div>
</div>
  );
}

export default AdditionalFeatures;
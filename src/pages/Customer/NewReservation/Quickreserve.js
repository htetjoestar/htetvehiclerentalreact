import React, { useState,useEffect, useContext } from 'react';
import axios from 'axios';
import { ReservationContext } from '../../Components/ReservationContext'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';

const QuickReserve = () => {
    const navigate = useNavigate();
    const { reservation, setReservation } = useContext(ReservationContext);
    const customerId = localStorage.getItem("customerId");
    const [vehicle, setVehicle] = useState([]);
    // Local input states pre-filled with context data (in case of back-navigation)
    
      const [pick_up_date, setPickupDate] = useState(reservation.pick_up_date);
      const [drop_off_date, setDropoffDate] = useState(reservation.drop_off_date);
        const [error, setError] = useState('');
    const [baby_seat, setBaby_seat] = useState(reservation.baby_seat || 0);
    const [insurance, setInsurance] = useState(false);
    const [loading, setLoading] = useState(false);

    const diffTime = new Date(reservation.drop_off_date) - new Date(reservation.pick_up_date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const insuranceAmount = insurance ? diffDays * 100 : 0;

    const total = (vehicle.base_charge_per_day * diffDays) + (baby_seat*100) + insuranceAmount;        
    useEffect(() => {
    axios.get("https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/vehicle/"+reservation.vehicle)
      .then(response => setVehicle(response.data))
      .catch(error => console.error("Error fetching employees:", error));
    }, []);
  useEffect(() => {
    if (reservation.customer && reservation.pick_up_date && reservation.drop_off_date && reservation.total_charge > 0) {
        navigate('/reservation/payment', {
          state: { reservation }
        });
    }
  }, [reservation]);
    const handleSubmit = async (e) => {
    // Save to context
    e.preventDefault();
      const parseLocalDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-based
  };
    const today = new Date();
    today.setHours(0, 0, 0, 0); // sets time to 00:00:00
    const pickup = parseLocalDate(pick_up_date);
    const dropoff = parseLocalDate(drop_off_date);
    setError('');
    if (!pick_up_date || !drop_off_date) {
      setError('Please select both pickup and drop-off dates.');
      return;
    }


    if (pickup < today || dropoff < today) {
      setError('Please select today or a future date.');
      return;
    }

    if (new Date(pick_up_date) > new Date(drop_off_date)) {
      setError('Drop-off date must be after pickup date.');
      return;
    }
    const updatedReservation = {
      ...reservation,
      customer: customerId,
      pick_up_date,
      drop_off_date,
      baby_seat,
      insurance: insuranceAmount,
      total_charge:total
    };

    setReservation(updatedReservation);
    }
const saveDates = async (e) => {


    
        setReservation(prev => ({
      ...prev,
      pick_up_date: pick_up_date,
      drop_off_date: drop_off_date,
      total_charge:total
    }));

    e.preventDefault();

  };

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

    </div>
    <div>
    <div className="bg-white border border-gray-300 rounded-lg p-4 w-[275px] max-w-md shadow-sm">
                <div className="">
      <label className="mb-1">Pick-Up Date:</label>
      <input
        className="mt-1 block w-3/4 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
        type="date"
        value={pick_up_date}
        onChange={e => setPickupDate(e.target.value)}
      />
    </div>

    <div className="">
      <label className="mb-1">Drop-Off Date:</label>
      <input
        className="mt-1 block w-3/4 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
        type="date"
        value={drop_off_date}
        onChange={e => setDropoffDate(e.target.value)}
      />
    </div>
                                      {/* Error Message */}
        {error && (
          <div className="text-red-600 font-medium mb-4 mt-4 mr-6 px-4 py-2 w-full">
            {error}
          </div>
        )}  
 
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
  {/* Insurance Switch */}
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
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                    : "bg-green-100 text-black-800 hover:bg-green-200"}`}
            >
                Submit
            </button>
    </div>

  </div>
</div>
</div>
  );
}

export default QuickReserve;
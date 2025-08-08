import React, { useState,useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReservationContext } from '../../Components/ReservationContext'; 
import axios from 'axios';

const DateScreen = () => {
  const { reservation, setReservation } = useContext(ReservationContext);
  const navigate = useNavigate();

  // Local input states pre-filled with context data (in case of back-navigation)
  const [pick_up_date, setPickupDate] = useState(reservation.pick_up_date || '');
  const [drop_off_date, setDropoffDate] = useState(reservation.drop_off_date || '');
  const [error, setError] = useState('');
  const scrollRef = useRef(null);
  const [vehicles, setVehicles] = useState([]);

      
  const vehicleTypes = ["Sedan", "Truck", "Van", "Sport", "SUV"];
    const [selectedType, setSelectedTypes] = useState("Sedan");

      useEffect(() => {
      axios.get('http://localhost:8080/api/vehicle/available/'+selectedType, {
      })
        .then(response => setVehicles(response.data))
        .catch(error => console.error("Error fetching vehicles:", error));
      }, [selectedType]);  
const scrollLeft = () => {
  const container = scrollRef.current;
  if (!container) return;

  // If at the start, jump to the end
  if (container.scrollLeft <= 0) {
    container.scrollTo({
      left: container.scrollWidth,
      behavior: 'smooth',
    });
  } else {
    container.scrollBy({ left: -300, behavior: 'smooth' });
  }
};
  const handleQuickReserve = (input) => {
    // Save to context
    setReservation(prev => ({
      ...prev,
      vehicle: input, // Assuming you want to save the selected vehicle ID
    }));

    // Navigate to the next step
    navigate('/reservation/quick-reserve');
  };

const scrollRight = () => {
  const container = scrollRef.current;
  if (!container) return;

  // If at the end, jump to the start
  const atEnd =
    container.scrollLeft + container.offsetWidth >= container.scrollWidth - 5;

  if (atEnd) {
    container.scrollTo({
      left: 0,
      behavior: 'smooth',
    });
  } else {
    container.scrollBy({ left: 300, behavior: 'smooth' });
  }
};
  const parseLocalDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-based
  };

  const handleNext = () => {
    setError(''); // clear any existing errors

    const today = new Date();
    today.setHours(0, 0, 0, 0); // sets time to 00:00:00
    const pickup = parseLocalDate(pick_up_date);
    const dropoff = parseLocalDate(drop_off_date);
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

    // Save to context
    setReservation(prev => ({
      ...prev,
      pick_up_date: pick_up_date,
      drop_off_date: drop_off_date,
    }));

    // Navigate to the next step
    navigate('/reservation/select-vehicle');
  };

  return (
     <div>
      <div
  className="bg-rental-hero bg-cover w-full"
  style={{ backgroundPosition: 'center 20%' }}
>
<div className="flex justify-center items-center">
  <div>
  <div className="flex flex-col md:flex-row items-center mt-40 space-y-4 md:space-y-0 md:space-x-6 bg-green-100  p-8 rounded shadow-md w-fit">
    <h2 className="text-xl font-semibold">Select Rental Dates</h2>

    <div className="flex flex-col">
      <label className="mb-1">Pick-Up Date:</label>
      <input
        className="px-4 py-2 text-black rounded"
        type="date"
        value={pick_up_date}
        onChange={e => setPickupDate(e.target.value)}
      />
    </div>

    <div className="flex flex-col">
      <label className="mb-1">Drop-Off Date:</label>
      <input
        className="px-4 py-2 text-black rounded"
        type="date"
        value={drop_off_date}
        onChange={e => setDropoffDate(e.target.value)}
      />
    </div>


    <button
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      onClick={handleNext}
    >
      Next: Select Vehicle
    </button>
    </div>
              {/* Error Message */}
        {error && (
          <div className="text-red-600 font-medium mt-4 w-full text-center">
            {error}
          </div>
        )}    
  </div>

  
</div>
      <div className="w-full max-w-screen px-4 md:px-12 mt-8">
    <h2 className="text-2xl font-bold mb-4 text-center  md:text-left text-gray-800">
      Recommended Vehicles
    </h2>
    <div className="flex flex-wrap mb-4 gap-2 w-full max-w-2xl">
  {vehicleTypes.map((type) => (
    <button
      key={type}
      type="button"
      onClick={() => setSelectedTypes(type)}
      className={`px-4 py-2 rounded-full border ${
        selectedType === type
          ? "bg-green-600 text-white"
          : "bg-white text-gray-700"
      } hover:bg-green-100 border-gray-300`}
    >
      {type}
    </button>
  ))}
</div>


</div>

    <div className="relative min-w-[calc(100vh-50vh) overflow-hidden">
  {/* Left Arrow */}
  <button
    onClick={scrollLeft}
    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md"
  >
    &#8592;
  </button>


  {/* Scrollable Container */}
  <div
    ref={scrollRef}
    className="flex overflow-x-auto bg-gray-100 bg-opacity-50 space-x-4 px-12 py-4 scroll-smooth snap-x snap-mandatory"
  >
    {vehicles.map((veh) => (
<div
  key={veh.vehicle_id}
  className="flex-shrink-0 border border-gray-300 rounded-lg p-4 w-[280px] shadow-sm bg-white snap-start"
>
  {veh.image_url ? (
    <img
      src={`http://localhost:8080${veh.image_url}`}
      alt="Vehicle"
      className="w-full h-40 object-contain rounded mb-2"
    />
  ) : (
    <span className="text-sm text-gray-500">No image</span>
  )}

  <p className="text-lg font-semibold mb-1">
    {veh.brand} {veh.model} {veh.make_year}
  </p>
  <p className="text-sm text-gray-500 "> {veh.type}</p>

  <div className="flex items-center justify-between mt-2">
    {/* Icon group - vertical */}
    <div className="flex flex-col gap-2 text-gray-600">
      {/* Seats */}
      <div className="flex items-center text-sm" title="Seats">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 14c1.657 0 3 1.343 3 3v3H5v-3c0-1.657 1.343-3 3-3h8zM12 14v-2m0 0a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
        <span>{veh.num_seats}</span>
      </div>

      {/* Fuel */}
      <div className="flex items-center text-sm" title="Fuel Type">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 3H8a2 2 0 00-2 2v14h2v-4a2 2 0 012-2h4a2 2 0 012 2v4h2V5a2 2 0 00-2-2z" />
        </svg>
        <span>{veh.fuel}</span>
      </div>
    </div>

    {/* Base Charge */}
    <div className="text-right">
      <span className="text-sm text-gray-600 block">Base Charge/Day</span>
      <span className="text-2xl font-bold">${veh.base_charge_per_day}</span>
    </div>
  </div>

  <button
    onClick={() => handleQuickReserve(veh.vehicle_id)}
    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
  >
    Book Now
  </button>
</div>
    ))}
  </div>

  {/* Right Arrow */}
  <button
    onClick={scrollRight}
    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md"
  >
    &#8594;
  </button>
</div>
  </div>
 </div>
  );
};

export default DateScreen;
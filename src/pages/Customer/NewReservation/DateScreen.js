import React, { useState,useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReservationContext } from '../../Components/ReservationContext'; 
import axios from 'axios';
import VehicleCard from '../../Components/VehicleCard';

const DateScreen = () => {
  const { reservation, setReservation } = useContext(ReservationContext);
  const navigate = useNavigate();

  // Local input states pre-filled with context data (in case of back-navigation)
  const [pick_up_date, setPickupDate] = useState(reservation.pick_up_date || '');
  const [drop_off_date, setDropoffDate] = useState(reservation.drop_off_date || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);
  const [vehicles, setVehicles] = useState([]);

      
  const vehicleTypes = ["Sedan", "Truck", "Van", "Sport", "SUV"];
  const [selectedType, setSelectedTypes] = useState("Sedan");

  useEffect(() => {
    document.title = "Home - Htet Vehicle Rental";
    setLoading(true); // start loading when fetching
    setError('');

    axios.get(
      `https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/vehicle/available/${selectedType}`
    )
      .then(response => {
        setVehicles(response.data);
        setLoading(false); // stop loading after success
      })
      .catch(err => {
        console.error("Error fetching vehicles:", err);
        setError("Failed to fetch vehicles.");
        setLoading(false); // stop loading even if error
      });
  }, [selectedType]);
  
    const handleQuickReserve = (input) => {
      // Save to context
      setReservation(prev => ({
        ...prev,
        vehicle: input, // Assuming you want to save the selected vehicle ID
      }));

      // Navigate to the next step
      navigate('/reservation/quick-reserve');
    };


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
  className="flex overflow-x-auto bg-gray-100 bg-opacity-50 space-x-4 px-12 py-4 scroll-smooth snap-x snap-mandatory min-h-[400px]"
>
  {loading ? (
    <div className="flex space-x-4">
      {/* Fake skeleton cards while loading */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex-shrink-0 border border-gray-300 rounded-lg p-4 w-[280px] shadow-sm bg-white snap-start animate-pulse"
        >
          <div className="w-full h-40 bg-gray-200 rounded mb-2" />
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
        </div>
      ))}
    </div>
  ) : (
    vehicles.map((veh) => (
        <VehicleCard
          key={veh.vehicle_id}
          vehicle={veh}
          handleQuickReserve={handleQuickReserve}
        />
    ))
  )}
    
      
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
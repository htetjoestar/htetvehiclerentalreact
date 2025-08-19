import React, { useState,useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ReservationContext } from '../../Components/ReservationContext'; // Adjust the import path as necessary
import VehicleCard from '../../Components/VehicleCard';

const VehicleSelect = () => {
  const nav = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const { reservation, setReservation } = useContext(ReservationContext);
    const [vehicleRequest, setVehicleRequest] = useState({
  color: null,
  num_seats: null,
  types: null,
    event_start_date: reservation.pick_up_date,
    event_end_date:reservation.drop_off_date
  });

  const vehicleTypes = ["Sedan", "Truck", "Van", "Sport", "SUV"];
  
  const [vehicles, setVehicles] = useState([]);
  const SEAT_LIMITS = {
  default: 8,
  Sedan: 6,
  Truck:8,
  SUV:8,
  Sport:4
  };
  const [selectedTypes, setSelectedTypes] = useState(["Sedan", "Truck", "Van", "Sport", "SUV"]);
  const [pick_up_date, setPickupDate] = useState(reservation.pick_up_date);
  const [drop_off_date, setDropoffDate] = useState(reservation.drop_off_date);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true); 
    axios.post("https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/vehicle/filter", {
    color: vehicleRequest.color || null,
    num_seats: vehicleRequest.num_seats ? parseInt(vehicleRequest.num_seats) : null,
    types: selectedTypes || null,
    event_start_date: reservation.pick_up_date,
    event_end_date:reservation.drop_off_date
  })
      .then(response => {
        setVehicles(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching vehicles:", err);
        setError("Failed to fetch vehicles.");
        setLoading(false); 
      });
  }, [selectedTypes, vehicleRequest]);


  const handleNext = (input) => {
    // Save to context
    setReservation(prev => ({
      ...prev,
      vehicle: input, // Assuming you want to save the selected vehicle ID
    }));

    // Navigate to the next step
    navigate('/reservation/additional-features');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVehicleRequest({
      ...vehicleRequest,
      [name]: type === "checkbox" ? checked : value,
    });
  };
const handleSeats = (e) => {
  const { name, value, type, checked } = e.target;

  if (type === "checkbox") {
    setVehicleRequest((prev) => ({
      ...prev,
      [name]: checked,
    }));
    return;
  }

  // Determine limit based on vehicle type or default
  const limit = SEAT_LIMITS[vehicleRequest.type] ?? SEAT_LIMITS.default;

  const numericValue = value;
  console.log(limit);
  if (numericValue <= limit) {
    setVehicleRequest((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  } else {
    // Optionally, handle value below limit
    setVehicleRequest((prev) => ({
      ...prev,
      [name]: limit,
    }));
    console.warn(`Value ${numericValue} is below minimum seat limit of ${limit}.`);
  }
};

  const toggleType = (type) => {
    let updatedTypes;

    if (selectedTypes.includes(type)) {
      updatedTypes = selectedTypes.filter((t) => t !== type);
    } else {
      updatedTypes = [...selectedTypes, type];
    }

    setSelectedTypes(updatedTypes);
    setVehicleRequest((prev) => ({ ...prev, type: updatedTypes }));
  };

  const toggleAll = () => {
    const isAllSelected = selectedTypes.length === vehicleTypes.length;
    const updatedTypes = isAllSelected ? [] : [...vehicleTypes];

    setSelectedTypes(updatedTypes);
    setVehicleRequest((prev) => ({ ...prev, type: updatedTypes }));
  };
  const saveDates = async (e) => {

        const now = new Date();
        setError('');
    if (!pick_up_date || !drop_off_date) {
      setError('Please select both pickup and drop-off dates.');
      setVehicles([]);
      return;
    }

    if (new Date(pick_up_date) < now || new Date(drop_off_date) < now) {
      setError('Please select dates from tomorrow onwards.');
      setVehicles([]);
      return;
    }

    if (new Date(pick_up_date) > new Date(drop_off_date)) {
      setError('Drop-off date must be after pickup date.');
      setVehicles([]);
      return;
    }
        setReservation(prev => ({
      ...prev,
      pick_up_date: pick_up_date,
      drop_off_date: drop_off_date,
    }));

    e.preventDefault();
    try {
      const response = await     axios.post("https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/vehicle/filter", {
        color: null,
        num_seats: null,
        types: null,
        event_start_date: reservation.pick_up_date,
        event_end_date:reservation.drop_off_date
    });
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching filtered vehicles:", error);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/vehicle/filter', {
        color: vehicleRequest.color || null,
        num_seats: vehicleRequest.num_seats ? parseInt(vehicleRequest.num_seats) : null,
        types: selectedTypes || null,
        event_start_date: reservation.pick_up_date,
        event_end_date:reservation.drop_off_date
      });
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching filtered vehicles:", error);
    }
  };

  // Local input states pre-filled with context data (in case of back-navigation)
    return (
<div className="">
  {/* Filters and Save button - Top section */}
        <div className='flex flex-wrap items-center justify-center bg-gray-100 rounded shadow-md p-6 mb-8 w-1/2 mx-auto'>
            <button 
                onClick={() => nav(-1)} 
                className="mb-4 ml-4 mt-4 mr-6 px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
            >
            Back
        </button>
                <div className="mr-6">
      <label className="mb-1">Pick-Up Date:</label>
      <input
        className="px-4 py-2 text-black rounded"
        type="date"
        value={pick_up_date}
        onChange={e => setPickupDate(e.target.value)}
      />
    </div>

    <div className="">
      <label className="mb-1">Drop-Off Date:</label>
      <input
        className="px-4 py-2 text-black rounded"
        type="date"
        value={drop_off_date}
        onChange={e => setDropoffDate(e.target.value)}
      />
    </div>

     <button 
       onClick={saveDates} 
       className="mb-4 ml-4 mt-4 mr-6 px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
       >
            Save
        </button>

                              {/* Error Message */}
        {error && (
          <div className="text-red-600 font-medium mb-4 ml-4 mt-4 mr-6 px-4 py-2 text-center w-full">
            {error}
          </div>
        )}   
<div className="w-full flex flex-col items-center mt-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Vehicle Types
  </label>
  <div className="flex flex-wrap justify-center gap-2 w-full max-w-2xl">
    <button
      type="button"
      onClick={toggleAll}
      className={`px-4 py-2 rounded-full border ${
        selectedTypes.length === vehicleTypes.length
          ? "bg-green-600 text-white"
          : "bg-white text-gray-700"
      } hover:bg-green-100 border-gray-300`}
    >
      All Cars
    </button>

    {vehicleTypes.map((type) => (
      <button
        key={type}
        type="button"
        onClick={() => toggleType(type)}
        className={`px-4 py-2 rounded-full border ${
          selectedTypes.includes(type)
            ? "bg-green-600 text-white"
            : "bg-white text-gray-700"
        } hover:bg-green-100 border-gray-300`}
      >
        {type}
      </button>
    ))}
  </div>
</div>
<div className="flex flex-col items-center justify-center w-full">
  <button
    onClick={() => setShowFilters(!showFilters)}
    className="mb-2 text-sm text-green-600 hover:underline focus:outline-none"
  >
    {showFilters ? "Hide Additional Features" : "Show Additional Features"}
  </button>

  {showFilters && (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <label className="flex flex-col text-sm">
        Color:
        <select
          name="color"
          value={vehicleRequest.color || ''}
          onChange={handleChange}
          className="mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">-- Select Color --</option>
          <option value="black">Black</option>
          <option value="white">White</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="gray">Gray</option>
        </select>
      </label>

      <label className="flex flex-col text-sm">
        Number of Seats:
        <input
          type="number"
          name="num_seats"
          value={vehicleRequest.num_seats}
          onChange={handleSeats}
          required
          className="mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </label>
    </div>
  )}
</div>
        </div>

  {/* Vehicles list - Below filters */}
  <div className="flex flex-wrap justify-center gap-5">
    
  {loading ? (
      // Show 3–4 skeletons while loading
      Array.from({ length: 4 }).map((_, idx) => (
    <div className="flex-shrink-0 border border-gray-300 rounded-lg p-4 w-[280px] shadow-sm bg-white animate-pulse">
      <div className="w-full h-40 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
      ))
    ) : (
      vehicles.map((veh) => (
                <VehicleCard
          key={veh.vehicle_id}
          vehicle={veh}
          handleQuickReserve={handleNext}
        />
      ))
    )}


  </div>
</div>
  );
}

export default VehicleSelect;
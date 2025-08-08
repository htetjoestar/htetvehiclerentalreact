import React, { useState,useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ReservationContext } from '../../Components/ReservationContext'; // Adjust the import path as necessary

const VehicleSelect = () => {
  const nav = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
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
    axios.post("http://localhost:8080/api/vehicle/filter", {
    color: vehicleRequest.color || null,
    num_seats: vehicleRequest.num_seats ? parseInt(vehicleRequest.num_seats) : null,
    types: selectedTypes || null,
    event_start_date: reservation.pick_up_date,
    event_end_date:reservation.drop_off_date
  })
      .then(response => setVehicles(response.data))
      .catch(error => console.error("Error fetching vehicles:", error));
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
      const response = await     axios.post("http://localhost:8080/api/vehicle/filter", {
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
      const response = await axios.post('http://localhost:8080/api/vehicle/filter', {
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
    
    {vehicles.map((veh) => (
<div
  key={veh.vehicle_id}
  className="border border-gray-300 rounded-lg p-4 w-[275px] shadow-sm bg-white"
>
  {veh.image_url ? (
    <img
      src={'http://localhost:8080' + veh.image_url}
      alt="Vehicle"
      className="w-full h-40 object-contain rounded mb-2"
    />
  ) : (
    <span className="text-sm text-gray-500">No image</span>
  )}

  {/* License Plate */}
  <p className="text-sm text-gray-600">
    {veh.license_plate}
  </p>

  {/* Model */}
  <p className="text-lg font-semibold">
    {veh.model} {veh.brand} {veh.make_year}
  </p>

  {/* Color & Type */}
  <p className="text-sm text-gray-500 ">{veh.type}</p>

  {/* Icon section */}
  <div className="flex items-center justify-between">
    <div className="flex flex-col gap-2 text-gray-600 text-sm">
      {/* Seats */}
      <div className="flex items-center" title="Seats">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 14c1.657 0 3 1.343 3 3v3H5v-3c0-1.657 1.343-3 3-3h8zM12 14v-2m0 0a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
        <span>{veh.num_seats}</span>
      </div>

      {/* Fuel */}
      <div className="flex items-center" title="Fuel Type">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 3H8a2 2 0 00-2 2v14h2v-4a2 2 0 012-2h4a2 2 0 012 2v4h2V5a2 2 0 00-2-2z" />
        </svg>
        <span>{veh.fuel}</span>
      </div>
    </div>

    {/* Base Charge */}
    <div className="text-right">
      <span className="text-sm text-gray-600 block">Base/Day</span>
      <span className="text-2xl font-bold">${veh.base_charge_per_day}</span>
    </div>
  </div>

  {/* Button */}
  <button
    onClick={() => handleNext(veh.vehicle_id)}
    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
  >
    Book now
  </button>
</div>
    ))}
  </div>
</div>
  );
}

export default VehicleSelect;
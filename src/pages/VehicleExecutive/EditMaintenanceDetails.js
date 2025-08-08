import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import ManageMaintenance from './ManageMaintenance';
import axios from 'axios';
import AdminHeader from '../Components/AdminHeader';


const EditMaintenanceDetails = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const [vehicle, setVehicle] = useState([]);
  const [error, setError] = useState('');  

  const [maintenance, setMaintenance] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:8080/api/maintenance/${id}`)
    .then(response => {
      setMaintenance(response.data);
      console.log("Fetched vehicle:", response.data);
    })
    .catch(error => {
      console.error("Error fetching maintenance data:", error);
    });
    
  }, [id]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/vehicle/"+maintenance.vehicle)
      .then(response => setVehicle(response.data))
      .catch(error => console.error("Error fetching employees:", error));
    
  }, [maintenance]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMaintenance({
      ...maintenance,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleClick = (e) => {

    setError("");
    const now = new Date();
    if (!maintenance.start_date || !maintenance.end_date) {
      setError('Please select both pickup and drop-off dates.');
      return;
    }

    if (new Date(maintenance.end_date) < now) {
      setError('Please select dates from tomorrow onwards.');
      return;
    }

    if (new Date(maintenance.start_date) > new Date(maintenance.end_date)) {
      setError('End date must be after start date.');
      return;
    }
    const payload = {
        ...maintenance
    }
    e.preventDefault();
    fetch(`http://localhost:8080/api/maintenance/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(() => {
      console.log("Vehicle updated");
    });
  };

  return (
    <div>
      <AdminHeader />

<div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-5">
  <h2 className="text-2xl font-bold mb-4">Manage maintenance details</h2>

  
  <p>
    <button 
      onClick={() => nav(-1)} 
      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
    >
      Back
    </button>
  </p>

    <div className='flex'>

    
    <div className='md:w-1/2'>
    {/* Vehicle Card */}
      <div key={vehicle.vehicle_id} className="border border-gray-300 rounded-lg p-4 mt-5 w-[300px] shadow-sm bg-white">
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
        <p><strong>Model:</strong> {vehicle.model} {vehicle.brand} {vehicle.make_year}</p>
        <p><strong>Color:</strong> {vehicle.color}</p>
        <p><strong>Type:</strong> {vehicle.type}</p>
        <p><strong>Seats:</strong> {vehicle.num_seats}</p>
        <p><strong>Base Charge/Day:</strong> ${vehicle.base_charge_per_day}</p>
      </div>
    </div>

    <div className='md:w-1/2'>
  <div className="mb-4">
    <label className="block mb-2 font-semibold">
      Maintenance details:
    </label>
  <textarea 
    name="details" 
    value={maintenance.details} 
    onChange={handleChange} 
    required 
    className="w-full h-32 p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
  />
  </div>
      <label className="block mb-2 font-semibold">
      Maintenance Status:
    </label>
  <select
    name="maint_status"
    value={maintenance.maint_status}
    onChange={handleChange}
    className="px-4 py-2 border rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">-- Select Status --</option>
    <option value="In Progress">In Progress</option>    
    <option value="Completed">Completed</option>

  </select>
  <div className="mb-4">
    <label className="block mb-2 font-semibold">
      Start Date:
    </label>
    <input 
      type="date" 
      name="start_date" 
      value={maintenance.start_date} 
      onChange={handleChange} 
      required 
      className="w-full p-2 border border-gray-300 rounded"
    />
  </div>

  <div className="mb-4">
    <label className="block mb-2 font-semibold">
      End Date:
    </label>
    <input 
      type="date" 
      name="end_date" 
      value={maintenance.end_date} 
      onChange={handleChange} 
      required 
      className="w-full p-2 border border-gray-300 rounded"
    />
  </div>


  <button 
    onClick={handleClick} 
    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  >
    Save Changes
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


    </div>
  );
};

export default EditMaintenanceDetails;
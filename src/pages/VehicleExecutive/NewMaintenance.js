import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Admin from '../Admin';
import axios from 'axios';
import AdminHeader from '../Components/AdminHeader';
import { handleInputChange } from '../../formUtils';

const NewMaintenance = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const [vehicle, setVehicle] = useState([]);
      const [error, setError] = useState('');

  const [maintenance, setMaintenance] = useState({
    vehicle: id,
    details: '',
    maint_status:'Pending',
    start_date: '',
    end_date: '',
  });
  console.log("Vehicle ID:", id);

  useEffect(() => {
    axios.get("http://localhost:8080/api/vehicle/"+id)
      .then(response => setVehicle(response.data))
      .catch(error => console.error("Error fetching employees:", error));
  }, []);

  const handleChange = handleInputChange(setMaintenance);

  const handleClick = async (e) => {

      setError("");
      const now = new Date();
      if (!maintenance.start_date || !maintenance.end_date) {
        setError('Please select both pickup and drop-off dates.');
        return;
      }

      if (new Date(maintenance.start_date) < now || new Date(maintenance.end_date) < now) {
        setError('Please select dates from tomorrow onwards.');
        return;
      }

      if (new Date(maintenance.start_date) > new Date(maintenance.end_date)) {
        setError('End date must be after start date.');
        return;
      }
      
      const payload = {
          ...maintenance,
          
      }
      e.preventDefault();
      await axios.post('http://localhost:8080/api/maintenance', payload)
        .then(response => {
        console.log("Vehicle updated", response.data);
      })
      .catch(error => {
        console.error("Error updating vehicle:", error);
      });
      const vehiclepayload = {
        ...vehicle,
        vehicle_status: "Maintenance",
        veh_modified_date: now,
        veh_deactivated_date: null,
        veh_last_action: "Updated"
      };

      await fetch(`http://localhost:8080/api/vehicle/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehiclepayload)
      }).then(() => {
        console.log("Vehicle updated");
      });
      nav("/managemaintenance");
  };

  return (
    <div>
      <AdminHeader />

      <div className="min-h-[calc(100vh-10vh) mt-5">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">

      
        <h2 className="text-2xl font-bold mb-4">Create Maintenance</h2>
      
        <p>
          <button 
            onClick={() => nav(-1)} 
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
          Back
          </button>
        </p>

      <div className='flex flex-col md:flex-row gap-8'>
      <div className='flex flex-col items-center md:items-start md:w-1/2'>
      <div key={vehicle.vehicle_id} className="border border-gray-300 rounded-lg p-4 w-[300px] mt-5 shadow-sm bg-white">
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
    </div>
  );
};

export default NewMaintenance;
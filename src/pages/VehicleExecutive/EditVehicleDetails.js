import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminHeader from '../Components/AdminHeader';

const EditVehicleDetails = () => {
  const nav = useNavigate();
  const { id } = useParams();

  const [vehicle, setVehicle] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch(`https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/vehicle/${id}`)
      .then(res => res.json())
      .then(result => {
        setVehicle(result);
        console.log("Fetched vehicle:", result);
      });
  }, [id]);

  const handleChange = (input) => (e) => {
    const updatedVehicle = {
      ...vehicle,
      [input]: e.target.type === "number" ? parseFloat(e.target.value) : e.target.value
    };
    setVehicle(updatedVehicle);
  };

  const handleClick = (e) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const payload = {
      ...vehicle,
      veh_modified_date: now,
      veh_deactivated_date: null,
      veh_last_action: "Updated"
    };

    fetch(`https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/vehicle/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(() => {
      console.log("Vehicle updated");
      nav('/managevehicle');
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/vehicle/${id}/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const imgUrl = await response.text(); // or JSON if backend returns JSON
      setVehicle((prev) => ({ ...prev, img_url: imgUrl }));
      console.log("Image uploaded:", imgUrl);
    } catch (error) {
      console.error("Image upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
        <div>
          <AdminHeader />
<div className="min-h-[calc(100vh-20vh)] bg-gray-100 flex items-center justify-center px-4 py-8">
 <button
    onClick={() => nav(-1)}
    className="absolute top-20 left-20 text-black hover:underline text-sm"
  >
    ← Back
  </button>
  <form
    className="bg-white shadow-md rounded px-8 pt-6 pb-8 max-w-3xl w-full"
  >
    <h2 className="text-2xl font-semibold text-center mb-6">Manage Vehicle</h2>

    <div className="mb-4 text-center">

    </div>

    <div className="flex flex-col md:flex-row gap-8">
      {/* Image Section */}
      <div className="flex flex-col items-center md:items-start md:w-1/2">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Vehicle Image:
        </label>

        {imageFile ? (
        <div className="mb-2">
         <img
           src={URL.createObjectURL(imageFile)}
           alt="Preview"
           className="w-80 h-auto rounded border border-gray-300"
         />
        </div>
          ) : (
        vehicle.image_url && (
          <div className="mb-4">
            <img
              src={vehicle.image_url}
              alt="Vehicle"
              className="w-64 h-auto rounded border border-gray-300"
            />
          </div>
         ))}


        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        {uploading && (
          <p className="text-sm text-gray-500 mt-1">Uploading image...</p>
        )}
      </div>

      {/* Form Fields Section */}
      <div className="md:w-1/2">
        {[
          { label: "License Plate", key: "license_plate" },
          { label: "Model", key: "model" },
          { label: "Brand", key: "brand" },
          { label: "Make Year", key: "make_year" },
          { label: "Color", key: "color" },
        ].map(({ label, key }) => (
          <div key={key} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {label}:
            </label>
            <input
              type="text"
              name={key}
              value={vehicle[key] || ''}
              onChange={handleChange(key)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}

        {/* Vehicle Type Select */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Type:
          </label>
          <select
            name="type"
            value={vehicle.type || ''}
            onChange={handleChange('type')}
            required
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a type</option>
            <option value="Sedan">Sedan</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Sport">Sport</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        {/* Number of Seats */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Number of Seats:
          </label>
          <input
            type="number"
            name="num_seats"
            value={vehicle.num_seats || ''}
            onChange={handleChange('num_seats')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Fuel Type:
          </label>
          <select
            name="fuel"
            value={vehicle.fuel || ''}
            onChange={handleChange('fuel')}
            required
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
          </select>
        </div>
        {/* Base Charge */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Base Charge per Day:
          </label>
          <input
            type="number"
            name="base_charge_per_day"
            value={vehicle.base_charge_per_day || ''}
            onChange={handleChange('base_charge_per_day')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Vehicle Status Select */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Vehicle Status:
          </label>
          <select
            name="vehicle_status"
            value={vehicle.vehicle_status || ''}
            onChange={handleChange('vehicle_status')}
            required
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select status</option>
            <option value="Listed">Listed</option>
            <option value="Unlisted">Unlisted</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <button
            type="button"
            onClick={handleClick}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => nav(`/NewMaintenance/${id}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Maintenance
          </button>
        </div>
      </div>
    </div>
  </form>
</div>
      </div>
  );
};

export default EditVehicleDetails;
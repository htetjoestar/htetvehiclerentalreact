import React, { useState } from 'react';

import AdminHeader from '../Components/AdminHeader';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { handleInputChange } from '../../formUtils';

function AdminUpload() {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [form, setForm] = useState({
        license_plate: '',
        model: '',
        brand: '',
        make_year: '',
        vehicle_status: 'Listed',
        color: '',
        type: '',
        fuel: '',
        num_seats: '',
        base_charge_per_day: ''
    });


    const handleChange = handleInputChange(setForm);
    const uploadImage = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const now = new Date().toISOString();
        const vehicleDto = {
            ...form,
            num_seats: parseInt(form.num_seats),
            base_charge_per_day: parseInt(form.base_charge_per_day),
            veh_created_date: now,
            veh_modified_date: now,
            veh_last_action: 'Created',
            veh_deactivated_date: null
        };

        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(vehicleDto)], { type: 'application/json' }));
        
        try {
            const response = await axios.post('http://localhost:8080/api/vehicle/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log("Vehicle uploaded:", response.data);
            setUploading(true);
            const imageformData = new FormData();
            imageformData.append("image", imageFile);

            try {
            const response2 = await fetch(`http://localhost:8080/api/vehicle/${response.data.vehicle_id}/upload-image`, {
            method: "POST",
            body: imageformData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const imgUrl = await response.text(); // or JSON if backend returns JSON
            console.log("Image uploaded:", imgUrl);
             } catch (error) {
            console.error("Image upload error:", error);
            } finally {
            setUploading(false);
            }
            
            alert("Vehicle uploaded successfully!");
        } catch (err) {
            console.error(err);
            alert("Upload failed.");
        }

        navigate("/managevehicle");
    };

    return (
        <div >
            <AdminHeader />
<div className="min-h-[calc(100vh-20vh)] bg-gray-100 flex items-center justify-center px-4 py-8">
  <form
    onSubmit={handleSubmit}
    className="bg-white shadow-md rounded px-8 pt-6 pb-8 max-w-3xl w-full"
  >
    <div className="flex flex-col md:flex-row gap-8">
      {/* Image Section */}
      <div className="flex flex-col items-center md:items-start md:w-1/2">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Vehicle Image:
        </label>

        {imageFile && (
          <div className="mb-4">
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="w-64 h-auto rounded border border-gray-300"
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={uploadImage}
          className="file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {uploading && (
          <p className="text-sm text-gray-500 mt-1">
            Uploading image...
          </p>
        )}
      </div>

      {/* Form Fields Section */}
      <div className="md:w-1/2">
        {[
          "license_plate",
          "model",
          "brand",
          "make_year",
        ].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 capitalize">
              {field.replace(/_/g, " ")}:
            </label>
            <input
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}
        <div className="md:w-1/2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Color:
          </label>
          <select
            name="color"
            value={form.color || ''}
            onChange={handleChange}
            required
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
          <option value="">-- Select Color --</option>
          <option value="Black">Black</option>
          <option value="White">White</option>
          <option value="Red">Red</option>
          <option value="Blue">Blue</option>
          <option value="Gray">Gray</option>
          </select>
        </div>
        <div className="md:w-1/2">
        <label className="block text-gray-700 text-sm font-bold mb-2 capitalize">
              Type:
        </label>
        <select
        name="type"
        value={form.type}
        onChange={handleChange}
        required
        className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="">Select a type</option>
        <option value="Sedan">Sedan</option>
        <option value="Truck">Truck</option>
        <option value="Van">Van</option>
        <option value="Sport">Sport</option>
        <option value="SUV">SUV</option>
      </select>
      </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Number of Seats:
          </label>
          <input
            type="number"
            name="num_seats"
            value={form.num_seats}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Fuel Type:
          </label>
          <select
            name="fuel"
            value={form.fuel || ''}
            onChange={handleChange}
            required
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Base Charge per Day:
          </label>
          <input
            type="number"
            name="base_charge_per_day"
            value={form.base_charge_per_day}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="md:w-1/2 mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2 capitalize">
              Status:
        </label>
        <select
        name="vehicle_status"
        value={form.vehicle_status}
        onChange={handleChange}
        required
        className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="Listed">Listed</option>
        <option value="Unlisted">Unlisted</option>
      </select>
      </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Upload Vehicle
          </button>
        </div>
      </div>
    </div>
  </form>
</div>
        </div>
        
    );
}

export default AdminUpload;
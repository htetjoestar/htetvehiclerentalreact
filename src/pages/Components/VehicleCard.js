// components/VehicleCard.jsx
import React from "react";

const VehicleCard = ({ vehicle, handleQuickReserve }) => {
  return (
    <div
      key={vehicle.vehicle_id}
      className="flex-shrink-0 border border-gray-300 rounded-lg p-4 w-[280px] shadow-sm bg-white"
    >
      {vehicle.image_url ? (
        <img
          src={vehicle.image_url}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-40 object-contain rounded mb-2"
        />
      ) : (
        <span className="text-sm text-gray-500">No image</span>
      )}
        <p className="text-sm text-gray-600">
            {vehicle.license_plate}
        </p>
      <p className="text-lg font-semibold mb-1">
        {vehicle.brand} {vehicle.model} {vehicle.make_year}
      </p>
      <p className="text-sm text-gray-500"> {vehicle.type}</p>

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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 14c1.657 0 3 1.343 3 3v3H5v-3c0-1.657 1.343-3 3-3h8zM12 14v-2m0 0a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
            <span>{vehicle.num_seats}</span>
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 3H8a2 2 0 00-2 2v14h2v-4a2 2 0 012-2h4a2 2 0 012 2v4h2V5a2 2 0 00-2-2z"
              />
            </svg>
            <span>{vehicle.fuel}</span>
          </div>
        </div>

        {/* Base Charge */}
        <div className="text-right">
          <span className="text-sm text-gray-600 block">Base Charge/Day</span>
          <span className="text-2xl font-bold">
            ${vehicle.base_charge_per_day}
          </span>
        </div>
      </div>

      <button
        onClick={() => handleQuickReserve(vehicle.vehicle_id)}
        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
      >
        Book Now
      </button>
    </div>
  );
};

export default VehicleCard;
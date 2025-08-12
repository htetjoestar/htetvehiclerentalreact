import NewHeader from "./Components/NewHeader";
import React, {useState,useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import website_logo from "../website_logo.png";


const Home = () => {
 const scrollRef = useRef(null);
      const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);

      useEffect(() => {
      axios.get("https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/vehicle/random", {
      })
        .then(response => setVehicles(response.data))
        .catch(error => console.error("Error fetching vehicles:", error));
      }, []);  
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
  return (
    <div>
      <NewHeader />

      <div className=" bg-rental-hero2 bg-cover flex flex-col justify-center items-center">

<div className="mt-4 ">
  <img src={website_logo} alt="logo" className="h-56 object-contain ml-2" />
  </div>
<div className="text-center mb-8">

  <p className="text-md text-gray-500">
    Login or register to make a reservation
  </p>
</div>

      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 bg-green-100 mb-8 p-8 rounded shadow-md w-fit">
              <div className="flex space-x-4">
        <button
          onClick={() => navigate('/customer-login')}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded shadow"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow"
        >
          Register
        </button>
      </div>
    </div>
    <div className="relative w-screen overflow-hidden">
  {/* Left Arrow */}
  <button
    onClick={scrollLeft}
    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md"
  >
    &#8592;
  </button>

      <div className="w-full max-w-screen px-4 md:px-12 mt-8">
    <h2 className="text-2xl font-bold mb-4 text-center md:text-left text-gray-800">
      Our Fleet
    </h2>
  </div>
  {/* Scrollable Container */}
  <div
    ref={scrollRef}
    className="flex overflow-x-auto bg-green-100 space-x-4 px-12 py-4 scroll-smooth snap-x snap-mandatory"
  >
    {vehicles.map((veh) => (
<div
  key={veh.vehicle_id}
  className="flex-shrink-0 border border-gray-300 rounded-lg p-4 w-[300px] shadow-sm bg-white snap-start"
>
  {veh.image_url ? (
    <img
      src={`https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/${veh.image_url}`}
      alt="Vehicle"
      className="w-full h-40 object-contain rounded mb-2"
    />
  ) : (
    <span>No image</span>
  )}

  <p className="text-lg font-semibold">
    {veh.brand} {veh.model} {veh.make_year}
  </p>
  <p className="text-sm text-gray-500 mb-1">{veh.type}</p>

  <div className="flex items-center justify-between mt-2">
    {/* Icon group - vertical */}
    <div className="flex flex-col gap-2 text-gray-600">
      {/* Seats */}
      <div className="flex items-center" title="Seats">
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


      {/* Fuel Type */}
      <div className="flex items-center" title="Fuel Type">
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

    {/* Base charge */}
    <div className="text-right">
      <strong className="text-sm text-gray-600">Base Charge/Day:</strong>
      <div className="text-2xl font-bold">${veh.base_charge_per_day}</div>
    </div>
  </div>
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
    
    <footer className="bg-gray-100 text-center text-sm text-gray-600 py-6 border-t">
      <div className="max-w-screen-lg mx-auto px-4 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
        <a href="#" className="hover:underline">Careers</a>
        <a href="#" className="hover:underline">FAQs</a>
        <a href="#" className="hover:underline">How to Use</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Contact Us</a>
      </div>
      <div className="max-w-screen-lg mx-auto mt-2 px-4 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
        <a href="/portal-admin-login" className="hover:underline">Portal Admin</a>
        <a href="/admin-login" className="hover:underline">Admin Login</a>
      </div>
      <p className="mt-4">&copy; {new Date().getFullYear()} YourCompany. All rights reserved.</p>
    </footer>
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Admin from '../Admin';
import AdminHeader from '../Components/AdminHeader';

const NewLocation = () => {
  const nav = useNavigate();
  const { id } = useParams();

  const [location, setLocation] = useState({
    address: "",
  });



  const handleChange = (input) => (e) => {
    const updatedLocation = {
      ...location,
      [input]: e.target.type === "number" ? parseFloat(e.target.value) : e.target.value
    };
    setLocation(updatedLocation);
    console.log("Updated vehicle:", updatedLocation);
  };

  const handleClick = (e) => {
    const now = new Date().toISOString();
    const payload = {
        ...location, 
    }
    e.preventDefault();
    fetch(`https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/location`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(() => {
      console.log("Vehicle updated");
    });
  };

  return (
    <div>
      <AdminHeader />
      <h2>Create New Location</h2>
    
        <p>address: <input type="text" value={location.address || ''} onChange={handleChange('address')} /></p>
      <button onClick={handleClick}>Save Changes</button>
    </div>
  );
};

export default NewLocation;
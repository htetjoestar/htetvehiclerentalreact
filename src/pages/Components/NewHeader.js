import React from "react";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import website_logo from "../../website_logo_sm.png";
const NewHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();


  const customerId = localStorage.getItem("customerId");

  return (
<header className="flex items-center justify-between px-5 py-2 bg-gray-100 border-b border-gray-300">
  {/* Left: Title */}
  <img src={website_logo} alt="logo" className="h-10 object-contain ml-2" />

  {/* Center: Navigation */}


  {/* Right: Logout */}
</header>
  );
};

export default NewHeader;
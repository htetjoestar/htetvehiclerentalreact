import React, { createContext, useState } from 'react';

export const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {

  const customerId = localStorage.getItem("customerId");
  const [reservation, setReservation] = useState({
    pick_up_date: '',
    drop_off_date: '',
    customer: customerId,
    vehicle: null,
    babyseat: 0,
    insurance: 0,
    
  });

  return (
    <ReservationContext.Provider value={{ reservation, setReservation }}>
      {children}
    </ReservationContext.Provider>
  );
};
import React from 'react';
import { Outlet } from 'react-router-dom';
import { ReservationProvider } from './ReservationContext';

const ReservationLayout = () => {
  return (
    <ReservationProvider>
      <Outlet />
    </ReservationProvider>
  );
};

export default ReservationLayout;
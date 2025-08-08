import React from "react";


import { Outlet } from "react-router-dom";
import PortalAdminHeader from "./PortalAdminHeader";


const CustomerLayout = () => (
  <>
  <PortalAdminHeader />
    <main style={{ padding: "20px" }}>
      <Outlet />
    </main>
  </>
);

export default CustomerLayout;
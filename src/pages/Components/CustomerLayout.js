import React from "react";


import { Outlet } from "react-router-dom";
import CustomerHeader from "./CustomerHeader";

const CustomerLayout = () => (
 <div className="flex flex-col min-h-screen">
    <CustomerHeader />
    
    <main className="flex-grow" style={{ padding: "0px" }}>
      <Outlet />
    </main>

    <footer className="bg-gray-100 text-center text-sm text-gray-600 py-6 border-t">
      <div className="max-w-screen-lg mx-auto px-4 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
        <a href="#" className="hover:underline">Careers</a>
        <a href="#" className="hover:underline">FAQs</a>
        <a href="#" className="hover:underline">How to Use</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Contact Us</a>
      </div>
      <p className="mt-4">&copy; {new Date().getFullYear()} YourCompany. All rights reserved.</p>
    </footer>
  </div>    
);

export default CustomerLayout;
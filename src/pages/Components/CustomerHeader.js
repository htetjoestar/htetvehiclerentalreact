import React, { useState, useEffect } from "react";
import { useNavigate,useLocation,Link} from "react-router-dom";
import axios from "axios";
import website_logo from "../../website_logo_sm.png";
import { Bell } from "lucide-react"; // If using lucide-react for icons

const CustomerHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnpaid, setHasUnpaid] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const name = localStorage.getItem("customerName");
  const customerId = localStorage.getItem("customerId");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (customerId) {
      axios
        .get(`https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/invoice/has-unpaid?customerId=${customerId}`)
        .then(res => setHasUnpaid(res.data))
        .catch(err => console.error("Failed to fetch unpaid status", err));
    }
  }, [customerId]);
  useEffect (() => {
      // Optional: fetch notifications
      axios
        .get(`https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/notifications?customerId=${customerId}`)
        .then(res => setNotifications(res.data))
        .catch(err => console.error("Failed to fetch notifications", err));

        setIsOpen(false);  
        setNotifOpen(false);
  },[location])
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between px-5 py-2 bg-gray-100 border-b border-gray-300">
      <img src={website_logo} alt="logo" className="h-10 object-contain" />

      <nav className="flex items-center gap-4">
        <button
          onClick={() => navigate("/reservation")}
          className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
        >
          Make a Reservation
        </button>

        <button
          onClick={() => navigate("/customer-reservations")}
          className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
        >
          Current Reservations
        </button>

      </nav>

            <div className="flex items-center gap-4 relative">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded hover:bg-gray-200"
          >
            <Bell className="w-6 h-6 text-gray-700" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
            )}
          </button>

{notifOpen && (
  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg z-10 max-h-96 overflow-y-auto">
    {notifications.length === 0 ? (
      <div className="px-4 py-2 text-gray-500">No new notifications</div>
    ) : (
      <>
        {/* Reservation Notifications */}
        {notifications.some(n => n.type === "RESERVATION") && (
          <div>
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
              Reservation Notifications
            </div>
            {notifications
              .filter(n => n.type === "RESERVATION")
              .map((notif, index) => (
                <Link
                  key={`res-${index}`}
                  to="/customer-reservations"
                  onClick={() => setNotifOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                >
                  {notif.message}
                </Link>
              ))}
          </div>
        )}

        {/* Invoice Notifications */}
        {notifications.some(n => n.type === "INVOICE") && (
          <div>
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
              Invoice Notifications
            </div>
            {notifications
              .filter(n => n.type === "INVOICE")
              .map((notif, index) => (
                <Link
                  key={`inv-${index}`}
                  to="/manage-invoices"
                  onClick={() => setNotifOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                >
                  {notif.message}
                </Link>
              ))}
          </div>
        )}
      </>
    )}
  </div>
)}
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            {name}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
              <button
                onClick={() => {
                  navigate(`/customeraccountsettings/${customerId}`);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                ⚙️Account Settings
              </button>
              <button
                onClick={() => {
                  navigate(`/manage-payment`);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                💳Payment Methods
              </button>
              <button
                onClick={() => {
                  navigate(`/manage-invoices`);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                📠Invoices
              </button>
              <button
                onClick={() => {
                  navigate(`/customer-past-reservations`);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                🚗Past Reservations
              </button>                             
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;

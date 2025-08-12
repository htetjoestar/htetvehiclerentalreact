import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import './employee.css'
import AdminHeader from "../Components/AdminHeader";
const InspectCustomer = () => {
const { id } = useParams();
  const nav = useNavigate();
  const now = new Date();
  const [showImageModal, setShowImageModal] = useState(false);
const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [reservations, setReservations] = useState([]);

  const [customer, setCustomer] = useState({
    cust_first_name: '',
    cust_last_name: '',
    cust_email: '',
    cust_password: '',
    cust_phone_number: '',
    cust_emergency_contact_name: '',
    cust_emergency_contact_number: '',
    cust_active: false,
    cust_created_date: '',
    cust_modified_date: '',
    cust_last_action: '',
    cust_deactivated_date: '',
    cust_id_doc: '',
    cust_license_number: '',
    cust_license_expiry_date: '',
    cust_date_of_birth: '',
  });

    const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  axios.get("https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/customer/"+id)
    .then(response => setCustomer(response.data))
    .catch(error => console.error("Error fetching employees:", error));
  
  axios.post("https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/reservation/customer/"+id)
    .then(response => setReservations(response.data))
    .catch(error => console.error("Error fetching employees:", error));  
  }, []);

  function formatLocalDate(dateStr) {
    if(dateStr == null){
      return;
    }
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString();
  }

function formatDateTime(dateString) {
  const date = new Date(dateString);

  // Get time components
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Get date components
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  // Return formatted string
  return `${hours}:${minutes}:${seconds} ${month}/${day}/${year}`;
}

  return (
  <div>
  
  <p>
    <button 
      onClick={() => nav(-1)} 
      className="px-4 py-2 mb-5 bg-gray-200 hover:bg-gray-300 rounded"
    >
      Back
    </button>
  </p>
  <div className="flex flex-wrap bg-gray-100 ml-6 mr-6 items-end">
    <h2 className="w-full ml-4 text-lg font-semibold">Account information</h2>

            <div className="flex flex-wrap bg-gray-100 ml-6 mr-6 items-end">
            
            <div className="form-group ml-6 mr-6">
              <label>First Name</label>
              <p className="text-lg">{customer.cust_first_name}</p>
            </div>
            <div className="form-group mr-6">
              <label>Last Name</label>
              <p className="text-lg">{customer.cust_last_name}</p>
            </div>
            <div className="form-group mr-6">
              <label>Email</label>
              <p className="text-lg">{customer.cust_email}</p>
            </div>
            <div className="form-group mr-6">
              <label>Date of birth</label>
              <p className="text-lg">{formatLocalDate(customer.cust_date_of_birth)}</p>
            </div>
            <div className="form-group mr-6">
              <label>Phone Number</label>
              <p className="text-lg">+{customer.cust_phone_number}</p>
            </div>
            <div className="form-group mr-6">
              <label>Emergency Contact Name</label>
              <p className="text-lg">{customer.cust_emergency_contact_name}</p>
            </div>
             <div className="form-group mr-6">
              <label>Emergency Contact Number</label>
              <p className="text-lg">+{customer.cust_emergency_contact_number}</p>
            </div>

            </div>
            <div className="flex flex-wrap bg-gray-100 ml-6 mr-6 items-end w-full">
                             <div className="form-group ml-6 mr-6">
              <label>License Expiry</label>
              <p className="text-lg">{formatLocalDate(customer.cust_license_expiry_date)}</p>
            </div>
                        <div className="flex flex-wrap bg-gray-100 ml-6 mr-6 items-end">
                             <div className="form-group ml-6 mr-6">
                <button
                  onClick={() => {
    setSelectedImageUrl('http://localhost:8080' + customer.cust_id_img);
    setShowImageModal(true);
  }}
                className="px-3 py-2 h-[40px] bg-green-600 text-white rounded hover:bg-green-700 transition"
            > View License </button>
            </div>
            </div>
            </div>
            <div className="flex flex-wrap bg-gray-100 ml-6 mr-6 items-end">
            <div className="form-group ml-6 mr-6">
              <label>Created Date</label>
              <p className="text-lg">{formatDateTime(customer.cust_created_date)}</p>
            </div>
             <div className="form-group ml-6 mr-6">
              <label>Modified Date</label>
              <p className="text-lg">{formatDateTime(customer.cust_modified_date)}</p>
            </div>
            <div className="form-group ml-6 mr-6">
              <label>Last Action</label>
              <p className="text-lg">{customer.cust_last_action}</p>
            </div>      
            <div className="form-group ml-6 mr-6">
              <label>Active</label>
              <p className="text-lg">{customer.cust_active ? "Yes" : "No"}</p>
            </div>                       
            </div>
            
</div>
<h2 className="w-full mt-4 ml-4 text-lg font-semibold">Reservations</h2>

    <table className="mt-6 ml-6 w-full table-auto border-collapse">
      <thead>
      <tr className="bg-gray-100 text-black">
      <th className="border px-4 py-2 text-left">ID</th>
      <th className="border px-4 py-2 text-left">customer id</th>
      <th className="border px-4 py-2 text-left">vehicle id</th>
      <th className="border px-4 py-2 text-left">status</th>
      <th className="border px-4 py-2 text-left">pick up date</th>
      <th className="border px-4 py-2 text-left">drop off date</th>
      <th className="border px-4 py-2 text-left">actual pick up date</th>
      <th className="border px-4 py-2 text-left">actual drop off date</th>      
      <th className="border px-4 py-2 text-left">baby seat</th>
      <th className="border px-4 py-2 text-left">insurance</th>
      <th className="border px-4 py-2 text-left">late fee</th>
      <th className="border px-4 py-2 text-left">damages</th>
      <th className="border px-4 py-2 text-left">total cost</th>
      <th className="border px-4 py-2 text-left">Action</th>

      </tr>
      </thead>
      <tbody>
        {reservations.map(maint => (
          <tr key={maint.resevation_id} style={{ borderBottom: "1px solid #ccc" }}>
            <td>{maint.reservation_id}</td>
            <td>{maint.customer}</td>
            <td>{maint.vehicle}</td>
            <td>{maint.res_status}</td>
            <td>{formatLocalDate(maint.pick_up_date)}</td>
            <td>{formatLocalDate(maint.drop_off_date)}</td>
            <td>{maint.actual_pick_up_date ? formatLocalDate(maint.actual_pick_up_date) : "N/A"}</td>
            <td>{maint.actual_drop_off_date ? formatLocalDate(maint.actual_drop_off_date) : "N/A"}</td>
            <td>{maint.baby_seat}</td>
            <td>{maint.insurance}</td>
            <td>{maint.late_fee ? `$${maint.late_fee}` : "N/A"}</td>
            <td>{maint.damages ? `$${maint.damages}` : "N/A"}</td>
            <td>{`$${maint.total_charge}`}</td>
            
              <td>
                <button
                  onClick={() => navigate(`/emp_reservation/${maint.reservation_id}`)}
                  style={{ padding: "6px 12px", backgroundColor: "#0077cc", color: "#fff", border: "none", borderRadius: "4px" }}
                >
                  Inspect
                </button>
              </td>
            </tr>
          ))}
      </tbody>
      </table>
{showImageModal && selectedImageUrl && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full relative animate-fade-in">
      <img
        src={selectedImageUrl}
        alt="Preview"
        className="w-full h-auto max-h-[80vh] object-contain rounded"
      />

      {/* Close Button */}
      <button
        onClick={() => setShowImageModal(false)}
        className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-2xl"
      >
        &times;
      </button>
    </div>
  </div>
)}
    </div>
    );
}

export default InspectCustomer;
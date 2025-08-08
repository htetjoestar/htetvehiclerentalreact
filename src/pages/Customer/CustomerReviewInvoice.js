import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AdminHeader from '../Components/AdminHeader';

const CustomerReviewInvoice = () => {
  const nav = useNavigate();
  const { id } = useParams();

  const [reservation, setReservation] = useState({});
  const [vehicle, setVehicle] = useState({});
  const [customer, setCustomer] = useState({});
  const [invoice, setInvoice] = useState({
    damageDescription: '',
  });  
  const [status, setStatus] = useState('');
  const [late_fee, setLateFee] = useState('');
  const [invoiceExists, setInvoiceExists] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/reservation/${id}`)
    .then(response => {
      setReservation(response.data);
      console.log(response.data.res_status);
      setStatus(response.data.res_status);


      const vehicleRes = axios.get(`http://localhost:8080/api/vehicle/${response.data.vehicle}`);
        vehicleRes.then(vehicleResponse => {
            setVehicle(vehicleResponse.data);
            console.log("Fetched vehicle:", vehicleResponse.data);
        });


       const customerRes = axios.get(`http://localhost:8080/api/customer/${response.data.customer}`);
        customerRes.then(customerRes => {
            setCustomer(customerRes.data);
        });  
      
      if (response.data.actual_drop_off_date != null && response.data.late_fee != null) {
        const drop_off_date = new Date(response.data.drop_off_date);
        const actual_drop_off_date = new Date(response.data.actual_drop_off_date);
        const diffDays = Math.ceil((actual_drop_off_date - drop_off_date) / (1000 * 60 * 60 * 24)) + 1;
        if (diffDays > 0) {
          setLateFee(diffDays * 500);
        } else {
          setLateFee(0);
        }
      }
        
    })
    .catch(error => {
      console.error("Error fetching maintenance data:", error);
    });

     axios.get(`http://localhost:8080/api/invoice/reservation/${id}`)
    .then(response => {
      if (response.data && response.data.invoice_id) {
        setInvoiceExists(true);
      }
      setInvoice(response.data);
    
    });
  }, [id]);



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReservation({
      ...reservation,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const handleInvoiceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInvoice({
      ...invoice,
      [name]: type === "checkbox" ? checked : value,
    });
  };



 const handleStepSubmit = async (e) => {
  e.preventDefault();
  const now = new Date().toISOString();

  let updatedFields = {
    res_modified_date: now,
    res_last_action: "Updated"
  };

  if (reservation.res_status === 'Reserved') {
    updatedFields.actual_pick_up_date = reservation.actual_pick_up_date;
    updatedFields.res_status = 'Rented';
  } else if (reservation.res_status === 'Rented') {
    updatedFields.actual_drop_off_date = reservation.actual_drop_off_date;
    updatedFields.res_status = 'Completed';
  }

  const payload = {
    ...reservation,
    ...updatedFields
  };

  try {
    await fetch(`http://localhost:8080/api/reservation/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // Reload updated reservation
    const res = await axios.get(`http://localhost:8080/api/reservation/${id}`);
    setReservation(res.data);
    setStatus(res.data.res_status);
  } catch (err) {
    console.error("Update failed:", err);
  }
};


 const handleInvoice = async (e) => {
  e.preventDefault();
  const now = new Date().toISOString();

  try {

    const response = await axios.get(`http://localhost:8080/api/reservation/pdf/${id}`,{
      responseType: 'blob'
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'monthly_report.xlsx'; // Use .xlsx extension
    a.click();

    URL.revokeObjectURL(url); // Clean up
  } catch (err) {
    console.error("Download failed:", err);
  }

};


  return (
    <div>
      <div className="relative min-h-[calc(100vh-10vh)] flex flex-col items-center justify-center">
      <div className="flex flex-col md:flex-row items-start space-y-8 md:space-y-0 md:space-x-6 bg-green-100 p-8 rounded shadow-md w-full max-w-6xl">

      {/* Vehicle Card */}
      <div key={vehicle.vehicle_id} className="border border-gray-300 rounded-lg p-4 w-[300px] shadow-sm bg-white">
        {vehicle.image_url ? (
          <img
            src={'http://localhost:8080' + vehicle.image_url}
            alt="vehicle"
            className="w-full h-40 object-cover rounded mb-2"
          />
        ) : (
          <span>No image</span>
        )}
        <h3 className="mt-2 mb-1 font-semibold">Vehicle ID: {vehicle.vehicle_id}</h3>
        <p><strong>License Plate:</strong> {vehicle.license_plate}</p>
        <p><strong>Model:</strong> {vehicle.model} {vehicle.brand} ({vehicle.make_year})</p>
        <p><strong>Color:</strong> {vehicle.color}</p>
        <p><strong>Type:</strong> {vehicle.type}</p>
        <p><strong>Seats:</strong> {vehicle.num_seats}</p>
        <p><strong>Base Charge/Day:</strong> ${vehicle.base_charge_per_day}</p>
      </div>

      {/* Reservation Info Card */}
      <div className="border border-gray-300 rounded-lg p-4 w-[300px] shadow-sm bg-white">
        <h3 className="font-semibold text-green-900 mb-2">Reservation</h3>
        <div>
          <strong className='text-green-900'>Customer:</strong>
          <p>{customer.cust_first_name} {customer.cust_last_name}</p>
        </div>

        <div>
          <strong className='text-green-900'>Pick-up Date:</strong>
          <p> {reservation.pick_up_date} </p>
        </div>

        <div>
          <strong className='text-green-900'>Drop-off Date:</strong> 
          <p>{reservation.drop_off_date}</p>
        </div>
        
        <div>
          <strong className='text-green-900'>Baby Seat:</strong> 
          <p>{reservation.baby_seat}</p>
        </div>
        
        <div>
          <strong className='text-green-900'>Insurance:</strong>
          <p> {reservation.insurance}</p>
        </div>
        
        <div>
          <strong className='text-green-900'>Created Date:</strong>
          <p> {reservation.res_created_date}</p>
        </div>
        
        <div>
          <strong className='text-green-900'>Modified Date:</strong> 
          <p>{reservation.res_modified_date}</p>
        </div>
        
        <div>
          <strong className='text-green-900'>Last Action:</strong>
          <p> {reservation.res_last_action}</p>
        </div>

        
      </div>
      
<div className="border border-gray-300 rounded-lg p-4 w-[300px] shadow-sm bg-white">
    <h3 className="font-semibold text-green-900 mb-2">Extra Charges</h3>
<div className="block">
  <label className="text-green-900 font-medium">Current Status</label>
  <p className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded capitalize">
    {reservation.res_status || 'Unknown'}
  </p>
</div>  

    <>
      <div className="block">
        <label className="text-green-900 font-medium">Actual Pick-Up Date</label>
        <p className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded">
          {reservation.actual_pick_up_date || 'Not Available'}
        </p>
      </div>
      <div className="block">
        <label className="text-green-900 font-medium">Actual Drop-Off Date</label>
        <p className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded">
          {reservation.actual_drop_off_date || 'Not Available'}
        </p>
      </div>
    </>


    <div className="block mt-4">
      <label className="text-green-900 font-medium">Damages Description</label>
<textarea 
  name="damageDescription" 
  value={invoice.damageDescription || ''} 
  onChange={handleInvoiceChange}
  readOnly={true}
  className={`w-full h-16 p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 ${
    invoiceExists ? 'bg-gray-100' : 'bg-white focus:ring-green-500'
  }`}
/>
    </div>
</div>

<div className="border border-gray-300 rounded-lg p-4 w-[300px] shadow-sm bg-white">


{invoiceExists && (
  <>
    <div className="block mt-4">
      <label className="text-green-900 font-medium">Invoice Created Date</label>
      <p className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded">
        {invoice.invoice_created_date 
          ? new Date(invoice.invoice_created_date).toLocaleString() 
          : 'Not Available'}
      </p>
    </div>

    <div className="block mt-2">
      <label className="text-green-900 font-medium">Paid</label>
      <p className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded">
        {invoice.paid ? 'Yes' : 'No'}
      </p>
    </div>
      <div className="block">
        <label className="text-green-900 font-medium">Late Fee</label>
        <p className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded">
          ${reservation.late_fee || '0'}
        </p>
      </div>
          <div className="block mt-4">
      <label className="text-green-900 font-medium">Damages</label>
        <p className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded">
          ${reservation.damages || '0'}
        </p>
    </div>
    <div className="block mt-2">
      <label className="text-green-900 font-medium">Total amount due</label>
      <p className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded">
        ${parseFloat(invoice.late_fee || 0) + parseFloat(invoice.damages || 0)}
      </p>
    </div>
  </>
)}
    {!invoice.paid && (<button 
      className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      onClick={e => { nav(`/invoice-payment/${id}`) }}
    >
      Proceed to Payment
    </button>)}
    <button 
      className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      onClick={handleInvoice}
    >
      Print Invoice
    </button>
</div>
      
      </div>
      </div>
    </div>
  );
};

export default CustomerReviewInvoice;
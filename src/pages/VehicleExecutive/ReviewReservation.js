import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AdminHeader from '../Components/AdminHeader';
import { handleInputChange } from '../../formUtils';

const ReviewReservation = () => {
  const nav = useNavigate();
  const { id } = useParams();

  const [reservation, setReservation] = useState({});
  const [vehicle, setVehicle] = useState({});
  const [customer, setCustomer] = useState({});
  const [error, setError] = useState('');
  const [invoice, setInvoice] = useState({
    damageDescription: '',
  });  
  const [status, setStatus] = useState('');
  const [late_fee, setLateFee] = useState('');
  const [invoiceExists, setInvoiceExists] = useState(false);

  useEffect(() => {
      const fetchInvoice = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/invoice/reservation/${id}`);
        if (response.status === 200) {
          setInvoiceExists(true);
        }
        setInvoice(response.data);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      }
    };
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
      
      if (response.data.actual_drop_off_date != null) {
        const drop_off_date = new Date(response.data.drop_off_date);
        const actual_drop_off_date = new Date(response.data.actual_drop_off_date);
        const diffDays = Math.ceil((actual_drop_off_date - drop_off_date) / (1000 * 60 * 60 * 24));
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


    if (id) {
      fetchInvoice();
    }
  }, [id]);



  const handleChange = handleInputChange(setReservation);
  const handleInvoiceChange = handleInputChange(setInvoice);



 const handleStepSubmit = async (e) => {
  e.preventDefault();
    const parseLocalDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-based
  };
  const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // sets time to 00:00:00
  let updatedFields = {
    res_modified_date: now.toISOString(),
    res_last_action: "Updated"
  };
  if (reservation.res_status === 'Reserved') {
    const actual_pick = parseLocalDate(reservation.actual_pick_up_date);
    if(actual_pick < today ) {

      setError('Actual pick-up date cannot be in the past.');
      return;
    }
    updatedFields.res_status = 'Rented';
  } else if (reservation.res_status === 'Rented') {
    if(new Date(reservation.actual_drop_off_date) < now ) {
      setError('Actual drop-off date cannot be in the past.');
      return;
    }
    updatedFields.actual_drop_off_date = reservation.actual_drop_off_date;
    updatedFields.res_status = 'Completed';

        const drop_off_date = new Date(reservation.drop_off_date);
        const actual_drop_off_date = new Date(reservation.actual_drop_off_date);
        const diffDays = Math.ceil((actual_drop_off_date - drop_off_date) / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
          setLateFee(diffDays * 500);
        } else {
          setLateFee(0);
        }
      
  }
  setError('');
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


  } catch (err) {
    console.error("Update failed:", err);
  }
      // Reload updated reservation
    const res = await axios.get(`http://localhost:8080/api/reservation/${id}`);
    setReservation(res.data);
    setStatus(res.data.res_status);
};


 const handleInvoice = async (e) => {
  e.preventDefault();
  const now = new Date().toISOString();

  let updatedFields = {
    res_modified_date: now,
    res_last_action: "Updated"
  };

  updatedFields.late_fee = late_fee;
  console.log("Late fee:", late_fee);

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
    const response = await axios.post(`http://localhost:8080/api/invoice`, {
      reservation: id,
      vehicle: reservation.vehicle,
      damageDescription: invoice.damageDescription,
      invoice_created_date: now,
    });
    // Reload updated reservation
    const res = await axios.get(`http://localhost:8080/api/reservation/${id}`);
    setReservation(res.data);
    setStatus(res.data.res_status);
    window.location.reload();
  } catch (err) {
    console.error("Update failed:", err);
  }
};


  return (
    <div>
      <AdminHeader />
      <div className="relative min-h-[calc(100vh-10vh)] bg-gray-100 flex flex-col items-center justify-center px-4 py-8">
      <h2>Review Reservation</h2>
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
<div className="block">
  <label className="text-green-900 font-medium">Current Status</label>
  <p className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded capitalize">
    {reservation.res_status || 'Unknown'}
  </p>
</div>  
  {reservation.res_status === 'Reserved' && (
    <div className="block">
      <label className="text-green-900 font-medium">Actual Pick-Up Date</label>
      <input 
        type="date" 
        name="actual_pick_up_date" 
        value={reservation.actual_pick_up_date || ''} 
        onChange={handleChange}
        required
        className="mt-1 block w-full border border-green-300 rounded px-3 py-2"
      />
    </div>
  )}

  {reservation.res_status === 'Rented' && (
    <>
      <div className="block">
        <label className="text-green-900 font-medium">Actual Pick-Up Date</label>
        <p className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded">
          {reservation.actual_pick_up_date || 'Not Available'}
        </p>
      </div>
      <div className="block">
        <label className="text-green-900 font-medium">Actual Drop-Off Date</label>
        <input 
          type="date" 
          name="actual_drop_off_date" 
          value={reservation.actual_drop_off_date || ''} 
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-green-300 rounded px-3 py-2"
        />
      </div>
    </>
  )}

  {reservation.res_status === 'Completed' && (
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
  )}

  {(reservation.res_status === 'Reserved' || reservation.res_status === 'Rented') && (
    <button 
      onClick={handleStepSubmit}
      className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      Submit Step
    </button>
  )
  
  }
          {error && (
          <div className="text-red-600 font-medium mt-4 w-full text-center">
            {error}
          </div>
        )}    
</div>
{reservation.res_status === "Completed" && (
<div className="border border-gray-300 rounded-lg p-4 w-[300px] shadow-sm bg-white">

<h3 className="font-semibold text-green-900 mb-2">Extra Charges</h3>
      <div className="block">
        <label className="text-green-900 font-medium">Late Fee</label>
        <p className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded">
          {reservation.late_fee || late_fee || 'Not Available'}
        </p>
      </div>
          <div className="block mt-4">
      <label className="text-green-900 font-medium">Damages</label>
<input 
  type="text" 
  name="damages" 
  value={reservation.damages || ''} 
  onChange={handleChange}
  readOnly={invoiceExists}
  className={`mt-1 block w-full border border-green-300 rounded px-3 py-2 ${
    invoiceExists ? 'bg-gray-100' : 'bg-white'
  }`}
/>
    </div>
    <div className="block mt-4">
      <label className="text-green-900 font-medium">Damges Description</label>
<textarea 
  name="damageDescription" 
  value={invoice.damageDescription || ''} 
  onChange={handleInvoiceChange}
  readOnly={invoiceExists}
  className={`w-full h-16 p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 ${
    invoiceExists ? 'bg-gray-100' : 'bg-white focus:ring-green-500'
  }`}
/>
    </div>
{invoiceExists && 
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
  </>
}
    <button 
      onClick={handleInvoice}
      className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      Submit Invoice
    </button>
    
</div>
)}

      </div>
      </div>
    </div>
  );
};

export default ReviewReservation;
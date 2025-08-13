import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageInvoices = () => {
  const now = new Date();
  const [invoices, setInvoices] = useState([]);
    const [paidInvoices, setPaidInvoices] = useState([]);
    const customerId = localStorage.getItem("customerId");
  const [filters, setFilters] = useState({
    startDate:'',
    endDate:'',
  });
    const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  axios.get(`https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/invoice/customer/${customerId}/paid/false`)
    .then(response => setInvoices(response.data))
    .catch(error => console.error("Error fetching employees:", error));
      axios.get(`https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/invoice/customer/${customerId}/paid/true`)
    .then(response => setPaidInvoices(response.data))
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
  
  return (
  <div className="mr-6">
    <h2 className="m-6 text-2xl font-semibold mb-4">Requires Payment</h2>



    <table className="mt-6 ml-6 w-full table-auto border-collapse">
      <thead>
      <tr className="bg-gray-100 text-black">
      <th className="border px-4 py-2 text-left">ID</th>
      <th className="border px-4 py-2 text-left">Vehicle</th>
      <th className="border px-4 py-2 text-left">pick up date</th>
      <th className="border px-4 py-2 text-left">drop off date</th> 
      <th className="border px-4 py-2 text-left">late fee</th>
      <th className="border px-4 py-2 text-left">damages</th>
      <th className="border px-4 py-2 text-left w-xl">damage description</th>
      <th className="border px-4 py-2 text-left">total amount due</th>
      <th className="border px-4 py-2 text-left">Action</th>

      </tr>
      </thead>
      <tbody>
        {invoices.map(maint => (
          <tr key={maint.invoice_id} style={{ borderBottom: "1px solid #ccc" }}>
            <td>{maint.invoice_id}</td>
            <td>{maint.vehicleBrand} {maint.vehicleModel} {maint.make_year}</td>
            <td>{formatLocalDate(maint.pick_up_date)}</td>
            <td>{formatLocalDate(maint.drop_off_date)}</td>

            <td>{maint.late_fee ? `$${maint.late_fee}` : "N/A"}</td>
            <td>{maint.damages ? `$${maint.damages}` : "N/A"}</td>
                <td>{maint.damageDescription}</td>
            <td>{`$${maint.damages + maint.late_fee}`}</td>
            
              <td>
                <button
                  onClick={() => navigate(`/customer-review-invoice/${maint.reservation}`)}
                  style={{ padding: "6px 12px", backgroundColor: "#0077cc", color: "#fff", border: "none", borderRadius: "4px" }}
                >
                  Payment
                </button>
              </td>
            </tr>
          ))}
      </tbody>
      </table>


<h2 className="m-6 text-2xl font-semibold mb-4">Paid Invoices</h2>



    <table className="mt-6 mb-16 ml-6 w-full table-auto border-collapse">
      <thead>
      <tr className="bg-gray-100 text-black">
      <th className="border px-4 py-2 text-left">ID</th>
      <th className="border px-4 py-2 text-left">Vehicle</th>
      <th className="border px-4 py-2 text-left">pick up date</th>
      <th className="border px-4 py-2 text-left">drop off date</th> 
      <th className="border px-4 py-2 text-left">late fee</th>
      <th className="border px-4 py-2 text-left">damages</th>
      <th className="border px-4 py-2 text-left w-xl">damage description</th>
      <th className="border px-4 py-2 text-left">total amount due</th>
      <th className="border px-4 py-2 text-left">Action</th>

      </tr>
      </thead>
      <tbody>
        {paidInvoices.map(maint => (
          <tr key={maint.invoice_id} style={{ borderBottom: "1px solid #ccc" }}>
            <td>{maint.invoice_id}</td>
            <td>{maint.vehicleBrand} {maint.vehicleModel} {maint.make_year}</td>
            <td>{formatLocalDate(maint.pick_up_date)}</td>
            <td>{formatLocalDate(maint.drop_off_date)}</td>

            <td>{maint.late_fee ? `$${maint.late_fee}` : "N/A"}</td>
            <td>{maint.damages ? `$${maint.damages}` : "N/A"}</td>
                <td>{maint.damageDescription}</td>
            <td>{`$${maint.damages + maint.late_fee}`}</td>
            
              <td>
                <button
                  onClick={() => navigate(`/customer-review-invoice/${maint.reservation}`)}
                  style={{ padding: "6px 12px", backgroundColor: "#0077cc", color: "#fff", border: "none", borderRadius: "4px" }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
      </tbody>
      </table>
    </div>
    );
}

export default ManageInvoices;
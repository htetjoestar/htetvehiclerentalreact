import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './employee.css'
import AdminHeader from "../Components/AdminHeader";
import BarChart from "./charts/DashboardCharts";
import ProfitGauge from "./charts/ProfitGauge";
import ProfitBar from "./charts/ProfitGauge";
const Dashboard = () => {
  const now = new Date();
  const [data, setData] = useState([]);
    const [resData, setResData] = useState([]);
      const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("June 2026");

  const [filters, setFilters] = useState({
    startDate:'',
    endDate:'',
  });
    const [error, setError] = useState('');
  const navigate = useNavigate();

  function getCurrentMonthString() {
  const now = new Date();
  return `${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`;
}
function parseMonthString(monthString) {
  const [monthName, yearStr] = monthString.split(" ");
  const year = parseInt(yearStr, 10);
  const month = new Date(`${monthName} 1, 2000`).getMonth() + 1; // 1-based month
  return { year, month };
}
  useEffect(() => {
  axios.post("http://localhost:8080/api/reservation/monthly/current", { year: 2025, month: 6 })
    .then(response => setData(response.data))
    .catch(error => console.error("Error fetching employees:", error));
  axios.get("http://localhost:8080/api/reservation/created-per-day")
    .then(response => setResData(response.data))
    .catch(error => console.error("Error fetching employees:", error));
  axios.get("http://localhost:8080/api/reservation/months").then(res => {
    const formattedMonths = res.data.map(entry => {
      const date = new Date(entry.year, entry.month - 1);
      return `${date.toLocaleString("default", { month: "long" })} ${entry.year}`;
    });
    setMonths(formattedMonths);

    const currentMonth = getCurrentMonthString();
    if (formattedMonths.includes(currentMonth)) {
      setSelectedMonth(currentMonth);
      const { year, month: monthNum } = parseMonthString(currentMonth);
      axios.post("http://localhost:8080/api/reservation/monthly/current", {
        year,
        month: monthNum
      }).then(response => setData(response.data))
        .catch(error => console.error("Error fetching current month data:", error));
    }
  });
  }, []);

  function formatLocalDate(dateStr) {
    if(dateStr == null){
      return;
    }
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString();
  }


const handleClick2 = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.get(
      'http://localhost:8080/api/reservation/report/monthly',
      {
        params: filters,
        responseType: 'blob', // This is key for downloading files
      }
    );

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'monthly_report.xlsx'; // Use .xlsx extension
    a.click();

    URL.revokeObjectURL(url); // Clean up
  } catch (error) {
    console.error("Error fetching and downloading Excel report:", error);
  }
};

function calculateChange(current, previous) {
  if (previous === 0) return "N/A";
  const change = ((current - previous) / previous) * 100;
  return Math.abs(change.toFixed(1)); // Always positive, arrow indicates direction
}
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-48 h-screen overflow-y-auto bg-gray-200 p-4 border-r">
        <h3 className="text-md font-semibold mb-2">Months</h3>
        
        <button
          onClick={handleClick2}
          className="px-4 py-2 mb-4 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Generate Report
        </button>
        <ul>
          {months.map((month, index) => (
            <li
              key={index}
              onClick={() => {
                setSelectedMonth(month);
                const { year, month: monthNum } = parseMonthString(month);
                axios.post("http://localhost:8080/api/reservation/monthly/current", {
                  year,
                  month: monthNum
                }).then(response => setData(response.data))
                  .catch(error => console.error("Error fetching data for selected month:", error));
              }}
              className={`cursor-pointer p-2 rounded mb-1 hover:bg-gray-300 ${
                selectedMonth === month ? "bg-blue-300 font-semibold" : ""
              }`}
            >
              {month}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <h2 className="m-6 text-2xl font-semibold mb-4">{selectedMonth} Dashboard</h2>

        <div className="flex flex-wrap mr-10 ml-10 items-center justify-between bg-gray-100">
          <div></div>
          <div className="flex flex-wrap items-center justify-between bg-gray-100">

            <div className="m-6 flex flex-col">
              <label className="text-sm">Total Customers</label>
              <h2 className="flex text-lg justify-center">{data.uniqueCustomers}</h2>
            </div>

            <div className="m-6 flex flex-col">
              <label className="text-sm">Total Reservation</label>
              <h2 className="flex text-lg justify-center">{data.totalReservations}</h2>
            </div>

            <div className="m-6 flex flex-col">
              <label className="text-sm text-green-500">Total Rental Days</label>
              <h2 className="flex text-lg justify-center">{data.totalRentalDays}</h2>
            </div>

            <div className="m-6 flex flex-col">
              <label className="text-sm">Rented Vehicles</label>
              <h2 className="flex text-lg justify-center">{data.uniqueVehiclesRented}</h2>
            </div>

            <div className="m-6 flex flex-col">
              <label className="text-sm text-red-500">Idle Vehicles</label>
              <h2 className="flex text-lg justify-center">{data.vehiclesIdle}</h2>
            </div>

            <div className="m-6 flex flex-col">
              <label className="text-sm text-red-500">Total Idle Days</label>
              <h2 className="flex text-lg justify-center">{data.idleDays}</h2>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap">
              <div className="flex flex-col mr-5">
                <label className="text-sm text-orange-500">Potential Profit</label>
                <h2 className="flex text-lg justify-center">${data.potentialProfit}</h2>
              </div>
              <div className="flex flex-col mr-5">
                <label className="text-sm text-green-500">Total Profit</label>
                <h2 className="flex text-lg justify-center">${data.totalProfit}</h2>
              </div>
            </div>
          </div>
        </div>
<div className="flex justify-center ml-6 mb-20 justify-center mr-6">
  <div className="flex flex-col mr-6 items-center">
    <ProfitGauge
      realProfit={data.totalProfit}
      potentialProfit={data.potentialProfit}
    />

    {/* Previous Month */}
    <div className="flex flex-col mr-5 items-center bg-gray-100 w-48 p-4 rounded shadow mt-4">
      <label className="text-sm text-orange-500">Previous Month Profit</label>
      <h2 className="text-lg font-semibold">
        {data.previousMonthProfit > 0 ? `$${data.previousMonthProfit}` : "N/A"}
      </h2>
      <p className={`text-sm mt-1 ${
        data.previousMonthProfit === 0
          ? "text-gray-400"
          : data.totalProfit > data.previousMonthProfit
          ? "text-green-500"
          : "text-red-500"
      }`}>
        {data.previousMonthProfit === 0
          ? "N/A"
          : `${calculateChange(data.totalProfit, data.previousMonthProfit)}%` +
            (data.totalProfit > data.previousMonthProfit ? " ↑" : " ↓")}
      </p>
    </div>

    {/* Next Month */}
    <div className="flex flex-col mr-5 items-center bg-gray-100 w-48 p-4 rounded shadow mt-4">
      <label className="text-sm text-orange-500">Next Month Profit</label>
      <h2 className="text-lg font-semibold">
        {data.nextMonthProfit > 0 ? `$${data.nextMonthProfit}` : "N/A"}
      </h2>
      <p className={`text-sm mt-1 ${
        data.nextMonthProfit === 0
          ? "text-gray-400"
          : data.totalProfit > data.nextMonthProfit
          ? "text-green-500"
          : "text-red-500"
      }`}>
        {data.nextMonthProfit === 0
          ? "N/A"
          : `${calculateChange(data.totalProfit, data.nextMonthProfit)}%` +
            (data.totalProfit > data.nextMonthProfit ? " ↑" : " ↓")}
      </p>
    </div>
  </div>

<BarChart year={parseMonthString(selectedMonth).year} month={parseMonthString(selectedMonth).month} />
</div>

      </div>
    </div>
    );
}

export default Dashboard;
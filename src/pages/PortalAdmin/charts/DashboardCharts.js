import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";

const BarChart = ({ year, month, goal = 10 }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (year && month) {
      axios
        .post("http://localhost:8080/api/reservation/created-per-day", { year, month })
        .then((response) => setData(response.data))
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [year, month]);

  const daysInMonth = new Date(year, month, 0).getDate();

  const countMap = new Map();
  data.forEach(({ date, count }) => {
    countMap.set(date, count);
  });

  const fullMonthData = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month - 1, day);
    const isoDate = dateObj.toISOString().split("T")[0];
    const label = `${day}/${month}`;
    const count = countMap.get(isoDate) || 0;
    fullMonthData.push([label, count, goal]); // Add goal line value
  }

  const chartData = [["Date", "Reservations", "Goal"], ...fullMonthData];

  const options = {
    title: "New Reservations per Day",
    legend: { position: "top" },
    hAxis: {
      title: "Date",
      slantedText: true,
      slantedTextAngle: 45,
      textStyle: { fontSize: 10 },
    },
    vAxis: {
      title: "Count",
      minValue: 0,
      maxValue: 20,
      viewWindow: {
        min: 0,
        max: 20,
      },
      format: "decimal",
      gridlines: { count: 5 },
    },
    seriesType: "bars",
    series: {
      1: { type: "line", color: "#f59e0b", lineDashStyle: [4, 4] }, // Goal line
    },
    bar: { groupWidth: "75%" },
    colors: ["#1e40af", "#f59e0b"],
    chartArea: { width: "80%", height: "70%" },
    backgroundColor: "transparent",
  };

  return (
    <div className="w-3/4 h-[450px] mt-12 pb-20 p-4 border rounded shadow">
      <h2 className="mb-4 text-lg font-semibold">New Reservations per Day</h2>
      <Chart
        chartType="ComboChart"
        width="100%"
        height="350px"
        data={chartData}
        options={options}
        loader={<div>Loading Chart...</div>}
      />
    </div>
  );
};

export default BarChart;
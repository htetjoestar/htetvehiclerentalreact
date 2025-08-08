import React from 'react';
import { Chart } from 'react-google-charts';

const ProfitGauge = ({ realProfit = 60, potentialProfit = 100 }) => {
  const percentage = (realProfit / potentialProfit) * 100;

  const data = [
    ['Label', 'Value'],
    ['Profit', percentage],
  ];

  const options = {
    min: 0,
    max: 100,
    width: 300,
    height: 160,
    redFrom: 0,
    redTo: 20,
    yellowFrom: 20,
    yellowTo: 40,
    greenFrom: 40,
    greenTo: 110, // allow for overflow visually
    minorTicks: 5,
    majorTicks: ['0%', '20%', '40%', '60%', '80%', '100%'],
  };

  return (
    <div className="mt-6 p-4 items-center text-center">
      <h3 className="text-sm text-gray-500 mb-2">Profit Quota (Target: 40%)</h3>
<div className="flex justify-center">
  <Chart
    chartType="Gauge"
    width="160px" 
    height="160px" 
    data={data}
    options={options}
    loader={<div>Loading Chart...</div>}
  />
</div>
      <p className="text-xs text-gray-500 mt-2">
        Real: ${realProfit} / Target: ${potentialProfit* 0.4}
      </p>
    </div>
  );
};

export default ProfitGauge;
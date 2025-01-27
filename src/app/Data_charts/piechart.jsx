// InsideOutsideChart.tsx
"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../styles/globals.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const InsideOutsideChart = ({ insideCount, outsideCount }) => {
  const data = {
    labels: ["Inside", "Outside"],
    datasets: [
      {
        data: [insideCount, outsideCount],
        backgroundColor: ["#4CAF50", "#FF5722"],
        hoverBackgroundColor: ["#45A049", "#FF7043"],
      },
    ],
  };

  return (
    <div className="chart-container">
      <h2 className="text-center text-lg font-bold mb-4">Inside vs Outside</h2>
      <Pie data={data} />
    </div>
  );
};

export default InsideOutsideChart;

"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TypeDistributionChart = ({ typeData }: { typeData: { [key: string]: number } }) => {
  const data = {
    labels: Object.keys(typeData), // Types (e.g., "home", "classroom")
    datasets: [
      {
        label: "Entry Count by Type",
        data: Object.values(typeData), // Count of each type
        backgroundColor: "#3B82F6",
        borderColor: "#2563EB",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom dimensions
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div
      className="chart-container"
      style={{
        width: "100%", // Adjust width as needed
        height: "400px", // Adjust height as needed
        maxWidth: "600px", // Optional: limit the maximum width
        margin: "0 auto", // Center the chart
      }}
    >
      <h2 className="text-center text-lg font-bold mb-4">Type Distribution</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TypeDistributionChart;

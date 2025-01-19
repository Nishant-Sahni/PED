"use client";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
  } from "chart.js";
  
  ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);
const EntryTrendsChart = ({ trends }: { trends: { date: string; count: number }[] }) => {
  const chartData = {
    labels: trends.map((trend) => trend.date),
    datasets: [
      {
        label: "Entries Over Time",
        data: trends.map((trend) => trend.count),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Entry Trends Over Time</h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
            },
          },
        }}
      />
    </div>
  );
};

export default EntryTrendsChart;

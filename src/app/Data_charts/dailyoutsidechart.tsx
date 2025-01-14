"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface DailyOutsideChartProps {
  dailyData: { [date: string]: number };
}

const DailyOutsideChart: React.FC<DailyOutsideChartProps> = ({ dailyData }) => {
  const data = {
    labels: Object.keys(dailyData), // Dates
    datasets: [
      {
        label: "Number of People Outside",
        data: Object.values(dailyData), // Counts
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default DailyOutsideChart;

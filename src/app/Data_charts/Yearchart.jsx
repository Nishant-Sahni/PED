"use client";

import React from "react";
import { Bar } from "react-chartjs-2";

const YearChart = ({ yearData }) => {
  const labels = Object.keys(yearData).sort(); // Sort years chronologically
  const dataValues = labels.map((year) => yearData[year]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Number of Students",
        data: dataValues,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4 text-center">Entries by Year</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default YearChart;

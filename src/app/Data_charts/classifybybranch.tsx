import { Bar } from "react-chartjs-2";

const BranchOutsideChart = ({ branchData }) => {
  const data = {
    labels: Object.keys(branchData), // Branch names
    datasets: [
      {
        label: "People Outside by Branch",
        data: Object.values(branchData), // Count of people outside for each branch
        backgroundColor: "#3B82F6",
        borderColor: "#2563EB",
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
  };

  return (
    <div className="chart-container">
      <h2 className="text-center text-lg font-bold mb-4">Outside Users by Branch</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BranchOutsideChart;

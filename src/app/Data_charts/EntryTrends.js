import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EntryTrendsLineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No entries available</p>;
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, bottom: 50, left: 40 }} // Increased bottom margin
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }} // Smaller font for dates
            angle={-25} // Tilt X-axis labels to prevent overlap
            textAnchor="end"
            label={{
              value: "Date",
              position: "bottom",
              offset: 30, // Move label lower
              fontSize: 14,
            }}
          />
          <YAxis
            label={{
              value: "Entries",
              angle: -90,
              position: "insideLeft",
              fontSize: 14,
            }}
          />
          <Tooltip />
          <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: "14px" }} />
          <Line type="monotone" dataKey="normal" stroke="#82ca9d" name="Normal Entries" />
          <Line type="monotone" dataKey="late" stroke="#ff7300" name="Late Entries" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EntryTrendsLineChart;

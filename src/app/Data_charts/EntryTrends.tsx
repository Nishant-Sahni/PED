import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const EntryTrendsLineChart = ({
  data,
}: {
  data: { date: string; normal: number; late: number }[];
}) => {
  if (!data || data.length === 0) {
    return <p>No entries available</p>;
  }

  return (
    <LineChart
      width={450}
      height={300}
      data={data}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" label={{ value: "Date", position: "insideBottom", offset: -10 }} />
      <YAxis label={{ value: "Entries", angle: -90, position: "insideLeft" }} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="normal" stroke="#82ca9d" name="Normal Entries" />
      <Line type="monotone" dataKey="late" stroke="#ff7300" name="Late Entries" />
    </LineChart>
  );
};

export default EntryTrendsLineChart;

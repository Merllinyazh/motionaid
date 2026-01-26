import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { week: "W1", days: 3 },
  { week: "W2", days: 5 },
  { week: "W3", days: 7 },
  { week: "W4", days: 7 },
];

export default function BarChartCard() {
  return (
    <div className="bg-white shadow-sm p-6 rounded-xl w-full">
      <h2 className="text-xl mb-3 font-semibold">Streak History</h2>

      <BarChart width={450} height={270} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="days" fill="#ff9800" />
      </BarChart>
    </div>
  );
}

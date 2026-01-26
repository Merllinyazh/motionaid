import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", motor: 75, speech: 85, cognitive: 90 },
  { day: "Tue", motor: 80, speech: 88, cognitive: 92 },
  { day: "Wed", motor: 78, speech: 85, cognitive: 88 },
  { day: "Thu", motor: 85, speech: 90, cognitive: 95 },
  { day: "Fri", motor: 90, speech: 92, cognitive: 98 },
  { day: "Sat", motor: 92, speech: 94, cognitive: 97 },
  { day: "Sun", motor: 95, speech: 96, cognitive: 100 },
];

export default function LineChartCard() {
  return (
    <div className="bg-white shadow-sm p-6 rounded-xl w-full">
      <h2 className="text-xl mb-3 font-semibold">Weekly Performance</h2>

      <LineChart width={550} height={270} data={data}>
        <CartesianGrid stroke="#eee" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="motor" stroke="#007bff" />
        <Line type="monotone" dataKey="speech" stroke="#00c4b3" />
        <Line type="monotone" dataKey="cognitive" stroke="#9b4dff" />
      </LineChart>
    </div>
  );
}

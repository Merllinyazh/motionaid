import React from "react";

export default function StatCard({ icon, title, value, percent }) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-5 flex flex-col gap-2 w-full">
      <div className="flex items-center gap-3">
        <div className="text-3xl">{icon}</div>
        <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      </div>

      <h1 className="text-3xl font-bold text-slate-800">{value}</h1>

      <div className="w-full bg-slate-200 h-2 rounded-full">
        <div
          className="h-full bg-blue-600 rounded-full"
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      <span className="text-sm text-slate-500">{percent}% of max</span>
    </div>
  );
}

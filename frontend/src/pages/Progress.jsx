import React from "react";
import StatCard from "../components/StatCard";
import LineChartCard from "../components/LineChartCard";
import BarChartCard from "../components/BarChartCard";
import Banner from "../components/Banner";

export default function Progress() {
  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* Header */}
      <h1 className="text-3xl font-bold text-slate-800 mt-15">Your Progress</h1>
      <p className="text-slate-500 mb-6">
        Track your rehabilitation journey and celebrate your achievements
      </p>

      {/* Current Streak */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-6 rounded-xl text-white shadow mb-6">
        <h2 className="text-2xl font-semibold">Current Streak</h2>
        <p className="text-4xl font-bold mt-2">7 days</p>
        <p className="text-sm opacity-90">Best: 12 days</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon="💪" title="Motor Skills" value={92} percent={92} />
        <StatCard icon="🎤" title="Speech Clarity" value={95} percent={95} />
        <StatCard icon="🧠" title="Cognitive Speed" value={97} percent={97} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <LineChartCard />
        <BarChartCard />
      </div>

      <Banner />
    </div>
  );
}

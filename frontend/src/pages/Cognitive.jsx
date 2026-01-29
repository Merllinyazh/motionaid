import React from "react";
import * as LucideIcons from "lucide-react"; // ✅ Import all icons safely

export default function Cognitive() {
  const Brain = LucideIcons.Brain; // ✅ Assign icon component properly

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center py-20">
        <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl shadow-md mb-6">
          <Brain className="w-14 h-16 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Cognitive Skills</h1>
        <p className="text-gray-500 text-lg">
          Train your memory and reaction time with adaptive exercises
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center">
          <p className="text-gray-500 font-medium mb-1">Score</p>
          <p className="text-4xl font-bold text-gray-800">0</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center">
          <p className="text-gray-500 font-medium mb-1">Level</p>
          <p className="text-4xl font-bold text-gray-800">3</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center">
          <p className="text-gray-500 font-medium mb-1">Sequence</p>
          <p className="text-4xl font-bold text-gray-800">0/0</p>
        </div>
      </div>

      {/* Color Boxes */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-400 rounded-2xl h-72 hover:scale-105 transition-transform duration-200 cursor-pointer"></div>
          <div className="bg-green-400 rounded-2xl h-72 hover:scale-105 transition-transform duration-200 cursor-pointer"></div>
        </div>
      </div>
    </div>
  );
}

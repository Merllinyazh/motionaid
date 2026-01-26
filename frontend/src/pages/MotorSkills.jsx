import React, { useState } from "react"; // ✅ import useState here
import { FaCamera, FaPlay } from "react-icons/fa";

const MotorSkills = () => {
  const [checked, setChecked] = useState([false, false, false, false]);

  const handleCheck = (index) => {
    const newState = [...checked];
    newState[index] = !newState[index];
    setChecked(newState);
  };

  return (
    <div className="pt-28 pb-16 bg-gray-50 min-h-screen flex flex-col items-center px-4">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-blue-500 text-white flex items-center justify-center rounded-2xl mx-auto mb-4 text-3xl">
          <FaCamera />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Motor Skills Training
        </h1>
        <p className="text-gray-500 mt-2">
          Camera-based motion tracking for hand and body exercises
        </p>
      </div>

      {/* Content Layout */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        {/* Left Section - Camera Placeholder */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center text-gray-400">
            <FaCamera className="text-4xl mb-3" />
            <p className="text-gray-500">Camera feed will appear here</p>
            <p className="text-xs text-gray-400 mt-1">
              Mediapipe tracking ready for integration
            </p>
          </div>

          <button className="mt-8 bg-linear-to-r from-blue-500 to-teal-500 text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition">
            <FaPlay />
            Start Exercise
          </button>
        </div>

        {/* Right Section - Progress and Tips */}
        <div className="flex flex-col gap-6 w-full md:w-80">
          {/* Session Progress */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-gray-800 font-semibold mb-2">Session Progress</h3>
            <p className="text-gray-500 text-sm mb-2">Repetitions</p>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className="bg-blue-500 h-3 rounded-full w-[0%]"></div>
            </div>
            <p className="text-right text-gray-700 font-medium">0 / 10</p>
          </div>

          {/* ✅ Exercise Tips with Checkboxes */}
          <div className="bg-linear-to-r from-blue-500 to-teal-500 text-white rounded-xl p-6 shadow-md">
            <h3 className="font-semibold mb-3">Exercise Tips</h3>
            <ul className="space-y-3 text-sm">
              {[
                "Position yourself clearly in frame",
                "Move slowly and deliberately",
                "Follow the visual guides",
                "Take breaks when needed",
              ].map((tip, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 cursor-pointer select-none"
                  onClick={() => handleCheck(index)}
                >
                  <div
                    className={`w-5 h-5 flex items-center justify-center rounded-md border-2 transition-all duration-200 ${
                      checked[index]
                        ? "bg-green-400 border-green-400"
                        : "bg-white/10 border-white"
                    }`}
                  >
                    {checked[index] && (
                      <span className="text-white font-bold text-xs">✓</span>
                    )}
                  </div>
                  <span
                    className={`transition-colors ${
                      checked[index] ? "text-white/80" : "text-white"
                    }`}
                  >
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotorSkills;

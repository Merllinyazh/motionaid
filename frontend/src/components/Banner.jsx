import React from "react";

export default function Banner() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-500 to-teal-400 p-6 rounded-xl shadow text-white text-center mt-6">
      <h2 className="text-2xl font-semibold">🎉 You're doing amazing!</h2>
      <p className="mt-2 text-sm">
        Keep up the great work. Every day of practice brings you closer to your
        recovery goals.
      </p>
    </div>
  );
}

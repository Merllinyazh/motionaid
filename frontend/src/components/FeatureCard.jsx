import React from "react";

const FeatureCard = ({ icon, title, description, linkColor }) => {
  return (
    <div className="bg-white shadow-md rounded-xl border border-gray-100 p-6 w-full md:w-80 transition-transform hover:-translate-y-2 hover:shadow-lg cursor-pointer">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-lg mb-4 ${linkColor} text-white text-2xl`}
      >
        {icon}
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-3">{description}</p>

      {/* changed <a> to <span> so we don't have nested anchors */}
      <span className="text-blue-600 font-medium hover:underline">
        Start Training →
      </span>
    </div>
  );
};

export default FeatureCard;

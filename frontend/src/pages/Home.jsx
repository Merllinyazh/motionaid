import React from "react";
import FeatureCard from "../components/FeatureCard";
import { FaHeartbeat, FaMicrophoneAlt, FaBrain, FaChartBar } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="pt-28 pb-16 bg-gray-50 flex flex-col items-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-3 text-center">
        Welcome to MotionAid
      </h1>
      <p className="text-gray-600 text-center max-w-2xl mb-10">
        Your personal rehabilitation companion. Choose a module below to begin your recovery journey.
      </p>

      {/* Feature Cards */}
      <div className="flex flex-col md:flex-row justify-center gap-8 mb-10">
        <Link to="/motor-skills">
          <FeatureCard
            icon={<FaHeartbeat />}
            title="Motor Skills"
            description="Practice hand and body movements with real-time motion tracking and feedback."
            linkColor="bg-blue-500"
          />
        </Link>

        <Link to="/speech">
            <FeatureCard
            icon={<FaMicrophoneAlt />}
            title="Speech Therapy"
            description="Improve pronunciation, pace, and clarity with guided speech exercises."
            linkColor="bg-teal-500"
            />
        </Link>

        <Link to="/cognitive">
            <FeatureCard
            icon={<FaBrain />}
            title="Cognitive Skills"
            description="Sharpen memory and reaction time with adaptive mental exercises."
            linkColor="bg-purple-500"
            />
        </Link>

        <Link to="/progress">
            <FeatureCard
            icon={<FaChartBar />}
            title="Progress"
            description="Track your rehabilitation progress and achievements."
            linkColor="bg-orange-500"
            />
        </Link>
      </div>

      <p className="text-gray-700 font-medium text-center">
        Start your daily practice to build your recovery streak! 
      </p>
    </main>
  );
};

export default Home;

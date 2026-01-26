import React from "react";
import { FaHeartbeat,FaMicrophoneAlt,FaBrain,FaChartLine, } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-2" onClick={() => navigate("/")}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3771/3771518.png"
            alt="logo"
            className="w-7 h-7"
          />
          <span className="text-xl font-bold text-blue-600">MotionAid</span>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-8 text-gray-600 font-medium">
          <li>
            <NavLink
              to="/motor-skills"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200"
                  : "flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium px-4 py-2 rounded-lg transition-all duration-200"
              }
            >
              <FaHeartbeat className="text-lg" />
              <span>MotorSkills</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/speech"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200"
                  : "flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium px-4 py-2 rounded-lg transition-all duration-200"
              }
            >
              <FaMicrophoneAlt className="text-lg" />
              <span>Speech</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/cognitive"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200"
                  : "flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium px-4 py-2 rounded-lg transition-all duration-200"
              }
            >
              <FaBrain className="text-lg" />
              <span>Cognitive</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/progress"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200"
                  : "flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium px-4 py-2 rounded-lg transition-all duration-200"
              }
            >
              <FaChartLine className="text-lg" />
              <span>Progress</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

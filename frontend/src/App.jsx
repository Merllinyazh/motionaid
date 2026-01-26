import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MotorSkills from "./pages/MotorSkills";
import Speech from "./pages/Speech";
import Cognitive from "./pages/Cognitive";
import Progress from "./pages/Progress";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/motor-skills" element={<MotorSkills />} />
            <Route path="/speech" element={<Speech />} />
            <Route path="/cognitive" element={<Cognitive/>} />
            <Route path="/progress" element={<Progress/>}/>
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

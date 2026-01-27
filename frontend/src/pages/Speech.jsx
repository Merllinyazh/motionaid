import { useState } from "react";
import axios from "axios";

import bImg from "../assets/b.jpg";
import iImg from "../assets/i.jpg";
import aImg from "../assets/a.jpg";

const beginnerLetters = [
  { id: "ba", text: "Ba" },
  { id: "ma", text: "Ma" },
  { id: "ka", text: "Ka" },
  { id: "pa", text: "Pa" },
  { id: "ta", text: "Ta" }
];

const intermediateWords = [
  { id: "apple", text: "Apple" },
  { id: "ball", text: "Ball" },
  { id: "cat", text: "Cat" },
  { id: "dog", text: "Dog" },
  { id: "fish", text: "Fish" }
];

const advancedSentences = [
  { id: "sentence_01", text: "I like to play in the park." },
  { id: "sentence_02", text: "She is reading a story book." },
  { id: "sentence_03", text: "The sun rises in the east." },
  { id: "sentence_04", text: "He drinks milk every morning." },
  { id: "sentence_05", text: "They are going to school." }
];

const levels = ["Beginner", "Intermediate", "Advanced"];

export default function Speech() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="text-center mb-12">
        <div className="w-14 h-14 bg-teal-500 rounded-xl flex items-center justify-center text-white text-2xl mx-auto mb-3">
          🎤
        </div>
        <h1 className="text-4xl font-bold text-slate-800">Speech Therapy</h1>
        
      </div>

      <div className="grid grid-cols-3 gap-10 max-w-6xl mx-auto">

  {levels.map((level) => (
    <SpeechCard key={level} level={level} />
  ))}
</div>

    </div>
  );
}

function SpeechCard({ level }) {
  const [showDialog, setShowDialog] = useState(false);
  const [practiceText, setPracticeText] = useState("");
  const [textId, setTextId] = useState("");
  const [accuracy, setAccuracy] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [history, setHistory] = useState([]);

  const levelImage =
    level === "Beginner" ? bImg :
    level === "Intermediate" ? iImg :
    aImg;

  const duration =
    level === "Beginner" ? 5 :
    level === "Intermediate" ? 10 : 15;

  const avgAccuracy =
    history.length > 0
      ? Math.round(history.reduce((a, b) => a + b, 0) / history.length)
      : 0;

  const openDialog = () => {
    let data =
      level === "Beginner" ? beginnerLetters :
      level === "Intermediate" ? intermediateWords :
      advancedSentences;

    const selected = data[Math.floor(Math.random() * data.length)];
    setPracticeText(selected.text);
    setTextId(selected.id);
    setAccuracy(null);
    setFeedback("");
    setTimer(duration);
    setShowDialog(true);
  };

  const playExample = () => {
    const audio = new Audio(
      `http://localhost:5000/example-audio/${level.toLowerCase()}/${textId}`
    );
    audio.play();
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.start();
    setIsRecording(true);
    setTimer(duration);

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          recorder.stop();
          setIsRecording(false);
        }
        return t - 1;
      });
    }, 1000);

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", blob);
      formData.append("level", level.toLowerCase());
      formData.append("text_id", textId);

      const res = await axios.post("http://localhost:5000/analyze", formData);

      setAccuracy(res.data.accuracy);
      setFeedback(res.data.feedback);
      setHistory((prev) => [...prev, res.data.accuracy]);
    };
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[380px] flex flex-col">

        {/* Image */}
        <div className="h-56 w-full overflow-hidden cursor-pointer" onClick={openDialog}>
          <img src={levelImage} className="h-full w-full object-cover" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center text-center px-4">
          <h3 className="text-lg font-semibold text-teal-600">{level}</h3>
          <p className="text-sm text-slate-500">Tap to practice</p>
        </div>

        {/* Aggregate Accuracy Bar */}
        <div className="px-4 pb-4">
          <div className="text-xs text-slate-500 mb-1">Overall Accuracy</div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-500"
              style={{ width: `${avgAccuracy}%` }}
            />
          </div>
          <div className="text-xs text-teal-600 mt-1 font-semibold">
            {avgAccuracy}%
          </div>
        </div>
      </div>

      {/* Dialog (same as before, unchanged) */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center shadow-xl">
            <div className={`text-5xl mb-4 ${isRecording && "animate-pulse text-teal-500"}`}>
              🎤
            </div>

            <p className="text-xs uppercase text-slate-400">Practice</p>
            <h2 className="text-xl font-semibold mb-4">{practiceText}</h2>

            <button
              onClick={playExample}
              className="mb-3 px-4 py-2 rounded-lg border border-teal-400 text-teal-600 hover:bg-teal-50"
            >
              🔊 Listen to Example
            </button>

            {!isRecording && accuracy === null && (
              <button
                onClick={startRecording}
                className="block w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600"
              >
                Start Speaking
              </button>
            )}

            {isRecording && (
              <p className="mt-3 text-red-500 font-bold">Recording... {timer}s</p>
            )}

            {accuracy !== null && (
              <div className="mt-4">
                <div className="text-3xl font-bold text-teal-600">{accuracy}%</div>
                <p className="text-slate-600">{feedback}</p>
              </div>
            )}

            <button
              onClick={() => setShowDialog(false)}
              className="mt-5 text-sm text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

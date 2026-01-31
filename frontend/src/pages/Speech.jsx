import { useState, useEffect } from "react";
import axios from "axios";
import { FaMicrophoneAlt } from "react-icons/fa";

import bImg from "../assets/b.jpg";
import iImg from "../assets/i.jpg";
import aImg from "../assets/a.jpg";

/* ---------------- DATA ---------------- */

const DAILY_GOAL = 5;

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

/* ---------------- PAGE ---------------- */

export default function Speech() {
  const [dailyTests, setDailyTests] = useState(0);
  const [testAvgAccuracy, setTestAvgAccuracy] = useState(0);
 

  const loadTestProgress = () => {
    axios
      .get("http://localhost:5000/progress/advanced")
      .then(res => {
        setDailyTests(res.data.count || 0);
        setTestAvgAccuracy(res.data.avg || 0);
      })
      .catch(() => {
        setDailyTests(0);
        setTestAvgAccuracy(0);
      });
  };

  useEffect(() => {
    loadTestProgress();
  }, []);

  const progressPercent = Math.min((dailyTests / DAILY_GOAL) * 100, 100);

  return (
    <div className="min-h-screen bg-white px-6 pt-28 pb-10">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-14">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Pronunciation Practice
          </h1>
          <p className="text-gray-500 mt-1">
            Practice words and test sentence accuracy
          </p>
        </div>

        {/* DAILY GOAL */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Daily Goal</span>
          <div className="w-32 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-teal-600 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">
            {dailyTests} / {DAILY_GOAL}
          </span>
        </div>
      </div>

      {/* PRACTICE MODE */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Practice Mode
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          <PracticeCard
            level="Beginner"
            image={bImg}
            data={beginnerLetters}
            duration={5}
          />

          <PracticeCard
            level="Intermediate"
            image={iImg}
            data={intermediateWords}
            duration={8}
          />
        </div>
      </section>

      {/* TEST MODE */}
      <section className="max-w-6xl mx-auto mt-16">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Test Mode
        </h2>

        <div className="bg-white border border-gray-200 rounded-xl p-8 flex justify-between items-center">
          <div>
            <p className="font-medium text-gray-800">
              Advanced Pronunciation Test
            </p>
            <p className="text-sm text-gray-500">
              Sentence-based • Overall accuracy
            </p>

            <div className="mt-4 w-56">
              <div className="text-xs text-gray-500 mb-1">
                Overall Accuracy
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-teal-600 rounded-full"
                  style={{ width: `${testAvgAccuracy}%` }}
                />
              </div>
              <div className="text-xs text-teal-600 font-semibold mt-1">
                {testAvgAccuracy}%
              </div>
            </div>
          </div>

          <AdvancedTest
            data={advancedSentences}
            onTestComplete={loadTestProgress}
          />
        </div>
      </section>
    </div>
  );
}

/* ---------------- PRACTICE CARD ---------------- */

function PracticeCard({ level, image, data, duration }) {
  const [show, setShow] = useState(false);
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(duration);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!show) return;

    if (timer === 0) {
      const fb = ["Excellent", "Good"];
      setFeedback(fb[Math.floor(Math.random() * fb.length)]);

      setTimeout(() => {
        if (index < items.length - 1) {
          setIndex(i => i + 1);
          setTimer(duration);
          setFeedback("");
        }
      }, 700);

      return;
    }

    const t = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, show]);

  const startPractice = () => {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    setItems(shuffled.slice(0, 5));
    setIndex(0);
    setTimer(duration);
    setFeedback("");
    setShow(true);
  };

  return (
    <>
      <div
        onClick={startPractice}
        className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-teal-500"
      >
        <div className="h-56 w-full overflow-hidden rounded-t-xl">
          <img src={image} alt={level} className="w-full h-full object-cover" />
        </div>
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-teal-600">{level}</h3>
          <p className="text-sm text-gray-500">Practice Mode</p>
        </div>
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md text-center">
            <h2 className="text-xl font-semibold mb-4">
              {items[index]?.text}
            </h2>

            {feedback ? (
              <p className={`text-lg font-semibold ${
                feedback === "Excellent"
                  ? "text-teal-600"
                  : feedback === "Good"
                  ? "text-teal-500"
                  : "text-red-500"
              }`}>
                {feedback}
              </p>
            ) : (
              <p className="text-red-500 font-bold">
                Speak… {timer}s
              </p>
            )}

            <button
              onClick={() => setShow(false)}
              className="mt-6 text-sm text-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------- ADVANCED TEST ---------------- */

function AdvancedTest({ data, onTestComplete }) {
  const [show, setShow] = useState(false);
  const [sentence, setSentence] = useState("");
  const [accuracy, setAccuracy] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [timer, setTimer] = useState(15);
  const [recording, setRecording] = useState(false);
   const [textId, setTextId] = useState("");

  const open = () => {
  const pick = data[Math.floor(Math.random() * data.length)];
  setSentence(pick.text);
  setTextId(pick.id);   // ✅ STORE ID
  setAccuracy(null);
  setFeedback("");
  setTimer(15);
  setShow(true);
};

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.start();
    setRecording(true);

    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(interval);
          recorder.stop();
          setRecording(false);
        }
        return t - 1;
      });
    }, 1000);

    recorder.onstop = async () => {
  const blob = new Blob(chunks, { type: "audio/webm" });
  const formData = new FormData();

  formData.append("audio", blob);
  formData.append("level", "advanced");
  formData.append("text_id", textId);

  const res = await axios.post(
    "http://localhost:5000/analyze",
    formData
  );

  setAccuracy(res.data.accuracy);
  setFeedback(res.data.feedback);

  onTestComplete();
};
  };

  return (
    <>
      <button
        onClick={open}
        className="bg-teal-600 text-white px-6 py-2 rounded-lg"
      >
        Start Test
      </button>

      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md text-center">
            <FaMicrophoneAlt className="text-5xl mx-auto mb-3 text-teal-600" />
            <h2 className="text-xl font-semibold mb-4">{sentence}</h2>

            {!recording && accuracy === null && (
              <button
                onClick={startRecording}
                className="w-full bg-teal-600 text-white py-2 rounded-lg"
              >
                Start Speaking
              </button>
            )}

            {recording && (
              <p className="text-red-500 font-bold mt-2">
                Recording… {timer}s
              </p>
            )}

            {accuracy !== null && (
              <>
                <div className="text-3xl font-bold text-teal-600">
                  {accuracy}%
                </div>
                <p className="text-lg font-semibold text-teal-600 mt-2">
                  {feedback}
                </p>
              </>
            )}

            <button
              onClick={() => setShow(false)}
              className="mt-6 text-sm text-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

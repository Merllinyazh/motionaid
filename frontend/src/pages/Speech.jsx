import { useState } from "react";
import axios from "axios";

import bImg from "../assets/b.jpg";
import iImg from "../assets/i.jpg";
import aImg from "../assets/a.jpg";

/* ---------------- PRACTICE DATA ---------------- */

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

/* ---------------- MIC ICON (SVG) ---------------- */

function MicIcon({ active }) {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: active ? "#0ea5a4" : "#f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: active
          ? "0 0 0 6px rgba(14,165,164,0.25)"
          : "none",
        margin: "0 auto 12px",
      }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill={active ? "#fff" : "#334155"}>
        <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
        <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.93V21a1 1 0 1 0 2 0v-3.07A7 7 0 0 0 19 11z" />
      </svg>
    </div>
  );
}

/* ---------------- MAIN PAGE ---------------- */

export default function Speech() {
  return (
    <div style={styles.page}>
      <div style={styles.topHeader}>
        <div style={styles.topIcon}>🎤</div>
        <h1 style={styles.topTitle}>Speech Therapy</h1>
      </div>

      <div style={styles.grid}>
        {levels.map((level) => (
          <SpeechCard key={level} level={level} />
        ))}
      </div>
    </div>
  );
}

/* ---------------- CARD ---------------- */

function SpeechCard({ level }) {
  const [showDialog, setShowDialog] = useState(false);
  const [practiceText, setPracticeText] = useState("");
  const [textId, setTextId] = useState("");
  const [accuracy, setAccuracy] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);

  const levelImage =
    level === "Beginner" ? bImg :
    level === "Intermediate" ? iImg :
    aImg;

  const duration =
    level === "Beginner" ? 5 :
    level === "Intermediate" ? 10 : 15;

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

  /* 🔊 PLAY EXAMPLE AUDIO */
  const playExample = () => {
    const audio = new Audio(
      `/ref_audio/${level.toLowerCase()}/${textId}_ref.wav`
    );
    audio.play();
  };

  /* 🎙️ AUTO RECORD */
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
    };
  };

  return (
    <>
      <div style={styles.card} onClick={openDialog}>
        <img src={levelImage} alt={level} style={styles.cardImage} />
        <h2 style={styles.level}>{level}</h2>
        <p style={styles.cardHint}>Tap to practice</p>
      </div>

      {showDialog && (
        <div style={styles.overlay}>
          <div style={styles.dialog}>
            <MicIcon active={isRecording} />

            <p style={styles.practiceLabel}>PRACTICE</p>
            <h2 style={styles.practiceText}>{practiceText}</h2>

            <button style={styles.listenBtn} onClick={playExample}>
              🔊 Listen to Example
            </button>

            {!isRecording && accuracy === null && (
              <button style={styles.startBtn} onClick={startRecording}>
                🎙️ Start Speaking
              </button>
            )}

            {isRecording && (
              <p style={styles.timer}>Recording... {timer}s</p>
            )}

            {accuracy !== null && (
              <p style={styles.feedback}>
                Accuracy: <strong>{accuracy}%</strong> • {feedback}
              </p>
            )}

            <button style={styles.closeBtn} onClick={() => setShowDialog(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    padding: 30,
    background: "#f4f6f8",
    minHeight: "100vh",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  topHeader: { marginTop: 50, marginBottom: 70 },
  topIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    background: "#0ea5a4",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    margin: "0 auto 8px",
  },
  topTitle: { fontSize: 38, fontWeight: "bold" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 15,
  },
  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 16,
    boxShadow: "0 5px 14px rgba(0,0,0,0.12)",
    cursor: "pointer",
  },
  cardImage: {
    width: "100%",
    height: 300,
    objectFit: "cover",
    borderRadius: 12,
    marginBottom: 8,
  },
  level: { fontSize: 22, color: "#0ea5a4" },
  cardHint: { fontSize: 13, color: "#888" },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  dialog: {
    background: "#fff",
    width: 420,
    padding: 28,
    borderRadius: 18,
    textAlign: "center",
  },
  practiceLabel: { fontSize: 12, color: "#888" },
  practiceText: { fontSize: 20, margin: "10px 0 18px" },
  listenBtn: {
    background: "#eefefe",
    border: "1px solid #0ea5a4",
    color: "#0ea5a4",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    marginBottom: 12,
  },
  startBtn: {
    background: "#0ea5a4",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 15,
  },
  timer: {
    marginTop: 12,
    fontSize: 18,
    color: "#dc2626",
    fontWeight: "bold",
  },
  feedback: { marginTop: 12, fontSize: 14 },
  closeBtn: {
    marginTop: 14,
    background: "transparent",
    border: "none",
    color: "#888",
    cursor: "pointer",
  },
};

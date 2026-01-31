# =====================================================
# 🧠 IMPORTS
# =====================================================
import cv2
import mediapipe as mp
import numpy as np
import base64
import threading
import os
import sys
import subprocess

from flask import Flask, request, jsonify, send_file
from flask_socketio import SocketIO
from flask_cors import CORS
from pymongo import MongoClient

from ScriptThree import joinhands_loop, stop_joinhands_loop
from speech_model import get_pronunciation_accuracy


print("🚀 Starting MotionAid Full Backend...")


# =====================================================
# 🌐 FLASK + SOCKET.IO SETUP
# =====================================================
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")


# =====================================================
# 🗄️ MONGODB SETUP
# =====================================================
try:
    client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=3000)
    client.admin.command("ping")
    db = client["motionaid"]
    collection = db["speech_results"]
    print("✅ MongoDB connected successfully!")
except Exception as e:
    print("❌ MongoDB connection failed:", e)
    sys.exit(1)


# =====================================================
# 🎬 FFMPEG PATH
# =====================================================
FFMPEG_PATH = r"C:\Users\MERLLIN YAZHINI\Desktop\ffmpeg-8.0.1-essentials_build\bin\ffmpeg.exe"


# =====================================================
# 🧠 MEDIAPIPE MODELS
# =====================================================
mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands
mp_pose = mp.solutions.pose

hands = mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5)
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)


# =====================================================
# 🎥 CAMERA SETUP
# =====================================================
cap = cv2.VideoCapture(0)
lock = threading.Lock()


# =====================================================
# ▶️ RUN FLAGS
# =====================================================
run_openclose = False
run_rotation = False
run_joinhands = False


# =====================================================
# 📊 SHARED STATES
# =====================================================
open_close_count = 0
hand_state_prev = "Unknown"

rotation_count = 0
previous_angle = None
rotated_once = False


# =====================================================
# 🧮 HELPER FUNCTIONS
# =====================================================
def classify_hand_state(landmarks):
    global hand_state_prev, open_close_count
    finger_tips = [8, 12, 16, 20]
    curled_fingers = sum(
        1 for tip in finger_tips
        if landmarks.landmark[tip].y > landmarks.landmark[tip - 2].y
    )

    if curled_fingers == 0:
        current_state = "Fully Open"
    elif curled_fingers == 4:
        current_state = "Fully Closed"
    else:
        current_state = "Half Closed"

    if hand_state_prev == "Fully Closed" and current_state == "Fully Open":
        open_close_count += 1

    hand_state_prev = current_state
    return current_state


def calculate_wrist_angle(landmarks):
    wrist = landmarks.landmark[0]
    middle_mcp = landmarks.landmark[9]
    dx = middle_mcp.x - wrist.x
    dy = middle_mcp.y - wrist.y
    angle = np.arctan2(dy, dx) * 180 / np.pi
    return angle


def stop_all():
    global run_openclose, run_rotation, run_joinhands
    run_openclose = False
    run_rotation = False
    run_joinhands = False


# =====================================================
# ✋ SOCKET.IO → OPEN / CLOSE HAND
# =====================================================
@socketio.on("start_openclose")
def start_openclose():
    global run_openclose, open_close_count, hand_state_prev

    stop_all()
    run_openclose = True
    open_close_count = 0
    hand_state_prev = "Unknown"

    print("▶️ Open–Close Started")

    while run_openclose:
        with lock:
            success, image = cap.read()
        if not success:
            continue

        image = cv2.flip(image, 1)
        results = hands.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

        state = "No Hand"
        if results.multi_hand_landmarks:
            for hl in results.multi_hand_landmarks:
                state = classify_hand_state(hl)
                mp_drawing.draw_landmarks(image, hl, mp_hands.HAND_CONNECTIONS)

        cv2.putText(image, f"State: {state}", (30, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,0), 2)
        cv2.putText(image, f"Count: {open_close_count}", (30, 80),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 2)

        _, buffer = cv2.imencode(".jpg", image)
        socketio.emit("video_feed", {
            "frame": base64.b64encode(buffer).decode(),
            "count": open_close_count
        })


@socketio.on("stop_openclose")
def stop_openclose():
    global run_openclose
    run_openclose = False
    print("🛑 Open–Close stopped")


# =====================================================
# 🔄 SOCKET.IO → WRIST ROTATION
# =====================================================
@socketio.on("start_rotation")
def start_rotation():
    global run_rotation, rotation_count, previous_angle, rotated_once

    stop_all()
    run_rotation = True
    rotation_count = 0
    previous_angle = None
    rotated_once = False

    print("▶️ Wrist Rotation Started")

    while run_rotation:
        with lock:
            success, image = cap.read()
        if not success:
            continue

        image = cv2.flip(image, 1)
        results = hands.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

        if results.multi_hand_landmarks:
            for hl in results.multi_hand_landmarks:
                angle = calculate_wrist_angle(hl)

                if previous_angle is not None:
                    diff = angle - previous_angle
                    if diff > 180: diff -= 360
                    if diff < -180: diff += 360

                    if abs(diff) > 30 and not rotated_once:
                        rotation_count += 1
                        rotated_once = True
                    elif abs(diff) < 10:
                        rotated_once = False

                previous_angle = angle
                mp_drawing.draw_landmarks(image, hl, mp_hands.HAND_CONNECTIONS)

        _, buffer = cv2.imencode(".jpg", image)
        socketio.emit("rotation_feed", {
            "image": base64.b64encode(buffer).decode(),
            "count": rotation_count
        })


@socketio.on("stop_rotation")
def stop_rotation():
    global run_rotation
    run_rotation = False
    print("🛑 Rotation stopped")


# =====================================================
# 🙌 SOCKET.IO → JOIN HANDS
# =====================================================
@socketio.on("start_joinhands")
def start_joinhands():
    print("▶️ JoinHands START received")
    t = threading.Thread(target=joinhands_loop, args=(socketio,))
    t.start()


@socketio.on("stop_joinhands")
def stop_joinhands():
    print("🛑 JoinHands STOP received")
    stop_joinhands_loop()


# =====================================================
# 🎤 REST API → SPEECH ANALYSIS
# =====================================================
@app.route("/analyze", methods=["POST"])
def analyze():
    level = request.form["level"]
    text_id = request.form["text_id"]
    audio = request.files["audio"]

    raw_path = "temp_user.webm"
    wav_path = "temp_user.wav"

    audio.save(raw_path)

    subprocess.run([
        FFMPEG_PATH, "-y",
        "-i", raw_path,
        "-ar", "16000",
        "-ac", "1",
        wav_path
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    ref_path = f"dataset/{level}/{text_id}_ref.wav"

    if not os.path.exists(ref_path):
        return jsonify({"error": "Reference audio not found"}), 404

    accuracy, feedback = get_pronunciation_accuracy(wav_path, ref_path)

    collection.insert_one({
        "level": "advanced",
        "text_id": text_id,
        "accuracy": accuracy,
        "feedback": feedback
    })

    return jsonify({
        "accuracy": accuracy,
        "feedback": feedback
    })


# =====================================================
# 🔊 REST API → EXAMPLE AUDIO
# =====================================================
@app.route("/example-audio/<level>/<text_id>")
def example_audio(level, text_id):
    path = f"dataset/{level}/{text_id}_ref.wav"
    if not os.path.exists(path):
        return jsonify({"error": "Audio not found"}), 404
    return send_file(path, mimetype="audio/wav")


# =====================================================
# 📈 REST API → PROGRESS
# =====================================================
@app.route("/progress/<level>")
def progress(level):
    records = list(collection.find({
        "level": level,
        "accuracy": {"$ne": None}
    }))

    if not records:
        return jsonify({"avg": 0, "count": 0})

    accuracies = [r["accuracy"] for r in records]
    avg = round(sum(accuracies) / len(accuracies), 1)

    return jsonify({
        "avg": avg,
        "count": len(accuracies)
    })


# =====================================================
# 🚀 RUN FULL SERVER
# =====================================================
if __name__ == "__main__":
    print("🌐 MotionAid Full Backend running at http://localhost:5000")
    socketio.run(app, host="0.0.0.0", port=5000, allow_unsafe_werkzeug=True)

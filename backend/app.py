import os
import sys
import subprocess
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pymongo import MongoClient
from speech_model import get_pronunciation_accuracy

print("🚀 Starting MotionAid Speech Therapy Backend...")

app = Flask(__name__)
CORS(app)

# ---------- MongoDB ----------
client = MongoClient("mongodb://localhost:27017/")
db = client["motionaid"]
collection = db["speech_results"]

# ---------- FFMPEG ----------
FFMPEG_PATH = r"C:\Users\MERLLIN YAZHINI\Desktop\ffmpeg-8.0.1-essentials_build\bin\ffmpeg.exe"

@app.route("/analyze", methods=["POST"])
def analyze():
    level = request.form["level"]
    text_id = request.form["text_id"]
    audio = request.files["audio"]

    raw_path = "temp_user.webm"
    wav_path = "temp_user.wav"

    audio.save(raw_path)

    subprocess.run([
        FFMPEG_PATH, "-y", "-i", raw_path,
        "-ar", "16000", "-ac", "1", wav_path
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    ref_path = f"dataset/{level}/{text_id}_ref.wav"

    if not os.path.exists(ref_path):
        return jsonify({"error": "Reference audio not found"}), 404

    accuracy, feedback = get_pronunciation_accuracy(wav_path, ref_path)

    collection.insert_one({
        "level": level,
        "text_id": text_id,
        "accuracy": accuracy,
        "feedback": feedback
    })

    return jsonify({
        "accuracy": accuracy,
        "feedback": feedback
    })

@app.route("/example-audio/<level>/<text_id>")
def example_audio(level, text_id):
    path = f"dataset/{level}/{text_id}_ref.wav"
    return send_file(path, mimetype="audio/wav")

if __name__ == "__main__":
    print("🌐 Backend running at http://localhost:5000")
    app.run(debug=True, port=5000)

import librosa
import numpy as np
import whisper
from scipy.spatial.distance import euclidean
from fastdtw import fastdtw
from scipy.signal import correlate

# ---------------- CONFIG ----------------
SR = 16000

print("🔊 Loading Whisper Tiny (CPU)...")
whisper_model = whisper.load_model("tiny", device="cpu")
print("✅ Whisper loaded")

# ---------------- AUDIO UTILS ----------------
def normalize(y):
    y = y - np.mean(y)
    return y / (np.max(np.abs(y)) + 1e-6)

def has_speech(y):
    energy = librosa.feature.rms(y=y)[0]
    return np.percentile(energy, 75) > 0.002

# ---------------- MFCC + DTW ----------------
def mfcc_similarity(a, b):
    mfcc1 = librosa.feature.mfcc(y=a, sr=SR, n_mfcc=13)
    mfcc2 = librosa.feature.mfcc(y=b, sr=SR, n_mfcc=13)

    mfcc1 = (mfcc1 - np.mean(mfcc1)) / (np.std(mfcc1) + 1e-6)
    mfcc2 = (mfcc2 - np.mean(mfcc2)) / (np.std(mfcc2) + 1e-6)

    dist, _ = fastdtw(mfcc1.T, mfcc2.T, dist=euclidean)
    norm_dist = dist / max(mfcc1.shape[1], mfcc2.shape[1])

    return np.exp(-norm_dist)

# ---------------- PITCH ----------------
def pitch_similarity(a, b):
    f1 = librosa.yin(a, fmin=80, fmax=350, sr=SR)
    f2 = librosa.yin(b, fmin=80, fmax=350, sr=SR)

    f1 = f1[np.isfinite(f1)]
    f2 = f2[np.isfinite(f2)]

    if len(f1) < 20 or len(f2) < 20:
        return 0.7

    m = min(len(f1), len(f2))
    corr = np.corrcoef(f1[:m], f2[:m])[0, 1]
    return 0.7 if np.isnan(corr) else np.clip(corr, 0, 1)

# ---------------- ENVELOPE ----------------
def envelope_similarity(a, b):
    a = a / (np.linalg.norm(a) + 1e-6)
    b = b / (np.linalg.norm(b) + 1e-6)
    corr = correlate(a, b, mode="full")
    return np.max(corr)

# ---------------- FEEDBACK ----------------
def feedback_from_score(score):
    if score >= 0.85:
        return "Excellent"
    elif score >= 0.65:
        return "Good"
    else:
        return "Needs Practice"

# ---------------- ADVANCED ONLY ----------------
def get_pronunciation_accuracy(user_audio, ref_audio):
    y_user, _ = librosa.load(user_audio, sr=SR)
    y_ref, _ = librosa.load(ref_audio, sr=SR)

    y_user = normalize(y_user)
    y_ref = normalize(y_ref)

    # 🚨 HARD NO-SPEECH CHECK
    if not has_speech(y_user):
        print("\n==============================")
        print("📚 LEVEL     : advanced")
        print("🎧 USER SPOKE: (no speech)")
        print("🎯 ACCURACY : 0")
        print("💬 FEEDBACK : No speech detected")
        print("==============================")
        return 0, "No speech detected"

    # ---------------- ACOUSTIC SIMILARITY ----------------
    mfcc = mfcc_similarity(y_user, y_ref)
    pitch = pitch_similarity(y_user, y_ref)
    env = envelope_similarity(y_user, y_ref)

    acoustic_sim = 0.6 * mfcc + 0.25 * pitch + 0.15 * env

    # ---------------- WHISPER ----------------
    ref_text = whisper_model.transcribe(
        ref_audio, language="en", temperature=0.0
    )["text"].strip().lower()

    user_text = whisper_model.transcribe(
        user_audio, language="en", temperature=0.0
    )["text"].strip().lower()

    # 🚨 WHISPER EMPTY CHECK
    if not user_text:
        print("\n==============================")
        print("📚 LEVEL     : advanced")
        print("🎯 TARGET    :", ref_text)
        print("🎧 USER SPOKE: (empty)")
        print("🎯 ACCURACY : 0")
        print("💬 FEEDBACK : No speech detected")
        print("==============================")
        return 0, "No speech detected"

    # ---------------- TEXT OVERLAP ----------------
    ref_set = set(ref_text.split())
    user_set = set(user_text.split())
    overlap = len(ref_set & user_set) / max(len(ref_set), 1)

    final_score = 0.6 * overlap + 0.4 * acoustic_sim
    accuracy = int(np.clip(final_score * 100, 5, 100))
    feedback = feedback_from_score(accuracy / 100)

    print("\n==============================")
    print("📚 LEVEL     : advanced")
    print("🎯 TARGET    :", ref_text)
    print("🎧 USER SPOKE:", user_text)
    print("🎯 ACCURACY :", accuracy)
    print("💬 FEEDBACK :", feedback)
    print("==============================")

    return accuracy, feedback

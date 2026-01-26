"""import librosa
import numpy as np

# ---------------- CONFIG ----------------
SR = 16000
ENERGY_THRESHOLD = 0.01
MIN_SPEECH_SECONDS = 0.3
FMIN = 80
FMAX = 350

# ---------------- LOAD + VOICE ACTIVITY ----------------
def load_voiced_audio(path):
    y, sr = librosa.load(path, sr=SR)

    rms = librosa.feature.rms(y=y)[0]
    frame_duration = len(y) / sr / len(rms)

    voiced = rms > ENERGY_THRESHOLD
    speech_time = np.sum(voiced) * frame_duration

    print(f"{path} | speech time: {speech_time:.2f}s")

    if speech_time < MIN_SPEECH_SECONDS:
        return None, sr

    mask = np.repeat(voiced, int(len(y) / len(voiced)))
    y = y[:len(mask)][mask]

    return y, sr

# ---------------- FREQUENCY FEATURES ----------------
def extract_frequency_features(y, sr):
    # Fundamental frequency (pitch)
    f0 = librosa.yin(y, fmin=FMIN, fmax=FMAX, sr=sr)
    f0 = f0[np.isfinite(f0)]

    if len(f0) < 10:
        return None

    mean_f0 = np.mean(f0)
    std_f0 = np.std(f0)

    # Spectral centroid (log-scaled)
    centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
    mean_centroid = np.log1p(np.mean(centroid))

    return np.array([mean_f0, std_f0, mean_centroid])

# ---------------- SMOOTH FREQUENCY SCORE ----------------
def frequency_score(user, ref):
    mean_f0_u, std_f0_u, cent_u = user
    mean_f0_r, std_f0_r, cent_r = ref

    # --- Normalized differences ---
    pitch_diff = abs(mean_f0_u - mean_f0_r) / max(mean_f0_r, 80)
    stability_diff = abs(std_f0_u - std_f0_r) / max(std_f0_r, 20)
    centroid_diff = abs(cent_u - cent_r) / max(cent_r, 1)

    # --- Soft saturation ---
    pitch_score = np.exp(-pitch_diff)
    stability_score = np.exp(-stability_diff)
    centroid_score = np.exp(-centroid_diff)

    # --- Weighted final score ---
    score = (
        0.5 * pitch_score +
        0.2 * stability_score +
        0.3 * centroid_score
    )

    return max(0, min(score, 1))

# ---------------- FINAL ACCURACY ----------------
def get_accuracy(user_audio, ref_audio):
    y_user, sr = load_voiced_audio(user_audio)
    y_ref, _ = load_voiced_audio(ref_audio)

    if y_user is None or y_ref is None:
        return 0, "No clear speech detected"

    user_freq = extract_frequency_features(y_user, sr)
    ref_freq = extract_frequency_features(y_ref, sr)

    if user_freq is None or ref_freq is None:
        return 0, "Unstable speech frequency"

    score = frequency_score(user_freq, ref_freq)
    accuracy = int(score * 100)

    if accuracy >= 85:
        feedback = "Excellent"
    elif accuracy >= 65:
        feedback = "Good"
    else:
        feedback = "Needs Practice"

    return accuracy, feedback
    
    """
    
import whisper
import librosa 
import numpy as np
from scipy.spatial.distance import cosine
import torch
# ---------------- LOAD WHISPER ----------------
print("🔊 Loading Whisper model...")
model = whisper.load_model("small")  # small = accurate + fast
print("✅ Whisper model loaded")

# ---------------- AUDIO EMBEDDINGS ----------------
def extract_whisper_embedding(audio_path):
    audio = whisper.load_audio(audio_path)
    audio = whisper.pad_or_trim(audio)

    mel = whisper.log_mel_spectrogram(audio).to(model.device)

    # Add batch dimension → shape becomes (1, 80, T)
    mel = mel.unsqueeze(0)

    with torch.no_grad():
        encoded = model.encoder(mel)

    # encoded shape: (1, T, D)
    embedding = encoded.mean(dim=1).squeeze(0).cpu().numpy()

    return embedding

# ---------------- PITCH SIMILARITY ----------------
def pitch_similarity(user_audio, ref_audio, sr=16000):
    y1, _ = librosa.load(user_audio, sr=sr)
    y2, _ = librosa.load(ref_audio, sr=sr)

    f0_1 = librosa.yin(y1, fmin=80, fmax=350)
    f0_2 = librosa.yin(y2, fmin=80, fmax=350)

    f0_1 = f0_1[np.isfinite(f0_1)]
    f0_2 = f0_2[np.isfinite(f0_2)]

    if len(f0_1) < 10 or len(f0_2) < 10:
        return 0.3

    min_len = min(len(f0_1), len(f0_2))
    f0_1, f0_2 = f0_1[:min_len], f0_2[:min_len]

    corr = np.corrcoef(f0_1, f0_2)[0, 1]
    return max(0, corr)

# ---------------- FLUENCY SCORE ----------------
def fluency_score(audio_path, sr=16000):
    y, _ = librosa.load(audio_path, sr=sr)
    energy = librosa.feature.rms(y=y)[0]
    silence_ratio = np.sum(energy < 0.01) / len(energy)

    return max(0, 1 - silence_ratio)

# ---------------- FINAL THERAPY ACCURACY ----------------
def get_pronunciation_accuracy(user_audio, ref_audio):
    # Whisper similarity
    emb_user = extract_whisper_embedding(user_audio)
    emb_ref = extract_whisper_embedding(ref_audio)
    similarity = 1 - cosine(emb_user, emb_ref)

    # Pitch & fluency
    pitch = pitch_similarity(user_audio, ref_audio)
    fluency = fluency_score(user_audio)

    # Fusion (research-grade scoring)
    final_score = (
        0.5 * similarity +
        0.3 * pitch +
        0.2 * fluency
    )

    accuracy = int(final_score * 100)

    if accuracy >= 85:
        feedback = "Excellent"
    elif accuracy >= 65:
        feedback = "Good"
    else:
        feedback = "Needs Practice"

    return accuracy, feedback

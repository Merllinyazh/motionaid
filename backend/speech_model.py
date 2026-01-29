import whisper
import librosa
import torch
import numpy as np
from scipy.spatial.distance import cosine, euclidean
from fastdtw import fastdtw

# ---------------- LOAD WHISPER ----------------
print("🔊 Loading Whisper Tiny model...")
whisper_model = whisper.load_model("tiny")
print("✅ Whisper model loaded")

SR = 16000
ENERGY_THRESHOLD = 0.005

# ---------------- VAD ----------------
def load_audio_vad(path):
    y, sr = librosa.load(path, sr=SR)

    energy = librosa.feature.rms(y=y)[0]
    speech_ratio = np.sum(energy > ENERGY_THRESHOLD) / len(energy)

    print("Speech ratio:", speech_ratio)

    if speech_ratio < 0.05:  # only reject if almost silence
        return None, sr

    return y, sr

# ---------------- WHISPER EMBEDDING ----------------
def whisper_embedding(audio_path):
    audio = whisper.load_audio(audio_path)
    audio = whisper.pad_or_trim(audio)
    mel = whisper.log_mel_spectrogram(audio).to(whisper_model.device)
    mel = mel.unsqueeze(0)

    with torch.no_grad():
        encoded = whisper_model.encoder(mel)

    return encoded.mean(dim=1).squeeze(0).detach().cpu().numpy()

# ---------------- MFCC + DTW ----------------
def mfcc_dtw_similarity(y1, y2, sr):
    mfcc1 = librosa.feature.mfcc(y=y1, sr=sr, n_mfcc=13).T
    mfcc2 = librosa.feature.mfcc(y=y2, sr=sr, n_mfcc=13).T

    distance, _ = fastdtw(mfcc1, mfcc2, dist=euclidean)
    norm = distance / (len(mfcc1) + len(mfcc2))
    return np.exp(-norm)

# ---------------- PITCH ----------------
def pitch_similarity(y1, y2, sr):
    f1 = librosa.yin(y1, fmin=80, fmax=350, sr=sr)
    f2 = librosa.yin(y2, fmin=80, fmax=350, sr=sr)

    f1, f2 = f1[np.isfinite(f1)], f2[np.isfinite(f2)]
    if len(f1) < 10 or len(f2) < 10:
        return 0.3

    min_len = min(len(f1), len(f2))
    corr = np.corrcoef(f1[:min_len], f2[:min_len])[0, 1]
    return max(0, corr)

# ---------------- FLUENCY ----------------
def fluency_score(y):
    energy = librosa.feature.rms(y=y)[0]
    silence_ratio = np.sum(energy < ENERGY_THRESHOLD) / len(energy)
    return max(0, 1 - silence_ratio)

# ---------------- FINAL HYBRID ACCURACY ----------------
def get_pronunciation_accuracy(user_audio, ref_audio):
    y_user, sr = load_audio_vad(user_audio)
    y_ref, _ = load_audio_vad(ref_audio)

    if y_user is None:
        return 0, "No speech detected"

    # Whisper semantic similarity
    emb_user = whisper_embedding(user_audio)
    emb_ref = whisper_embedding(ref_audio)
    whisper_sim = 1 - cosine(emb_user, emb_ref)

    # MFCC articulation similarity
    mfcc_sim = mfcc_dtw_similarity(y_user, y_ref, sr)

    # Pitch & Fluency
    pitch_sim = pitch_similarity(y_user, y_ref, sr)
    fluency = fluency_score(y_user)

    # Weighted fusion (therapy-grade)
    final_score = (
        0.4 * whisper_sim +
        0.4 * mfcc_sim +
        0.1 * pitch_sim +
        0.1 * fluency
    )

    accuracy = int(final_score * 100)

    if accuracy >= 85:
        feedback = "Excellent"
    elif accuracy >= 65:
        feedback = "Good"
    else:
        feedback = "Needs Practice"

    return accuracy, feedback

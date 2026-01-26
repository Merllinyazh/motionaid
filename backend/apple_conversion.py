import librosa
import soundfile as sf

audio, sr = librosa.load("apple_user.wav", sr=16000)
sf.write("apple_user_16k.wav", audio, 16000)

print("✅ User audio converted to 16kHz")

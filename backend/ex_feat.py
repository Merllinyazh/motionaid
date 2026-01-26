import librosa
import numpy as np

def extract_mfcc(path):
    y, sr = librosa.load(path, sr=16000)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    return np.mean(mfcc.T, axis=0)

# Test
ref = extract_mfcc("dataset/intermediate/apple_ref.wav")
user = extract_mfcc("apple_user_16k.wav")

print("Ref MFCC shape:", ref.shape)
print("User MFCC shape:", user.shape)

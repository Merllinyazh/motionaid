from scipy.spatial.distance import cosine
from ex_feat import extract_mfcc

ref_feat = extract_mfcc("dataset/intermediate/apple_ref.wav")
user_feat = extract_mfcc("apple_user_16k.wav")

similarity = 1 - cosine(ref_feat, user_feat)
accuracy = round(similarity * 100, 2)

print("Accuracy:", accuracy)

if accuracy >= 90:
    print("Feedback: Excellent")
elif accuracy >= 75:
    print("Feedback: Good")
else:
    print("Feedback: Accurate")

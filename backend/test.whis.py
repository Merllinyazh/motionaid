from speech_model import get_pronunciation_accuracy

acc, fb = get_pronunciation_accuracy(
    "apple_user_16k.wav",
    "dataset/intermediate/apple_ref.wav"
)

print("Accuracy:", acc)
print("Feedback:", fb)

import os
from gtts import gTTS
import librosa
import soundfile as sf
from text_data import BEGINNER, INTERMEDIATE, ADVANCED

BASE_DIR = "dataset"
SAMPLE_RATE = 16000
SLOW_RATE = 0.8 

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def generate_reference(text, output_path):
    temp_mp3 = output_path.replace(".wav", ".mp3")

    # Generate AI voice
    tts = gTTS(text=text, lang="en")
    tts.save(temp_mp3)

    # Convert to 16kHz WAV
    audio, sr = librosa.load(temp_mp3, sr=16000)
    sf.write(output_path, audio, 16000)

    os.remove(temp_mp3)
    
    

def process_level(level_name, texts):
    level_path = os.path.join(BASE_DIR, level_name)
    ensure_dir(level_path)

    for idx, text in enumerate(texts, start=1):
        if level_name == "advanced":
            filename = f"sentence_{idx:02d}_ref.wav"
        else:
            filename = f"{text.lower()}_ref.wav"

        output_file = os.path.join(level_path, filename)
        print(f"Generating: {output_file}")
        generate_reference(text, output_file)

if __name__ == "__main__":
    ensure_dir(BASE_DIR)

    process_level("beginner", BEGINNER)
    process_level("intermediate", INTERMEDIATE)
    process_level("advanced", ADVANCED)
    
    

    print("\n All AI reference audio generated successfully (16 kHz WAV)")

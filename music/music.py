import aubio
import numpy as np
import matplotlib.pyplot as plt

def extract_audio_features_aubio(file_path):
    # Load audio file
    samplerate = 0
    hop_size = 256
    s = aubio.source(file_path, samplerate, hop_size)
    
    # Create pitch object
    pitch_o = aubio.pitch("yin", samplerate, hop_size, s.hop_size)
    
    # Container for features
    pitches = []
    confidences = []
    
    # Extract features
    total_frames = 0
    while True:
        samples, read = s()
        pitch = pitch_o(samples)[0]
        confidence = pitch_o.get_confidence()
        pitches.append(pitch)
        confidences.append(confidence)
        total_frames += read
        if read < s.hop_size:
            break
    
    # Convert features to numpy arrays
    pitches = np.array(pitches)
    confidences = np.array(confidences)
    
    return {
        'pitches': pitches,
        'confidences': confidences
    }

# Example usage
file_path = 'Derp-Song (2).wav'
audio_features_aubio = extract_audio_features_aubio(file_path)

# Visualize Pitch
plt.figure(figsize=(10, 4))
plt.plot(audio_features_aubio['pitches'])
plt.title('Pitch')
plt.xlabel('Frame')
plt.ylabel('Frequency (Hz)')
plt.tight_layout()
plt.show()

# Visualize Confidence
plt.figure(figsize=(10, 4))
plt.plot(audio_features_aubio['confidences'])
plt.title('Confidence')
plt.xlabel('Frame')
plt.ylabel('Confidence')
plt.tight_layout()
plt.show()

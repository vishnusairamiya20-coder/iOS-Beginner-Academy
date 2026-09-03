// Web Audio API Synthesizer for iOS Sounds
// 100% self-contained, client-side, zero latency, works without external audio assets

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

// DTMF Keypad Tones (Dual-Tone Multi-Frequency)
const DTMF_FREQS: Record<string, [number, number]> = {
  '1': [697, 1209],
  '2': [697, 1336],
  '3': [697, 1477],
  '4': [770, 1209],
  '5': [770, 1336],
  '6': [770, 1477],
  '7': [852, 1209],
  '8': [852, 1336],
  '9': [852, 1477],
  '*': [941, 1209],
  '0': [941, 1336],
  '#': [941, 1477],
};

export function playDtmfTone(key: string, duration = 0.15) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const freqs = DTMF_FREQS[key] || [800, 1200];
  const now = ctx.currentTime;

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sine';
  osc2.type = 'sine';
  osc1.frequency.setValueAtTime(freqs[0], now);
  osc2.frequency.setValueAtTime(freqs[1], now);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration);
  osc2.stop(now + duration);
}

// Camera Shutter Snap Sound
export function playCameraShutterSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // Click 1 (Curtain opening)
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1400, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.04);

  // Click 2 (Curtain closing)
  setTimeout(() => {
    try {
      const lateCtx = getAudioContext();
      if (!lateCtx) return;
      const t = lateCtx.currentTime;
      const osc2 = lateCtx.createOscillator();
      const gain2 = lateCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1800, t);
      osc2.frequency.exponentialRampToValueAtTime(200, t + 0.06);
      gain2.gain.setValueAtTime(0.28, t);
      gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.06);
      osc2.connect(gain2);
      gain2.connect(lateCtx.destination);
      osc2.start(t);
      osc2.stop(t + 0.06);
    } catch {
      // ignore
    }
  }, 50);
}

// Lock / Unlock Screen Sound
export function playLockSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(450, now);
  osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.05);
}

export function playUnlockSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(640, now + 0.06);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.06);
}

// Message Sent / Swoosh
export function playMessageSentSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(500, now);
  osc.frequency.exponentialRampToValueAtTime(950, now + 0.12);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.12);
}

// Message Received / Ding (Tri-tone note simulation)
export function playMessageReceivedSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const notes = [659.25, 783.99, 1046.5]; // E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + idx * 0.09;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.18, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.18);
  });
}

// Volume step beep / Haptic feedback sound
export function playVolumeStepSound(volumeLevel = 50) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Pitch scales slightly with volume (600Hz at 0% up to 1200Hz at 100%)
  const freq = 600 + (volumeLevel / 100) * 600;
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  // Volume scale
  const gainAmount = Math.max(0.01, (volumeLevel / 100) * 0.08);
  gain.gain.setValueAtTime(gainAmount, now);
  gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.035);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.035);
}

// Phone Ringing Tone
let ringInterval: ReturnType<typeof setInterval> | null = null;
export function startPhoneRingTone() {
  stopPhoneRingTone();
  const playRingBurst = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.frequency.setValueAtTime(440, now);
    osc2.frequency.setValueAtTime(480, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.setValueAtTime(0.15, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.3);
    osc2.stop(now + 1.3);
  };

  playRingBurst();
  ringInterval = setInterval(playRingBurst, 3500);
}

export function stopPhoneRingTone() {
  if (ringInterval) {
    clearInterval(ringInterval);
    ringInterval = null;
  }
}

// ----------------------------------------------------
// Real Musical Synthesis Engine for Apple Music Player
// ----------------------------------------------------
let musicInterval: ReturnType<typeof setInterval> | null = null;
let currentTrackGenre = 'pop';
let noteStep = 0;

// Musical scale frequencies (Hz)
const NOTE_FREQS: Record<string, number> = {
  'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50
};

// Polyphonic track patterns
const TRACK_PATTERNS: Record<string, { chords: string[][]; bass: string[]; tempoMs: number }> = {
  pop: {
    tempoMs: 250,
    bass: ['C3', 'C3', 'G3', 'G3', 'A3', 'A3', 'F3', 'F3'],
    chords: [
      ['C4', 'E4', 'G4', 'C5'],
      ['E4', 'G4', 'C5'],
      ['G3', 'B3', 'D4', 'G4'],
      ['B3', 'D4', 'G4'],
      ['A3', 'C4', 'E4', 'A4'],
      ['C4', 'E4', 'A4'],
      ['F3', 'A3', 'C4', 'F4'],
      ['A3', 'C4', 'E4']
    ]
  },
  lofi: {
    tempoMs: 380,
    bass: ['D3', 'D3', 'G3', 'G3', 'C3', 'C3', 'A3', 'A3'],
    chords: [
      ['D4', 'F4', 'A4', 'C5'],
      ['F4', 'A4', 'C5', 'E5'],
      ['G3', 'B3', 'D4', 'F4'],
      ['B3', 'D4', 'F4', 'A4'],
      ['C4', 'E4', 'G4', 'B4'],
      ['E4', 'G4', 'B4', 'D5'],
      ['A3', 'C4', 'E4', 'G4'],
      ['C4', 'E4', 'G4']
    ]
  },
  synthwave: {
    tempoMs: 200,
    bass: ['A3', 'A3', 'F3', 'F3', 'C3', 'C3', 'G3', 'G3'],
    chords: [
      ['A4', 'C5', 'E5'],
      ['C5', 'E5', 'A5'],
      ['F4', 'A4', 'C5'],
      ['A4', 'C5', 'F5'],
      ['C4', 'E4', 'G4'],
      ['E4', 'G4', 'C5'],
      ['G4', 'B4', 'D5'],
      ['B4', 'D5', 'G5']
    ]
  },
  acoustic: {
    tempoMs: 300,
    bass: ['G3', 'G3', 'E3', 'E3', 'C3', 'C3', 'D3', 'D3'],
    chords: [
      ['G4', 'B4', 'D5'],
      ['B4', 'D5', 'G5'],
      ['E4', 'G4', 'B4'],
      ['G4', 'B4', 'E5'],
      ['C4', 'E4', 'G4'],
      ['E4', 'G4', 'C5'],
      ['D4', 'F4', 'A4'],
      ['F4', 'A4', 'D5']
    ]
  },
  classical: {
    tempoMs: 350,
    bass: ['C3', 'E3', 'G3', 'C4', 'A3', 'C4', 'E4', 'A4'],
    chords: [
      ['E4', 'G4', 'C5', 'E5'],
      ['G4', 'C5', 'E5'],
      ['G3', 'D4', 'G4', 'B4'],
      ['D4', 'G4', 'B4'],
      ['C4', 'E4', 'A4', 'C5'],
      ['E4', 'A4', 'C5'],
      ['F3', 'C4', 'F4', 'A4'],
      ['C4', 'F4', 'A4']
    ]
  }
};

export function startMusicSynthesis(genre: string = 'pop') {
  stopMusicSynthesis();
  currentTrackGenre = TRACK_PATTERNS[genre] ? genre : 'pop';
  const pattern = TRACK_PATTERNS[currentTrackGenre];
  noteStep = 0;

  const playStep = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const stepIdx = noteStep % pattern.chords.length;

    // Bass note (Warm low sine)
    const bassNote = pattern.bass[stepIdx % pattern.bass.length];
    const bassFreq = NOTE_FREQS[bassNote] || 130.81;
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'triangle';
    bassOsc.frequency.setValueAtTime(bassFreq, now);
    bassGain.gain.setValueAtTime(0.09, now);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + (pattern.tempoMs / 1000) * 0.9);
    bassOsc.connect(bassGain);
    bassGain.connect(ctx.destination);
    bassOsc.start(now);
    bassOsc.stop(now + (pattern.tempoMs / 1000) * 0.9);

    // Chords / Melody (Warm smooth sine/soft square)
    const chord = pattern.chords[stepIdx];
    chord.forEach((note, nIdx) => {
      const freq = NOTE_FREQS[note] || 440;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = currentTrackGenre === 'synthwave' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, now + nIdx * 0.015);
      
      const volume = currentTrackGenre === 'synthwave' ? 0.03 : 0.05;
      gain.gain.setValueAtTime(volume, now + nIdx * 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + (pattern.tempoMs / 1000) * 0.85);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + nIdx * 0.015);
      osc.stop(now + (pattern.tempoMs / 1000) * 0.85);
    });

    // Gentle hi-hat / rhythm tap on every other beat
    if (stepIdx % 2 === 1) {
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'highpass' as any;
      clickOsc.frequency.setValueAtTime(3500, now);
      clickGain.gain.setValueAtTime(0.015, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.04);
    }

    noteStep++;
  };

  playStep();
  musicInterval = setInterval(playStep, pattern.tempoMs);
}

export function stopMusicSynthesis() {
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
}

// Face ID Authentication Sounds
export function playFaceIdSuccessSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Crisp dual-tone chime (E6 then B6)
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  const gain2 = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(1318.51, now); // E6
  gain1.gain.setValueAtTime(0.12, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.12);

  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(1975.53, now + 0.08); // B6
  gain2.gain.setValueAtTime(0.15, now + 0.08);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.08);
  osc2.stop(now + 0.22);
}

export function playFaceIdFailureSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Gentle double low-buzz haptic sound
  [0, 0.08].forEach((offset) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now + offset);
    gain.gain.setValueAtTime(0.1, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + offset);
    osc.stop(now + offset + 0.05);
  });
}

export function playBiometricTickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  gain.gain.setValueAtTime(0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.02);
}

// Siri Activation Dual-Tone Chime
export function playSiriChimeSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // First Tone (490Hz)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(490, now);
  gain1.gain.setValueAtTime(0.12, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.12);

  // Second Tone (640Hz)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(640, now + 0.09);
  gain2.gain.setValueAtTime(0.14, now + 0.09);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.09);
  osc2.stop(now + 0.28);
}

// Siri Dismiss Chime
export function playSiriDismissSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(540, now);
  osc.frequency.exponentialRampToValueAtTime(380, now + 0.15);
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.18);
}

// iOS Power Down Sound (Soft descending harmonic sequence)
export function playPowerDownSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const freqs = [520, 390, 260, 180];
  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + idx * 0.08;
    const dur = 0.22;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.85, start + dur);

    gain.gain.setValueAtTime(0.12, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur);
  });
}

// iOS / Apple Boot Chime (Rich warm major chord with smooth harmonic decay)
export function playBootChimeSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // F# major chord / Apple chime frequencies: F#3 (185Hz), C#4 (277Hz), F#4 (370Hz), A#4 (466Hz), C#5 (554Hz)
  const chord = [
    { freq: 185.0, gain: 0.18, decay: 1.8 },
    { freq: 277.18, gain: 0.15, decay: 1.6 },
    { freq: 369.99, gain: 0.14, decay: 1.5 },
    { freq: 466.16, gain: 0.12, decay: 1.4 },
    { freq: 554.37, gain: 0.10, decay: 1.3 },
  ];

  chord.forEach(({ freq, gain: targetGain, decay }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(targetGain, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + decay);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + decay);
  });
}

// iOS Slider Drag Haptic Tick
export function playPowerSliderHaptic() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1400, now);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.015);

  gain.gain.setValueAtTime(0.05, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.015);
}

// iOS 18 Camera Control Mechanical Click
export function playCameraControlClick() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(120, now + 0.025);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.025);
}

// iOS 18 Camera Control Light Press / Haptic Touch
export function playCameraControlLightPress() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.035);
}

// iOS 18 Camera Control Scrub / Dial Tick (delicate high frequency haptic)
export function playCameraControlScrubTick() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1900, now);
  osc.frequency.exponentialRampToValueAtTime(1100, now + 0.008);

  gain.gain.setValueAtTime(0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.008);
}





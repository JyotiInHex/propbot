// ============================================================
// PROPBOT — TTS Engine
// Uses Web Speech API (best available English voice)
// with ElevenLabs as optional premium upgrade
// ============================================================

let ttsAudio = null;
let ttsUtterance = null;
let ttsPlaying = false;

// Pre-load available voices
function preloadVoices() {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    window.speechSynthesis.getVoices();
  });
}

// Get the best available English voice
// Priority: en-IN > en-GB > en-US (Google > Microsoft > native)
function getBestVoice() {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const ranked = [
    v => v.lang === 'en-IN' && v.name.includes('Google'),
    v => v.lang === 'en-IN',
    v => v.name.toLowerCase().includes('india'),
    v => v.lang === 'en-GB' && v.name.includes('Google'),
    v => v.lang === 'en-GB',
    v => v.lang.startsWith('en') && v.name.includes('Google'),
    v => v.lang.startsWith('en') && !v.name.includes('eSpeak'),
    v => v.lang.startsWith('en'),
  ];

  for (const match of ranked) {
    const found = voices.find(match);
    if (found) return found;
  }

  return voices[0];
}

// Clean markdown for speech
function cleanForSpeech(md, maxChars = 600) {
  return md
    .replace(/[*#_`>~]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/₹/g, 'rupees ')
    .replace(/Cr\b/g, 'crore')
    .replace(/L\b/g, 'lakh')
    .trim()
    .slice(0, maxChars);
}

// Stop any playing audio
function stopTTS() {
  if (ttsAudio && !ttsAudio.paused) {
    ttsAudio.pause();
    ttsAudio = null;
  }
  if (window.speechSynthesis?.speaking) {
    window.speechSynthesis.cancel();
  }
  ttsPlaying = false;
}

// ── ElevenLabs TTS ──────────────────────────────────────────
async function elevenLabsTTS(text, btn) {
  // Rachel voice (public, always available)
  const voiceId = '21m00Tcm4TlvDq8ikWAM';
  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVEN_KEY.trim(),
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_flash_v2_5',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.2,
          use_speaker_boost: true,
        },
      }),
    });

    if (!res.ok) {
      console.warn('ElevenLabs failed:', res.status, '→ fallback to browser TTS');
      return false;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    ttsAudio = new Audio(url);

    ttsAudio.onended = () => {
      resetTTSBtn(btn);
      ttsPlaying = false;
      URL.revokeObjectURL(url);
    };
    ttsAudio.onerror = () => {
      resetTTSBtn(btn);
      ttsPlaying = false;
    };

    await ttsAudio.play();
    return true;
  } catch (err) {
    console.warn('ElevenLabs error:', err);
    return false;
  }
}

// ── Web Speech API TTS ───────────────────────────────────────
function browserTTS(text, btn) {
  if (!window.speechSynthesis) {
    resetTTSBtn(btn);
    return;
  }

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-IN';
  utter.rate = 0.88;
  utter.pitch = 1.05;
  utter.volume = 1.0;

  const voice = getBestVoice();
  if (voice) utter.voice = voice;

  ttsUtterance = utter;
  utter.onend = () => {
    resetTTSBtn(btn);
    ttsPlaying = false;
    ttsUtterance = null;
  };
  utter.onerror = () => {
    resetTTSBtn(btn);
    ttsPlaying = false;
    ttsUtterance = null;
  };

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

// ── Main speak function ──────────────────────────────────────
async function speakText(md, btn) {
  // Toggle: stop if playing
  if (ttsPlaying) {
    stopTTS();
    resetTTSBtn(btn);
    return;
  }

  const text = cleanForSpeech(md);
  if (!text) return;

  ttsPlaying = true;
  btn.classList.add('playing');
  btn.innerHTML = '⏹ Stop';

  // Try ElevenLabs if key provided
  if (ELEVEN_KEY) {
    const ok = await elevenLabsTTS(text, btn);
    if (ok) return;
  }

  // Fallback: browser Web Speech API
  browserTTS(text, btn);
}

function resetTTSBtn(btn) {
  if (btn) {
    btn.classList.remove('playing');
    btn.innerHTML = '🔊 Speak';
  }
}

// Export for use in app.js
window.TTS = { speakText, stopTTS, preloadVoices, set elevenKey(k) { ELEVEN_KEY = k; } };

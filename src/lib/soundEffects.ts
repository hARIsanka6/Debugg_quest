/**
 * Sound Effects System for Debugg Quest
 * Uses Web Audio API and Speech Synthesis for audio feedback
 */

class SoundEffectsManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private isMuted: boolean = false;

  constructor() {
    // Initialize Audio Context on user interaction
    if (typeof window !== 'undefined') {
      this.initAudioContext();
    }
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  /**
   * Play a beep sound with specified frequency and duration
   */
  private playBeep(frequency: number, duration: number, volume: number = 0.3) {
    if (!this.audioContext || this.isMuted) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  /**
   * Play success sound (ascending notes)
   */
  playSuccess() {
    if (this.isMuted) return;
    
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, index) => {
      setTimeout(() => this.playBeep(freq, 0.15, 0.2), index * 100);
    });
  }

  /**
   * Play error sound (descending notes)
   */
  playError() {
    if (this.isMuted) return;
    
    const notes = [392, 349.23]; // G4, F4
    notes.forEach((freq, index) => {
      setTimeout(() => this.playBeep(freq, 0.2, 0.15), index * 150);
    });
  }

  /**
   * Play level complete sound (victory fanfare)
   */
  playLevelComplete() {
    if (this.isMuted) return;
    
    const melody = [
      { freq: 523.25, duration: 0.15 }, // C5
      { freq: 659.25, duration: 0.15 }, // E5
      { freq: 783.99, duration: 0.15 }, // G5
      { freq: 1046.50, duration: 0.4 }  // C6
    ];

    let delay = 0;
    melody.forEach(note => {
      setTimeout(() => this.playBeep(note.freq, note.duration, 0.25), delay);
      delay += note.duration * 1000;
    });
  }

  /**
   * Play badge unlock sound (special achievement)
   */
  playBadgeUnlock() {
    if (this.isMuted) return;
    
    const sparkle = [
      { freq: 1046.50, duration: 0.1 },
      { freq: 1318.51, duration: 0.1 },
      { freq: 1567.98, duration: 0.1 },
      { freq: 2093.00, duration: 0.3 }
    ];

    let delay = 0;
    sparkle.forEach(note => {
      setTimeout(() => this.playBeep(note.freq, note.duration, 0.2), delay);
      delay += note.duration * 800;
    });
  }

  /**
   * Play hint sound (gentle notification)
   */
  playHint() {
    if (this.isMuted) return;
    this.playBeep(880, 0.15, 0.15); // A5
  }

  /**
   * Play button click sound
   */
  playClick() {
    if (this.isMuted) return;
    this.playBeep(800, 0.05, 0.1);
  }

  /**
   * Play level unlock sound
   */
  playLevelUnlock() {
    if (this.isMuted) return;
    
    const unlock = [
      { freq: 659.25, duration: 0.1 },
      { freq: 783.99, duration: 0.1 },
      { freq: 1046.50, duration: 0.2 }
    ];

    let delay = 0;
    unlock.forEach(note => {
      setTimeout(() => this.playBeep(note.freq, note.duration, 0.2), delay);
      delay += note.duration * 900;
    });
  }

  /**
   * Speak text using Speech Synthesis API
   */
  speak(text: string, rate: number = 1.0, pitch: number = 1.0) {
    if (this.isMuted || !('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 0.8;

    // Try to use a more natural voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.includes('Google') || voice.name.includes('Natural'))
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Speak success message
   */
  speakSuccess() {
    const messages = [
      "Well done!",
      "Excellent work!",
      "Perfect!",
      "Great job!",
      "Outstanding!"
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];
    this.speak(message, 1.1, 1.2);
  }

  /**
   * Speak error message
   */
  speakError() {
    const messages = [
      "Try again!",
      "Not quite right!",
      "Keep trying!",
      "Almost there!",
      "Give it another shot!"
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];
    this.speak(message, 1.0, 0.9);
  }

  /**
   * Speak level complete message
   */
  speakLevelComplete(xp: number) {
    this.speak(`Level complete! You earned ${xp} experience points!`, 1.1, 1.1);
  }

  /**
   * Speak badge unlock message
   */
  speakBadgeUnlock(badgeName: string) {
    this.speak(`Achievement unlocked! ${badgeName}!`, 1.1, 1.2);
  }

  /**
   * Speak hint message
   */
  speakHint() {
    this.speak("Here's a hint to help you", 1.0, 1.0);
  }

  /**
   * Toggle mute
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      window.speechSynthesis.cancel();
    }
    return this.isMuted;
  }

  /**
   * Set mute state
   */
  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Get mute state
   */
  isMutedState() {
    return this.isMuted;
  }

  /**
   * Play combined audio and speech feedback for success
   */
  celebrateSuccess(xp?: number) {
    this.playSuccess();
    setTimeout(() => {
      if (xp) {
        this.speakLevelComplete(xp);
      } else {
        this.speakSuccess();
      }
    }, 300);
  }

  /**
   * Play combined audio and speech feedback for error
   */
  notifyError() {
    this.playError();
    setTimeout(() => {
      this.speakError();
    }, 200);
  }

  /**
   * Play combined audio and speech feedback for badge
   */
  celebrateBadge(badgeName: string) {
    this.playBadgeUnlock();
    setTimeout(() => {
      this.speakBadgeUnlock(badgeName);
    }, 400);
  }
}

// Create singleton instance
export const soundEffects = new SoundEffectsManager();

// Load voices when available
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

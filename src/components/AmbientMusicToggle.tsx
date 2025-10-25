import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

export const AmbientMusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Check localStorage for saved preference
    const savedPreference = localStorage.getItem('ambientMusicEnabled');
    if (savedPreference === 'true') {
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startAmbientMusic();
    } else {
      stopAmbientMusic();
    }

    return () => {
      stopAmbientMusic();
    };
  }, [isPlaying]);

  const createSpaceAmbience = async () => {
    if (typeof window === 'undefined') return;

    try {
      // Create audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      // Resume audio context if suspended (browser autoplay policy)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      console.log('Audio context state:', audioContext.state);

      // Create oscillators for ambient drone
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const oscillator3 = audioContext.createOscillator();

      // Create gain nodes for volume control
      const masterGain = audioContext.createGain();
      const gain1 = audioContext.createGain();
      const gain2 = audioContext.createGain();
      const gain3 = audioContext.createGain();

      gainNodeRef.current = masterGain;

      // Set oscillator types and frequencies for epic space theme
      oscillator1.type = 'sawtooth';
      oscillator1.frequency.setValueAtTime(110, audioContext.currentTime); // Epic bass (A2)

      oscillator2.type = 'square';
      oscillator2.frequency.setValueAtTime(220, audioContext.currentTime); // Power chord (A3)

      oscillator3.type = 'sine';
      oscillator3.frequency.setValueAtTime(440, audioContext.currentTime); // Bright melody (A4)

      // Set gain levels for epic atmosphere
      gain1.gain.setValueAtTime(0.08, audioContext.currentTime);
      gain2.gain.setValueAtTime(0.05, audioContext.currentTime);
      gain3.gain.setValueAtTime(0.04, audioContext.currentTime);
      masterGain.gain.setValueAtTime(0.5, audioContext.currentTime);

      // Connect nodes
      oscillator1.connect(gain1);
      oscillator2.connect(gain2);
      oscillator3.connect(gain3);

      gain1.connect(masterGain);
      gain2.connect(masterGain);
      gain3.connect(masterGain);

      masterGain.connect(audioContext.destination);

      // Start oscillators
      oscillator1.start();
      oscillator2.start();
      oscillator3.start();

      oscillatorRef.current = oscillator1;

      console.log('Epic space theme music started successfully');

      // Create epic melody sequence (Star Wars inspired)
      const melodyNotes = [
        { freq: 440, time: 0 },      // A
        { freq: 440, time: 0.5 },    // A
        { freq: 440, time: 1 },      // A
        { freq: 554.37, time: 1.8 }, // C#
        { freq: 659.25, time: 2.3 }, // E
        { freq: 440, time: 3 },      // A
        { freq: 554.37, time: 3.5 }, // C#
        { freq: 659.25, time: 4 },   // E
        { freq: 440, time: 5 },      // A (octave up)
      ];

      // Create melody oscillator
      const melodyOsc = audioContext.createOscillator();
      const melodyGain = audioContext.createGain();
      
      melodyOsc.type = 'square';
      melodyGain.gain.setValueAtTime(0.06, audioContext.currentTime);
      
      melodyOsc.connect(melodyGain);
      melodyGain.connect(masterGain);
      
      // Schedule melody notes in a loop
      const scheduleMelody = (startTime: number) => {
        melodyNotes.forEach(note => {
          melodyOsc.frequency.setValueAtTime(note.freq, startTime + note.time);
        });
      };
      
      melodyOsc.start();
      scheduleMelody(audioContext.currentTime);
      
      // Loop melody every 6 seconds
      setInterval(() => {
        scheduleMelody(audioContext.currentTime);
      }, 6000);

      // Add epic vibrato
      const vibrato = audioContext.createOscillator();
      const vibratoGain = audioContext.createGain();
      
      vibrato.type = 'sine';
      vibrato.frequency.setValueAtTime(5, audioContext.currentTime); // Fast vibrato
      vibratoGain.gain.setValueAtTime(10, audioContext.currentTime);
      
      vibrato.connect(vibratoGain);
      vibratoGain.connect(oscillator3.frequency);
      vibrato.start();

      // Add power chord movement
      const powerChordLFO = audioContext.createOscillator();
      const powerChordGain = audioContext.createGain();
      
      powerChordLFO.type = 'sine';
      powerChordLFO.frequency.setValueAtTime(0.2, audioContext.currentTime);
      powerChordGain.gain.setValueAtTime(15, audioContext.currentTime);
      
      powerChordLFO.connect(powerChordGain);
      powerChordGain.connect(oscillator2.frequency);
      powerChordLFO.start();

      // Add dramatic swell
      const swell = audioContext.createOscillator();
      const swellGain = audioContext.createGain();
      
      swell.type = 'sine';
      swell.frequency.setValueAtTime(0.15, audioContext.currentTime);
      swellGain.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      swell.connect(swellGain);
      swellGain.connect(masterGain.gain);
      swell.start();

    } catch (error) {
      console.error('Error creating ambient music:', error);
    }
  };

  const startAmbientMusic = () => {
    createSpaceAmbience();
    localStorage.setItem('ambientMusicEnabled', 'true');
  };

  const stopAmbientMusic = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (oscillatorRef.current) {
      oscillatorRef.current = null;
    }
    localStorage.setItem('ambientMusicEnabled', 'false');
  };

  const toggleMusic = async () => {
    const newState = !isPlaying;
    setIsPlaying(newState);
    console.log('Toggle music:', newState);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleMusic}
      className="relative"
      title={isPlaying ? "Disable ambient music" : "Enable ambient music"}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </>
      ) : (
        <VolumeX className="w-4 h-4" />
      )}
    </Button>
  );
};

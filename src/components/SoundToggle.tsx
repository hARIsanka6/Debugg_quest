import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { soundEffects } from "@/lib/soundEffects";

export const SoundToggle = () => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Load mute state from localStorage
    const savedMuteState = localStorage.getItem('soundMuted');
    if (savedMuteState !== null) {
      const muted = savedMuteState === 'true';
      setIsMuted(muted);
      soundEffects.setMuted(muted);
    }
  }, []);

  const toggleSound = () => {
    const newMutedState = soundEffects.toggleMute();
    setIsMuted(newMutedState);
    localStorage.setItem('soundMuted', String(newMutedState));
    
    // Play a test sound when unmuting
    if (!newMutedState) {
      soundEffects.playClick();
      setTimeout(() => {
        soundEffects.speak("Sound enabled", 1.0, 1.0);
      }, 100);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleSound}
      title={isMuted ? "Enable sound" : "Disable sound"}
    >
      {isMuted ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </Button>
  );
};

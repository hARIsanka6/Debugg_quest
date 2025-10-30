import { useEffect, useRef, useState, useCallback } from "react";
import { soundEffects } from "@/lib/soundEffects";

interface Bug {
  id: number;
  x: number;
  y: number;
  vy: number;
  size: number;
  type: number;
}

interface Laser {
  id: number;
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export const ClickableBugs = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [lasers, setLasers] = useState<Laser[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shipX, setShipX] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const nextBugIdRef = useRef(0);
  const nextLaserIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const keysPressed = useRef<Set<string>>(new Set());
  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getBugColor = (type: number): string => {
    const colors = [
      "rgb(168, 85, 247)",
      "rgb(239, 68, 68)",
      "rgb(34, 197, 94)",
    ];
    return colors[type % 3];
  };

  const spawnBug = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const x = Math.random() * container.offsetWidth;

    const newBug: Bug = {
      id: nextBugIdRef.current++,
      x,
      y: -50,
      vy: 1 + Math.random() * 1.5,
      size: 30 + Math.random() * 20,
      type: Math.floor(Math.random() * 3),
    };

    setBugs(prev => [...prev, newBug]);
  }, []);

  const shootLaser = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const shipY = container.offsetHeight - 100;

    const newLaser: Laser = {
      id: nextLaserIdRef.current++,
      x: shipX,
      y: shipY,
    };

    setLasers(prev => [...prev, newLaser]);
  }, [shipX]);

  const createExplosion = (x: number, y: number, type: number) => {
    const newParticles: Particle[] = [];
    const color = getBugColor(type);
    
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * 3,
        vy: Math.sin(angle) * 3,
        life: 30,
        color,
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  const addScore = useCallback((points: number) => {
    setCombo(prev => {
      const newCombo = prev + 1;
      const multiplier = Math.min(Math.floor(newCombo / 3) + 1, 5);
      setScore(s => s + points * multiplier);
      
      // Play hit sound
      soundEffects.playBugHit();
      
      // Play combo sound for combos
      if (newCombo > 1) {
        setShowCombo(true);
        setTimeout(() => setShowCombo(false), 1000);
        soundEffects.playCombo(newCombo);
      }
      
      // Reset combo timer
      if (comboTimerRef.current) {
        clearTimeout(comboTimerRef.current);
      }
      comboTimerRef.current = setTimeout(() => {
        setCombo(0);
      }, 2000);
      
      return newCombo;
    });
  }, []);

  // Initialize ship position
  useEffect(() => {
    if (containerRef.current) {
      setShipX(containerRef.current.offsetWidth / 2);
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
      if (e.key === ' ') {
        e.preventDefault();
        shootLaser();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [shootLaser]);

  // Update ship position
  useEffect(() => {
    const interval = setInterval(() => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      
      setShipX(prev => {
        let newX = prev;
        if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a')) {
          newX -= 5;
        }
        if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d')) {
          newX += 5;
        }
        return Math.max(40, Math.min(container.offsetWidth - 40, newX));
      });
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Update bugs
  useEffect(() => {
    const interval = setInterval(() => {
      setBugs(prev => {
        if (!containerRef.current) return prev;
        const container = containerRef.current;
        return prev
          .map(bug => ({
            ...bug,
            y: bug.y + bug.vy,
          }))
          .filter(bug => bug.y < container.offsetHeight + 100);
      });
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Update lasers and check collisions
  useEffect(() => {
    const interval = setInterval(() => {
      setLasers(prev => {
        const activeLasers = prev.map(laser => ({
          ...laser,
          y: laser.y - 8,
        })).filter(laser => laser.y > -20);

        // Check collisions
        setBugs(currentBugs => {
          const bugsToRemove = new Set<number>();
          const lasersToRemove = new Set<number>();

          currentBugs.forEach(bug => {
            activeLasers.forEach(laser => {
              const dist = Math.hypot(bug.x - laser.x, bug.y - laser.y);
              if (dist < bug.size / 2) {
                bugsToRemove.add(bug.id);
                lasersToRemove.add(laser.id);
                createExplosion(bug.x, bug.y, bug.type);
                addScore(10);
              }
            });
          });

          setLasers(currentLasers => 
            currentLasers.filter(l => !lasersToRemove.has(l.id))
          );

          return currentBugs.filter(b => !bugsToRemove.has(b.id));
        });

        return activeLasers;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [createExplosion]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 1,
          }))
          .filter(p => p.life > 0)
      );
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Spawn bugs periodically
  useEffect(() => {
    const interval = setInterval(() => {
      spawnBug();
    }, 2000);
    return () => clearInterval(interval);
  }, [spawnBug]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Bugs */}
      {bugs.map(bug => (
        <div
          key={bug.id}
          className="absolute pointer-events-none"
          style={{
            left: bug.x,
            top: bug.y,
            width: bug.size,
            height: bug.size,
            transform: `translate(-50%, -50%)`,
          }}
        >
          <svg
            width={bug.size}
            height={bug.size}
            viewBox="0 0 40 40"
            className="drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]"
          >
            <ellipse cx="20" cy="20" rx="16" ry="12" fill={getBugColor(bug.type)} opacity="0.9" />
            <circle cx="14" cy="16" r="3" fill="rgba(255, 0, 0, 0.8)" />
            <circle cx="26" cy="16" r="3" fill="rgba(255, 0, 0, 0.8)" />
            <line x1="12" y1="10" x2="8" y2="4" stroke={getBugColor(bug.type)} strokeWidth="2" strokeLinecap="round" />
            <line x1="28" y1="10" x2="32" y2="4" stroke={getBugColor(bug.type)} strokeWidth="2" strokeLinecap="round" />
            <circle cx="8" cy="4" r="2" fill={getBugColor(bug.type)} />
            <circle cx="32" cy="4" r="2" fill={getBugColor(bug.type)} />
            <line x1="8" y1="22" x2="4" y2="28" stroke={getBugColor(bug.type)} strokeWidth="2" />
            <line x1="14" y1="24" x2="10" y2="32" stroke={getBugColor(bug.type)} strokeWidth="2" />
            <line x1="26" y1="24" x2="30" y2="32" stroke={getBugColor(bug.type)} strokeWidth="2" />
            <line x1="32" y1="22" x2="36" y2="28" stroke={getBugColor(bug.type)} strokeWidth="2" />
          </svg>
        </div>
      ))}

      {/* Lasers */}
      {lasers.map(laser => (
        <div
          key={laser.id}
          className="absolute w-1 h-4 pointer-events-none"
          style={{
            left: laser.x,
            top: laser.y,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(to top, rgba(6, 182, 212, 1), rgba(6, 182, 212, 0))',
            boxShadow: '0 0 10px rgba(6, 182, 212, 0.8)',
          }}
        />
      ))}
      
      {/* Particles */}
      {particles.map((particle, index) => (
        <div
          key={index}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            opacity: particle.life / 30,
            boxShadow: `0 0 10px ${particle.color}`,
          }}
        />
      ))}

      {/* Spaceship */}
      <div
        className="absolute pointer-events-none transition-all duration-75"
        style={{
          left: shipX,
          bottom: 80,
          transform: 'translateX(-50%)',
        }}
      >
        <svg width="50" height="50" viewBox="0 0 50 50">
          <defs>
            <linearGradient id="shipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0.9" />
              <stop offset="50%" stopColor="rgb(168, 85, 247)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path
            d="M 25 10 L 15 35 L 20 38 L 30 38 L 35 35 Z"
            fill="url(#shipGradient)"
            stroke="rgb(6, 182, 212)"
            strokeWidth="2"
            filter="drop-shadow(0 0 10px rgba(6, 182, 212, 0.8))"
          />
          <circle cx="25" cy="20" r="4" fill="rgb(251, 191, 36)" opacity="0.9" />
          <path d="M 15 30 L 10 35 L 13 38 L 20 35 Z" fill="rgba(168, 85, 247, 0.7)" />
          <path d="M 35 30 L 40 35 L 37 38 L 30 35 Z" fill="rgba(168, 85, 247, 0.7)" />
        </svg>
      </div>

      {/* Score Display */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="bg-black/70 backdrop-blur-sm px-6 py-3 rounded-lg border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <div className="text-xs text-cyan-400 font-mono mb-1">SCORE</div>
          <div className="text-3xl font-bold text-cyan-400 font-mono tracking-wider">
            {score.toString().padStart(6, '0')}
          </div>
          {combo > 1 && (
            <div className={`text-sm font-bold mt-1 transition-all duration-300 ${showCombo ? 'scale-125 text-yellow-400' : 'text-purple-400'}`}>
              {combo}x COMBO! 🔥
            </div>
          )}
        </div>
      </div>

      {/* High Score Indicator */}
      {score > 0 && score % 100 === 0 && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 pointer-events-none animate-bounce">
          <div className="text-4xl font-bold text-yellow-400 font-game drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">
            +100! 🌟
          </div>
        </div>
      )}

      {/* Controls hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg text-sm text-cyan-400 font-mono">
          ← → or A D to move | SPACE to shoot
        </div>
      </div>
    </div>
  );
};

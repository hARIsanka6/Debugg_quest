import { useEffect, useRef } from "react";

interface Bug {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: number;
  alive: boolean;
}

interface Spaceship {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  lastShot: number;
  active: boolean;
}

interface Laser {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export const BugInvadersBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bugsRef = useRef<Bug[]>([]);
  const spaceShipsRef = useRef<Spaceship[]>([]);
  const lasersRef = useRef<Laser[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Spawn bugs from random directions
    const spawnBug = () => {
      const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      let x: number, y: number, vx: number, vy: number;
      
      switch (side) {
        case 0: // Top
          x = Math.random() * canvas.width;
          y = -30;
          vx = (Math.random() - 0.5) * 2;
          vy = 1 + Math.random() * 2;
          break;
        case 1: // Right
          x = canvas.width + 30;
          y = Math.random() * canvas.height;
          vx = -(1 + Math.random() * 2);
          vy = (Math.random() - 0.5) * 2;
          break;
        case 2: // Bottom
          x = Math.random() * canvas.width;
          y = canvas.height + 30;
          vx = (Math.random() - 0.5) * 2;
          vy = -(1 + Math.random() * 2);
          break;
        default: // Left
          x = -30;
          y = Math.random() * canvas.height;
          vx = 1 + Math.random() * 2;
          vy = (Math.random() - 0.5) * 2;
      }

      bugsRef.current.push({
        x,
        y,
        vx,
        vy,
        size: 15 + Math.random() * 10,
        type: Math.floor(Math.random() * 3),
        alive: true,
      });
    };

    // Spawn spaceships from random directions
    const spawnSpaceship = () => {
      const side = Math.floor(Math.random() * 4);
      let x: number, y: number, vx: number, vy: number, rotation: number;
      
      switch (side) {
        case 0: // Top
          x = Math.random() * canvas.width;
          y = -40;
          vx = (Math.random() - 0.5) * 1.5;
          vy = 0.8 + Math.random() * 1;
          rotation = Math.PI / 2;
          break;
        case 1: // Right
          x = canvas.width + 40;
          y = Math.random() * canvas.height;
          vx = -(0.8 + Math.random() * 1);
          vy = (Math.random() - 0.5) * 1.5;
          rotation = Math.PI;
          break;
        case 2: // Bottom
          x = Math.random() * canvas.width;
          y = canvas.height + 40;
          vx = (Math.random() - 0.5) * 1.5;
          vy = -(0.8 + Math.random() * 1);
          rotation = -Math.PI / 2;
          break;
        default: // Left
          x = -40;
          y = Math.random() * canvas.height;
          vx = 0.8 + Math.random() * 1;
          vy = (Math.random() - 0.5) * 1.5;
          rotation = 0;
      }

      spaceShipsRef.current.push({
        x,
        y,
        vx,
        vy,
        rotation,
        lastShot: 0,
        active: true,
      });
    };

    // Initialize with some bugs and spaceships
    const initBugs = () => {
      bugsRef.current = [];
      for (let i = 0; i < 12; i++) {
        spawnBug();
      }
    };

    const initSpaceships = () => {
      spaceShipsRef.current = [];
      for (let i = 0; i < 3; i++) {
        spawnSpaceship();
      }
    };

    initBugs();
    initSpaceships();

    let lastBugSpawn = 0;
    let lastShipSpawn = 0;

    // Animation loop
    const animate = (time: number) => {
      // Clear canvas with dark gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(5, 5, 15, 0.95)");
      gradient.addColorStop(1, "rgba(10, 10, 25, 0.95)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      for (let i = 0; i < 30; i++) {
        const x = (i * 37) % canvas.width;
        const y = ((i * 53 + time * 0.02) % canvas.height);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time * 0.01 + i) * 0.3})`;
        ctx.fillRect(x, y, 1, 1);
      }

      // Spawn new bugs periodically
      if (time - lastBugSpawn > 2000) {
        const aliveBugs = bugsRef.current.filter(b => b.alive).length;
        if (aliveBugs < 20) {
          spawnBug();
          lastBugSpawn = time;
        }
      }

      // Spawn new spaceships periodically
      if (time - lastShipSpawn > 3000) {
        const activeShips = spaceShipsRef.current.filter(s => s.active).length;
        if (activeShips < 5) {
          spawnSpaceship();
          lastShipSpawn = time;
        }
      }

      // Update and draw bugs
      bugsRef.current = bugsRef.current.filter((bug) => {
        if (!bug.alive) return false;

        // Move bugs
        bug.x += bug.vx;
        bug.y += bug.vy;

        // Remove bugs that go off screen
        if (bug.x < -50 || bug.x > canvas.width + 50 || 
            bug.y < -50 || bug.y > canvas.height + 50) {
          return false;
        }

        // Draw bug
        drawBug(ctx, bug, time);
        return true;
      });

      // Update and draw spaceships
      spaceShipsRef.current = spaceShipsRef.current.filter((ship) => {
        if (!ship.active) return false;

        // Move spaceship
        ship.x += ship.vx;
        ship.y += ship.vy;

        // Remove ships that go off screen
        if (ship.x < -60 || ship.x > canvas.width + 60 || 
            ship.y < -60 || ship.y > canvas.height + 60) {
          return false;
        }

        // Draw spaceship
        drawSpaceship(ctx, ship.x, ship.y, ship.rotation);

        // Auto-fire lasers from each ship
        if (time - ship.lastShot > 600) {
          // Calculate laser direction based on ship rotation
          const laserVx = Math.cos(ship.rotation) * 6;
          const laserVy = Math.sin(ship.rotation) * 6;
          
          lasersRef.current.push({
            x: ship.x,
            y: ship.y,
            vx: laserVx,
            vy: laserVy,
            active: true,
          });
          ship.lastShot = time;
        }

        return true;
      });

      // Update and draw lasers
      lasersRef.current = lasersRef.current.filter((laser) => {
        if (!laser.active) return false;

        laser.x += laser.vx;
        laser.y += laser.vy;

        // Remove lasers that go off screen
        if (laser.x < -20 || laser.x > canvas.width + 20 || 
            laser.y < -20 || laser.y > canvas.height + 20) {
          return false;
        }

        // Draw laser
        ctx.save();
        ctx.translate(laser.x, laser.y);
        
        const angle = Math.atan2(laser.vy, laser.vx);
        ctx.rotate(angle);
        
        const laserGradient = ctx.createLinearGradient(0, 0, 15, 0);
        laserGradient.addColorStop(0, "rgba(6, 182, 212, 0)");
        laserGradient.addColorStop(1, "rgba(6, 182, 212, 1)");
        
        ctx.fillStyle = laserGradient;
        ctx.fillRect(0, -2, 15, 4);

        // Glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(6, 182, 212, 0.8)";
        ctx.fillRect(0, -2, 15, 4);
        ctx.shadowBlur = 0;
        
        ctx.restore();

        // Check collision with bugs
        bugsRef.current.forEach((bug) => {
          if (bug.alive) {
            const dist = Math.hypot(bug.x - laser.x, bug.y - laser.y);
            if (dist < bug.size) {
              bug.alive = false;
              laser.active = false;
              
              // Create explosion particles
              for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 * i) / 8;
                particlesRef.current.push({
                  x: bug.x,
                  y: bug.y,
                  vx: Math.cos(angle) * 3,
                  vy: Math.sin(angle) * 3,
                  life: 30,
                  color: getBugColor(bug.type),
                });
              }
            }
          }
        });

        return laser.active;
      });

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        const alpha = particle.life / 30;
        ctx.fillStyle = particle.color.replace('1)', `${alpha})`);
        ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);

        return particle.life > 0;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Handle click to shoot
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Spawn 2-3 lasers from random edges toward the click point
      const numLasers = 2 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < numLasers; i++) {
        const side = Math.floor(Math.random() * 4);
        let startX: number, startY: number;
        
        switch (side) {
          case 0: // Top
            startX = Math.random() * canvas.width;
            startY = 0;
            break;
          case 1: // Right
            startX = canvas.width;
            startY = Math.random() * canvas.height;
            break;
          case 2: // Bottom
            startX = Math.random() * canvas.width;
            startY = canvas.height;
            break;
          default: // Left
            startX = 0;
            startY = Math.random() * canvas.height;
        }

        // Calculate direction toward click point
        const dx = clickX - startX;
        const dy = clickY - startY;
        const distance = Math.hypot(dx, dy);
        const speed = 8;
        
        lasersRef.current.push({
          x: startX,
          y: startY,
          vx: (dx / distance) * speed,
          vy: (dy / distance) * speed,
          active: true,
        });
      }

      // Create visual feedback at click point
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        particlesRef.current.push({
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * 2,
          vy: Math.sin(angle) * 2,
          life: 20,
          color: "rgba(6, 182, 212, 1)",
        });
      }
    };

    canvas.addEventListener("click", handleClick);

    animate(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("click", handleClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Draw bug (alien)
  const drawBug = (ctx: CanvasRenderingContext2D, bug: Bug, time: number) => {
    ctx.save();
    ctx.translate(bug.x, bug.y);

    const color = getBugColor(bug.type);
    const wobble = Math.sin(time * 0.005 + bug.x) * 3;

    // Bug body
    ctx.beginPath();
    ctx.ellipse(0, 0, bug.size * 0.8, bug.size * 0.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Bug eyes
    ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
    ctx.beginPath();
    ctx.arc(-bug.size * 0.3, -bug.size * 0.2, bug.size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bug.size * 0.3, -bug.size * 0.2, bug.size * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Antennae
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-bug.size * 0.4, -bug.size * 0.5);
    ctx.lineTo(-bug.size * 0.6, -bug.size * 0.8 + wobble);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bug.size * 0.4, -bug.size * 0.5);
    ctx.lineTo(bug.size * 0.6, -bug.size * 0.8 - wobble);
    ctx.stroke();

    // Antenna tips
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(-bug.size * 0.6, -bug.size * 0.8 + wobble, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bug.size * 0.6, -bug.size * 0.8 - wobble, 3, 0, Math.PI * 2);
    ctx.fill();

    // Legs (6 legs)
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const legX = -bug.size * 0.6 + i * bug.size * 0.6;
      const legWobble = Math.sin(time * 0.01 + i) * 5;
      
      // Left side
      ctx.beginPath();
      ctx.moveTo(legX, bug.size * 0.3);
      ctx.lineTo(legX - 8, bug.size * 0.6 + legWobble);
      ctx.stroke();
      
      // Right side
      ctx.beginPath();
      ctx.moveTo(-legX, bug.size * 0.3);
      ctx.lineTo(-legX + 8, bug.size * 0.6 + legWobble);
      ctx.stroke();
    }

    ctx.restore();
  };

  // Get bug color based on type
  const getBugColor = (type: number): string => {
    const colors = [
      "rgba(168, 85, 247, 1)", // Purple
      "rgba(239, 68, 68, 1)",  // Red
      "rgba(34, 197, 94, 1)",  // Green
    ];
    return colors[type % 3];
  };

  // Draw spaceship (player)
  const drawSpaceship = (ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number = 0) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Ship body
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(-15, 10);
    ctx.lineTo(-10, 15);
    ctx.lineTo(10, 15);
    ctx.lineTo(15, 10);
    ctx.closePath();

    const shipGradient = ctx.createLinearGradient(0, -20, 0, 15);
    shipGradient.addColorStop(0, "rgba(6, 182, 212, 0.9)");
    shipGradient.addColorStop(0.5, "rgba(168, 85, 247, 0.9)");
    shipGradient.addColorStop(1, "rgba(6, 182, 212, 0.9)");
    ctx.fillStyle = shipGradient;
    ctx.fill();

    // Glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(6, 182, 212, 0.8)";
    ctx.fill();
    ctx.shadowBlur = 0;

    // Outline
    ctx.strokeStyle = "rgba(6, 182, 212, 1)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Cockpit
    ctx.beginPath();
    ctx.arc(0, -5, 5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(251, 191, 36, 0.9)";
    ctx.fill();
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(251, 191, 36, 1)";
    ctx.fill();
    ctx.shadowBlur = 0;

    // Wings
    ctx.fillStyle = "rgba(168, 85, 247, 0.7)";
    
    // Left wing
    ctx.beginPath();
    ctx.moveTo(-15, 5);
    ctx.lineTo(-25, 10);
    ctx.lineTo(-20, 15);
    ctx.lineTo(-10, 12);
    ctx.closePath();
    ctx.fill();

    // Right wing
    ctx.beginPath();
    ctx.moveTo(15, 5);
    ctx.lineTo(25, 10);
    ctx.lineTo(20, 15);
    ctx.lineTo(10, 12);
    ctx.closePath();
    ctx.fill();

    // Cannons
    ctx.fillStyle = "rgba(6, 182, 212, 1)";
    ctx.fillRect(-12, 10, 3, 8);
    ctx.fillRect(9, 10, 3, 8);

    ctx.restore();
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          opacity: 0.4,
          mixBlendMode: "screen",
          pointerEvents: "auto"
        }}
      />
      
      {/* Scanline effect for retro feel */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)",
          opacity: 0.3,
        }}
      />

      {/* CRT screen curve effect */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-lg"
        style={{
          boxShadow: "inset 0 0 100px rgba(0, 0, 0, 0.5)",
        }}
      />
    </>
  );
};

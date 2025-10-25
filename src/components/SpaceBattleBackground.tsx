import { useEffect, useRef } from "react";

interface Spaceship {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  team: "blue" | "red";
  size: number;
  health: number;
}

interface Laser {
  x: number;
  y: number;
  vx: number;
  vy: number;
  team: "blue" | "red";
  life: number;
}

interface Explosion {
  x: number;
  y: number;
  radius: number;
  life: number;
  maxLife: number;
}

export const SpaceBattleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shipsRef = useRef<Spaceship[]>([]);
  const lasersRef = useRef<Laser[]>([]);
  const explosionsRef = useRef<Explosion[]>([]);
  const starsRef = useRef<Array<{ x: number; y: number; size: number; speed: number }>>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize stars
    const initStars = () => {
      starsRef.current = [];
      for (let i = 0; i < 150; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.3 + 0.1,
        });
      }
    };

    // Initialize spaceships
    const initSpaceships = () => {
      shipsRef.current = [
        {
          x: canvas.width * 0.2,
          y: canvas.height * 0.3,
          vx: 1,
          vy: 0.5,
          angle: 0,
          team: "blue",
          size: 25,
          health: 100,
        },
        {
          x: canvas.width * 0.8,
          y: canvas.height * 0.7,
          vx: -1,
          vy: -0.5,
          angle: Math.PI,
          team: "red",
          size: 25,
          health: 100,
        },
      ];
    };

    initStars();
    initSpaceships();

    let lastShot = 0;

    // Animation loop
    const animate = (time: number) => {
      // Clear canvas with dark gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(10, 10, 20, 1)");
      gradient.addColorStop(0.5, "rgba(15, 15, 30, 1)");
      gradient.addColorStop(1, "rgba(20, 20, 40, 1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update stars
      starsRef.current.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.random() * 0.5})`;
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      // Update and draw spaceships
      shipsRef.current.forEach((ship, index) => {
        // Update position
        ship.x += ship.vx;
        ship.y += ship.vy;

        // Bounce off edges
        if (ship.x < 50 || ship.x > canvas.width - 50) ship.vx *= -1;
        if (ship.y < 50 || ship.y > canvas.height - 50) ship.vy *= -1;

        // Update angle to face movement direction
        ship.angle = Math.atan2(ship.vy, ship.vx);

        // Draw spaceship
        drawSpaceship(ctx, ship);

        // Shoot lasers
        if (time - lastShot > 800) {
          const otherShip = shipsRef.current[1 - index];
          const dx = otherShip.x - ship.x;
          const dy = otherShip.y - ship.y;
          const angle = Math.atan2(dy, dx);

          lasersRef.current.push({
            x: ship.x + Math.cos(angle) * ship.size,
            y: ship.y + Math.sin(angle) * ship.size,
            vx: Math.cos(angle) * 5,
            vy: Math.sin(angle) * 5,
            team: ship.team,
            life: 100,
          });

          if (index === 1) lastShot = time;
        }
      });

      // Update and draw lasers
      lasersRef.current = lasersRef.current.filter((laser) => {
        laser.x += laser.vx;
        laser.y += laser.vy;
        laser.life--;

        // Draw laser
        const color = laser.team === "blue" ? "rgba(6, 182, 212, 0.9)" : "rgba(239, 68, 68, 0.9)";
        
        ctx.beginPath();
        ctx.moveTo(laser.x, laser.y);
        ctx.lineTo(laser.x - laser.vx * 3, laser.y - laser.vy * 3);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Check collision with ships
        shipsRef.current.forEach((ship) => {
          if (ship.team !== laser.team) {
            const dist = Math.hypot(ship.x - laser.x, ship.y - laser.y);
            if (dist < ship.size) {
              // Create explosion
              explosionsRef.current.push({
                x: laser.x,
                y: laser.y,
                radius: 0,
                life: 30,
                maxLife: 30,
              });
              laser.life = 0;
            }
          }
        });

        return laser.life > 0 && laser.x > 0 && laser.x < canvas.width && laser.y > 0 && laser.y < canvas.height;
      });

      // Update and draw explosions
      explosionsRef.current = explosionsRef.current.filter((explosion) => {
        explosion.radius += 2;
        explosion.life--;

        const alpha = explosion.life / explosion.maxLife;
        
        // Outer ring
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(251, 191, 36, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Inner glow
        const gradient = ctx.createRadialGradient(
          explosion.x, explosion.y, 0,
          explosion.x, explosion.y, explosion.radius
        );
        gradient.addColorStop(0, `rgba(251, 191, 36, ${alpha * 0.5})`);
        gradient.addColorStop(0.5, `rgba(239, 68, 68, ${alpha * 0.3})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fill();

        return explosion.life > 0;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Draw spaceship function
  const drawSpaceship = (ctx: CanvasRenderingContext2D, ship: Spaceship) => {
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);

    const color = ship.team === "blue" 
      ? { main: "rgba(6, 182, 212, 0.9)", glow: "rgba(6, 182, 212, 0.5)" }
      : { main: "rgba(239, 68, 68, 0.9)", glow: "rgba(239, 68, 68, 0.5)" };

    // Engine glow
    const engineGradient = ctx.createLinearGradient(-ship.size, 0, -ship.size * 1.5, 0);
    engineGradient.addColorStop(0, "rgba(251, 191, 36, 0.8)");
    engineGradient.addColorStop(1, "rgba(251, 191, 36, 0)");
    
    ctx.beginPath();
    ctx.moveTo(-ship.size * 0.5, -ship.size * 0.3);
    ctx.lineTo(-ship.size * 1.5, 0);
    ctx.lineTo(-ship.size * 0.5, ship.size * 0.3);
    ctx.closePath();
    ctx.fillStyle = engineGradient;
    ctx.fill();

    // Ship body (triangle)
    ctx.beginPath();
    ctx.moveTo(ship.size, 0);
    ctx.lineTo(-ship.size * 0.5, -ship.size * 0.5);
    ctx.lineTo(-ship.size * 0.5, ship.size * 0.5);
    ctx.closePath();

    // Gradient fill
    const shipGradient = ctx.createLinearGradient(-ship.size * 0.5, 0, ship.size, 0);
    shipGradient.addColorStop(0, color.main);
    shipGradient.addColorStop(1, color.glow);
    ctx.fillStyle = shipGradient;
    ctx.fill();

    // Glow effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = color.glow;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Outline
    ctx.strokeStyle = color.main;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Cockpit
    ctx.beginPath();
    ctx.arc(ship.size * 0.3, 0, ship.size * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = color.main;
    ctx.fill();
    ctx.shadowBlur = 10;
    ctx.shadowColor = color.main;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Wings
    ctx.beginPath();
    ctx.moveTo(-ship.size * 0.3, -ship.size * 0.5);
    ctx.lineTo(-ship.size * 0.5, -ship.size * 0.8);
    ctx.lineTo(-ship.size * 0.4, -ship.size * 0.5);
    ctx.closePath();
    ctx.fillStyle = color.glow;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-ship.size * 0.3, ship.size * 0.5);
    ctx.lineTo(-ship.size * 0.5, ship.size * 0.8);
    ctx.lineTo(-ship.size * 0.4, ship.size * 0.5);
    ctx.closePath();
    ctx.fillStyle = color.glow;
    ctx.fill();

    ctx.restore();
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10"
        style={{ background: "transparent" }}
      />
      
      {/* Additional overlay effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Radial gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, transparent 0%, rgba(10, 10, 20, 0.5) 100%)",
          }}
        />

        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>
    </>
  );
};

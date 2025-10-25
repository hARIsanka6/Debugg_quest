import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface Planet {
  x: number;
  y: number;
  size: number;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  angle: number;
}

export const SpaceBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const planetsRef = useRef<Planet[]>([]);
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
      const starCount = 200;
      
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.5 + 0.5,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    // Initialize planets
    const initPlanets = () => {
      planetsRef.current = [
        {
          x: canvas.width * 0.15,
          y: canvas.height * 0.2,
          size: 60,
          color: "rgba(168, 85, 247, 0.3)", // Purple
          orbitRadius: 0,
          orbitSpeed: 0,
          angle: 0,
        },
        {
          x: canvas.width * 0.85,
          y: canvas.height * 0.7,
          size: 80,
          color: "rgba(6, 182, 212, 0.25)", // Cyan
          orbitRadius: 0,
          orbitSpeed: 0,
          angle: 0,
        },
        {
          x: canvas.width * 0.5,
          y: canvas.height * 0.1,
          size: 40,
          color: "rgba(251, 191, 36, 0.2)", // Accent/Gold
          orbitRadius: 0,
          orbitSpeed: 0,
          angle: 0,
        },
      ];
    };

    initStars();
    initPlanets();

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.01;

      // Clear canvas with dark gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(13, 13, 26, 1)"); // Very dark blue
      gradient.addColorStop(0.5, "rgba(17, 17, 35, 1)"); // Dark purple-blue
      gradient.addColorStop(1, "rgba(20, 20, 40, 1)"); // Dark blue-purple
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nebula clouds
      drawNebula(ctx, canvas, time);

      // Draw and update stars
      starsRef.current.forEach((star) => {
        // Twinkling effect
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const currentOpacity = star.opacity + twinkle * 0.3;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.fill();

        // Add glow for larger stars
        if (star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          const glowGradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 2
          );
          glowGradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity * 0.3})`);
          glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = glowGradient;
          ctx.fill();
        }

        // Move stars slowly
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      // Draw planets with glow
      planetsRef.current.forEach((planet) => {
        // Planet glow
        const glowGradient = ctx.createRadialGradient(
          planet.x, planet.y, 0,
          planet.x, planet.y, planet.size * 1.5
        );
        glowGradient.addColorStop(0, planet.color);
        glowGradient.addColorStop(0.5, planet.color.replace(/[\d.]+\)/, "0.1)"));
        glowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Planet body
        const planetGradient = ctx.createRadialGradient(
          planet.x - planet.size * 0.3,
          planet.y - planet.size * 0.3,
          0,
          planet.x,
          planet.y,
          planet.size
        );
        planetGradient.addColorStop(0, planet.color.replace(/[\d.]+\)/, "0.6)"));
        planetGradient.addColorStop(1, planet.color.replace(/[\d.]+\)/, "0.2)"));
        
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2);
        ctx.fillStyle = planetGradient;
        ctx.fill();

        // Subtle rotation effect
        planet.angle += 0.001;
      });

      // Draw shooting stars more frequently
      if (Math.random() > 0.98) {
        drawShootingStar(ctx, canvas);
      }

      // Draw spaceships occasionally
      if (Math.random() > 0.995) {
        drawSpaceship(ctx, canvas);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Draw nebula clouds
  const drawNebula = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) => {
    const nebulae = [
      { x: canvas.width * 0.3, y: canvas.height * 0.4, color: "rgba(168, 85, 247, 0.05)" }, // Purple
      { x: canvas.width * 0.7, y: canvas.height * 0.6, color: "rgba(6, 182, 212, 0.04)" }, // Cyan
      { x: canvas.width * 0.5, y: canvas.height * 0.3, color: "rgba(251, 191, 36, 0.03)" }, // Gold
    ];

    nebulae.forEach((nebula, index) => {
      const size = 300 + Math.sin(time + index) * 50;
      const gradient = ctx.createRadialGradient(
        nebula.x, nebula.y, 0,
        nebula.x, nebula.y, size
      );
      gradient.addColorStop(0, nebula.color);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      
      ctx.beginPath();
      ctx.arc(nebula.x, nebula.y, size, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });
  };

  // Draw shooting star
  const drawShootingStar = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const startX = Math.random() * canvas.width;
    const startY = Math.random() * canvas.height * 0.5;
    const length = 150 + Math.random() * 100;
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3; // Varied angle

    const gradient = ctx.createLinearGradient(
      startX, startY,
      startX + Math.cos(angle) * length,
      startY + Math.sin(angle) * length
    );
    
    // Random color for shooting stars
    const colors = [
      "rgba(255, 255, 255, 0.9)",
      "rgba(168, 85, 247, 0.9)", // Purple
      "rgba(6, 182, 212, 0.9)",  // Cyan
      "rgba(251, 191, 36, 0.9)", // Gold
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    gradient.addColorStop(0, color.replace("0.9", "0"));
    gradient.addColorStop(0.3, color);
    gradient.addColorStop(1, color.replace("0.9", "0"));

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(
      startX + Math.cos(angle) * length,
      startY + Math.sin(angle) * length
    );
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Add glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  // Draw spaceship
  const drawSpaceship = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const x = -50;
    const y = Math.random() * canvas.height;
    const speed = 3 + Math.random() * 2;
    const size = 20 + Math.random() * 15;

    let currentX = x;
    const animateSpaceship = () => {
      if (currentX > canvas.width + 50) return;

      // Spaceship body (triangle)
      ctx.beginPath();
      ctx.moveTo(currentX + size, y);
      ctx.lineTo(currentX, y - size * 0.4);
      ctx.lineTo(currentX, y + size * 0.4);
      ctx.closePath();
      
      const shipGradient = ctx.createLinearGradient(currentX, y - size * 0.4, currentX, y + size * 0.4);
      shipGradient.addColorStop(0, "rgba(168, 85, 247, 0.8)");
      shipGradient.addColorStop(0.5, "rgba(6, 182, 212, 0.9)");
      shipGradient.addColorStop(1, "rgba(168, 85, 247, 0.8)");
      ctx.fillStyle = shipGradient;
      ctx.fill();

      // Glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(6, 182, 212, 0.8)";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Engine trail
      const trailGradient = ctx.createLinearGradient(
        currentX, y,
        currentX - size * 1.5, y
      );
      trailGradient.addColorStop(0, "rgba(251, 191, 36, 0.6)");
      trailGradient.addColorStop(0.5, "rgba(251, 191, 36, 0.3)");
      trailGradient.addColorStop(1, "rgba(251, 191, 36, 0)");
      
      ctx.beginPath();
      ctx.moveTo(currentX, y - size * 0.2);
      ctx.lineTo(currentX - size * 1.5, y);
      ctx.lineTo(currentX, y + size * 0.2);
      ctx.closePath();
      ctx.fillStyle = trailGradient;
      ctx.fill();

      // Window/cockpit
      ctx.beginPath();
      ctx.arc(currentX + size * 0.6, y, size * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(6, 182, 212, 0.9)";
      ctx.fill();
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(6, 182, 212, 1)";
      ctx.fill();
      ctx.shadowBlur = 0;

      currentX += speed;
      requestAnimationFrame(animateSpaceship);
    };

    animateSpaceship();
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10"
        style={{ background: "transparent" }}
      />
      
      {/* Additional CSS-based animated elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}

        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Radial gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, transparent 0%, rgba(13, 13, 26, 0.5) 100%)",
          }}
        />
      </div>
    </>
  );
};

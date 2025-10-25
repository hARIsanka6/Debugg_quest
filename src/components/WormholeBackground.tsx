import { useEffect, useRef } from "react";

export const WormholeBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Wormhole particles
    const particles: Array<{
      angle: number;
      radius: number;
      z: number;
      speed: number;
      color: string;
    }> = [];

    // Create particles
    for (let i = 0; i < 500; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 300,
        z: Math.random() * 1000,
        speed: 0.5 + Math.random() * 2,
        color: `hsl(${Math.random() * 60 + 260}, 80%, ${50 + Math.random() * 30}%)`,
      });
    }

    let rotation = 0;

    const animate = () => {
      // Create tunnel effect with fade
      ctx.fillStyle = "rgba(5, 5, 15, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      rotation += 0.002;

      // Draw particles
      particles.forEach((particle) => {
        // Move particle forward
        particle.z -= particle.speed;

        // Reset particle if it goes past camera
        if (particle.z <= 0) {
          particle.z = 1000;
          particle.angle = Math.random() * Math.PI * 2;
          particle.radius = Math.random() * 300;
        }

        // Calculate 3D projection
        const scale = 1000 / (1000 + particle.z);
        const x2d = centerX + Math.cos(particle.angle + rotation) * particle.radius * scale;
        const y2d = centerY + Math.sin(particle.angle + rotation) * particle.radius * scale;

        // Calculate size based on depth
        const size = scale * 3;
        const opacity = 1 - particle.z / 1000;

        // Draw particle
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(")", `, ${opacity})`).replace("hsl", "hsla");
        ctx.fill();

        // Draw glow
        const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size * 3);
        gradient.addColorStop(0, particle.color.replace(")", `, ${opacity * 0.5})`).replace("hsl", "hsla"));
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw spiral rings
      for (let i = 0; i < 5; i++) {
        const ringZ = (rotation * 500 + i * 200) % 1000;
        const ringScale = 1000 / (1000 + ringZ);
        const ringRadius = 400 * ringScale;
        const ringOpacity = (1 - ringZ / 1000) * 0.3;

        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168, 85, 247, ${ringOpacity})`;
        ctx.lineWidth = 2 * ringScale;
        ctx.stroke();

        // Inner glow
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(6, 182, 212, ${ringOpacity * 0.5})`;
        ctx.lineWidth = 4 * ringScale;
        ctx.stroke();
      }

      // Draw center vortex
      const vortexGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        150
      );
      vortexGradient.addColorStop(0, "rgba(168, 85, 247, 0.8)");
      vortexGradient.addColorStop(0.5, "rgba(6, 182, 212, 0.4)");
      vortexGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = vortexGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
      ctx.fill();

      // Draw planets with orbiting text
      drawPlanetsWithText(ctx, centerX, centerY, rotation);

      // Draw spaceships with banner
      drawSpaceshipsWithBanner(ctx, canvas.width, canvas.height, rotation);

      requestAnimationFrame(animate);
    };

    const drawPlanetsWithText = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
      // Planet 1 - Top Left
      const planet1X = centerX - 300;
      const planet1Y = centerY - 200;
      drawPlanet(ctx, planet1X, planet1Y, 40, "#a855f7", time);
      drawOrbitingText(ctx, planet1X, planet1Y, 80, "WELCOME", time * 2, "#06b6d4");

      // Planet 2 - Top Right
      const planet2X = centerX + 350;
      const planet2Y = centerY - 150;
      drawPlanet(ctx, planet2X, planet2Y, 50, "#06b6d4", time * 1.5);
      drawOrbitingText(ctx, planet2X, planet2Y, 90, "TO", time * -2.5, "#a855f7");

      // Planet 3 - Bottom Left
      const planet3X = centerX - 350;
      const planet3Y = centerY + 180;
      drawPlanet(ctx, planet3X, planet3Y, 45, "#f59e0b", time * 0.8);
      drawOrbitingText(ctx, planet3X, planet3Y, 85, "DEBUGGING", time * 1.8, "#22c55e");

      // Planet 4 - Bottom Right
      const planet4X = centerX + 320;
      const planet4Y = centerY + 200;
      drawPlanet(ctx, planet4X, planet4Y, 35, "#22c55e", time * 1.2);
      drawOrbitingText(ctx, planet4X, planet4Y, 75, "ADVENTURE", time * -1.5, "#f59e0b");
    };

    const drawPlanet = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, rotation: number) => {
      // Planet body
      const planetGradient = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius);
      planetGradient.addColorStop(0, color);
      planetGradient.addColorStop(1, "rgba(0, 0, 0, 0.8)");
      
      ctx.fillStyle = planetGradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Planet glow
      const glowGradient = ctx.createRadialGradient(x, y, radius, x, y, radius * 1.5);
      glowGradient.addColorStop(0, color.replace(")", ", 0.3)").replace("rgb", "rgba"));
      glowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Planet surface details
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      for (let i = 0; i < 3; i++) {
        const detailAngle = (i * Math.PI * 2) / 3;
        const detailX = Math.cos(detailAngle) * radius * 0.5;
        const detailY = Math.sin(detailAngle) * radius * 0.5;
        
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.arc(detailX, detailY, radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    };

    const drawOrbitingText = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, orbitRadius: number, text: string, rotation: number, color: string) => {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      // Draw text along the orbit
      const angleStep = (Math.PI * 2) / text.length;
      
      for (let i = 0; i < text.length; i++) {
        ctx.save();
        const angle = i * angleStep;
        ctx.rotate(angle);
        ctx.translate(0, -orbitRadius);
        ctx.rotate(Math.PI / 2);

        // Text shadow/glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.font = "bold 20px 'Orbitron', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text[i], 0, 0);

        // Second layer for extra glow
        ctx.shadowBlur = 25;
        ctx.fillText(text[i], 0, 0);

        ctx.restore();
      }

      ctx.restore();
    };

    const drawSpaceshipsWithBanner = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
      // Calculate positions for flying across screen (much faster)
      const progress = (time * 200) % (width + 600);
      const yPosition = height * 0.12; // Top portion of screen
      
      const ship1X = progress - 300;
      const ship2X = progress + 100;
      
      // Always draw if any part is on screen
      if (ship1X > -150 && ship1X < width + 150) {
        // Draw left spaceship (larger)
        drawSpaceship(ctx, ship1X, yPosition, 1.5);
        
        // Draw right spaceship (larger)
        drawSpaceship(ctx, ship2X, yPosition, 1.5);
        
        // Draw banner between ships
        drawBanner(ctx, ship1X, ship2X, yPosition);
      }
    };

    const drawSpaceship = (ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      // Ship body
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(-20, 10);
      ctx.lineTo(-15, 15);
      ctx.lineTo(15, 15);
      ctx.lineTo(20, 10);
      ctx.closePath();

      const shipGradient = ctx.createLinearGradient(0, -15, 0, 15);
      shipGradient.addColorStop(0, "#06b6d4");
      shipGradient.addColorStop(0.5, "#a855f7");
      shipGradient.addColorStop(1, "#06b6d4");
      ctx.fillStyle = shipGradient;
      ctx.fill();

      // Ship glow
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#06b6d4";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Ship outline
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Cockpit
      ctx.beginPath();
      ctx.arc(0, -5, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#fbbf24";
      ctx.fill();
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#fbbf24";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Wings
      ctx.fillStyle = "rgba(168, 85, 247, 0.7)";
      
      // Left wing
      ctx.beginPath();
      ctx.moveTo(-20, 5);
      ctx.lineTo(-35, 10);
      ctx.lineTo(-30, 15);
      ctx.lineTo(-15, 12);
      ctx.closePath();
      ctx.fill();

      // Right wing
      ctx.beginPath();
      ctx.moveTo(20, 5);
      ctx.lineTo(35, 10);
      ctx.lineTo(30, 15);
      ctx.lineTo(15, 12);
      ctx.closePath();
      ctx.fill();

      // Engine glow
      ctx.beginPath();
      ctx.arc(-12, 15, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#f59e0b";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#f59e0b";
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(12, 15, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawBanner = (ctx: CanvasRenderingContext2D, x1: number, x2: number, y: number) => {
      const bannerY = y + 30;
      const bannerHeight = 50;
      
      // Banner rope/cable from ships
      ctx.strokeStyle = "rgba(6, 182, 212, 0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y + 15);
      ctx.lineTo(x1 + 20, bannerY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x2, y + 15);
      ctx.lineTo(x2 - 20, bannerY);
      ctx.stroke();

      // Banner background
      const bannerWidth = x2 - x1 - 40;
      const bannerX = x1 + 20;

      // Banner gradient
      const bannerGradient = ctx.createLinearGradient(bannerX, bannerY, bannerX + bannerWidth, bannerY);
      bannerGradient.addColorStop(0, "rgba(168, 85, 247, 0.9)");
      bannerGradient.addColorStop(0.5, "rgba(6, 182, 212, 0.9)");
      bannerGradient.addColorStop(1, "rgba(168, 85, 247, 0.9)");

      // Banner shape with wave
      ctx.beginPath();
      ctx.moveTo(bannerX, bannerY);
      
      for (let i = 0; i <= bannerWidth; i += 10) {
        const waveY = bannerY + Math.sin((i / bannerWidth) * Math.PI * 4) * 3;
        ctx.lineTo(bannerX + i, waveY);
      }
      
      ctx.lineTo(bannerX + bannerWidth, bannerY + bannerHeight);
      
      for (let i = bannerWidth; i >= 0; i -= 10) {
        const waveY = bannerY + bannerHeight + Math.sin((i / bannerWidth) * Math.PI * 4) * 3;
        ctx.lineTo(bannerX + i, waveY);
      }
      
      ctx.closePath();
      ctx.fillStyle = bannerGradient;
      ctx.fill();

      // Banner border glow
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#06b6d4";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Banner text (larger and brighter)
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px 'Orbitron', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#06b6d4";
      
      const text = "WELCOME TO DEBUGGING ADVENTURE";
      ctx.fillText(text, bannerX + bannerWidth / 2, bannerY + bannerHeight / 2);
      
      // Extra glow layers for visibility
      ctx.shadowBlur = 25;
      ctx.shadowColor = "#a855f7";
      ctx.fillText(text, bannerX + bannerWidth / 2, bannerY + bannerHeight / 2);
      
      ctx.shadowBlur = 30;
      ctx.shadowColor = "#ffffff";
      ctx.fillText(text, bannerX + bannerWidth / 2, bannerY + bannerHeight / 2);
      ctx.shadowBlur = 0;
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ background: "radial-gradient(circle, #0a0a1a 0%, #050510 100%)" }}
      />
      
      {/* Overlay gradient for depth */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 0%, rgba(5, 5, 15, 0.8) 100%)",
        }}
      />

      {/* Scanlines for retro effect */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px)",
        }}
      />
    </>
  );
};

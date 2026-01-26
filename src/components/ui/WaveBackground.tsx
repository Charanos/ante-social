"use client";

import { useEffect, useRef } from "react";

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width: number;
    let height: number;
    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      baseY: number;
      size: number;
      speed: number;
      offset: number;

      constructor() {
        this.x = Math.random() * width;
        this.baseY = height / 2;
        this.y = this.baseY;
        this.size = Math.random() * 1 + 0.5;
        this.speed = Math.random() * 0.5 + 0.2;
        this.offset = Math.random() * 100;
      }

      update(time: number) {
        this.x += this.speed;
        if (this.x > width) {
          this.x = 0;
        }

        const wave1 = Math.sin(this.x * 0.003 + time + this.offset) * 50;
        const wave2 = Math.sin(this.x * 0.005 + time * 0.5 + this.offset) * 20;
        this.y = this.baseY + wave1 + wave2;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.5 + 0.3})`;
        ctx!.fill();
      }
    }

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      particles = [];
      const particleCount = Math.min(Math.floor(width * 0.2), 300);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    window.addEventListener("resize", init);
    init();

    let time = 0;
    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, width, height);

      particles.forEach(particle => {
        particle.update(time);
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: 0,
        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
      }}
    />
  );
}

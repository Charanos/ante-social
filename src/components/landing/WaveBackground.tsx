
"use client";

import { useRef, useEffect } from "react";

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
    let waves: Wave[] = [];

    class Wave {
      amplitude: number;
      frequency: number;
      phase: number;
      speed: number;
      yOffset: number;
      opacity: number;

      constructor(index: number) {
        this.amplitude = 40 + index * 15;
        this.frequency = 0.002 + index * 0.0005;
        this.phase = index * Math.PI * 0.3;
        this.speed = 0.3 + index * 0.1;
        this.yOffset = height / 2 + index * 30; // Centered vertically
        this.opacity = 0.05 - index * 0.01; // Very subtle
      }

      draw(time: number) {
        ctx!.beginPath();
        ctx!.moveTo(0, height);

        for (let x = 0; x <= width; x += 3) {
          const y =
            this.yOffset +
            Math.sin(x * this.frequency + time * this.speed + this.phase) *
              this.amplitude +
            Math.sin(x * this.frequency * 2 + time * this.speed * 0.7) *
              (this.amplitude * 0.3);

          if (x === 0) {
            ctx!.moveTo(x, y);
          } else {
            ctx!.lineTo(x, y);
          }
        }

        ctx!.lineTo(width, height);
        ctx!.lineTo(0, height);
        ctx!.closePath();

        ctx!.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
        ctx!.fill();
      }
    }

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      waves = [];
      for (let i = 0; i < 3; i++) {
        waves.push(new Wave(i));
      }
    };

    window.addEventListener("resize", init);
    init();

    let time = 0;
    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, width, height);
      waves.forEach((wave) => wave.draw(time));
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
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
      style={{
        maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
      }}
    />
  );
}

"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  IconActivity,
  IconArrowRight,
  IconPhoto,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";

// Enhanced Wave Background with smoother animations
function WaveBackground() {
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
        this.yOffset = height / 2 + index * 30;
        this.opacity = 0.08 - index * 0.02;
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

    class Particle {
      x: number;
      y: number;
      baseY: number;
      size: number;
      speed: number;
      offset: number;
      alpha: number;

      constructor() {
        this.x = Math.random() * width;
        this.baseY = height / 2 + (Math.random() - 0.5) * 200;
        this.y = this.baseY;
        this.size = Math.random() * 1.5 + 0.5;
        this.speed = Math.random() * 0.3 + 0.15;
        this.offset = Math.random() * Math.PI * 2;
        this.alpha = Math.random() * 0.4 + 0.2;
      }

      update(time: number) {
        this.x += this.speed;
        if (this.x > width + 10) {
          this.x = -10;
          this.baseY = height / 2 + (Math.random() - 0.5) * 200;
        }

        const wave1 = Math.sin(this.x * 0.004 + time * 0.8 + this.offset) * 35;
        const wave2 = Math.sin(this.x * 0.006 + time * 0.5 + this.offset) * 15;
        const wave3 = Math.cos(this.x * 0.003 + time * 0.3) * 10;
        this.y = this.baseY + wave1 + wave2 + wave3;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const gradient = ctx!.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size * 2,
        );
        gradient.addColorStop(0, `rgba(0, 0, 0, ${this.alpha})`);
        gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
        ctx!.fillStyle = gradient;
        ctx!.fill();
      }
    }

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      // Create wave layers
      waves = [];
      for (let i = 0; i < 3; i++) {
        waves.push(new Wave(i));
      }

      // Create particles
      particles = [];
      const particleCount = Math.min(Math.floor(width * 0.15), 250);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    window.addEventListener("resize", init);
    init();

    let time = 0;
    const animate = () => {
      time += 0.008;
      ctx.clearRect(0, 0, width, height);

      // Draw waves
      waves.forEach((wave) => wave.draw(time));

      // Draw particles
      particles.forEach((particle) => {
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
        maskImage: "linear-gradient(to bottom, black 40%, transparent 90%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 40%, transparent 90%)",
      }}
    />
  );
}

// Floating stats component
function FloatingStats() {
  const stats = [
    { icon: IconUsers, label: "Active Players", value: "12.5K", delay: 0.2 },
    {
      icon: IconTrendingUp,
      label: "Total Volume",
      value: "KSH 8.2M",
      delay: 0.4,
    },
    { icon: IconActivity, label: "Markets Live", value: "342", delay: 0.6 },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: stat.delay,
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          whileHover={{ scale: 1.05, y: -2 }}
          className="flex items-center gap-3 px-4 md:px-6 py-3 bg-white/80 backdrop-blur-sm border border-black/5 rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          <stat.icon className="w-4 h-4 text-black/60" />
          <div className="flex flex-col items-start">
            <span className="text-xs text-black/50 font-medium">
              {stat.label}
            </span>
            <span className="font-mono text-sm md:text-base font-semibold text-black">
              {stat.value}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 30 };
  const rotateX = useSpring(
    useTransform(mouseY, [-300, 300], [5, -5]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-300, 300], [-5, 5]),
    springConfig,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 pt-18 pb-20 overflow-hidden text-center">
      {/* Enhanced Wave Background */}
      <WaveBackground />

      {/* Background Effects */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-50/40 via-white to-white"
        style={{ zIndex: -10 }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-black/5 blur-[120px] rounded-full pointer-events-none"
        style={{ zIndex: -5 }}
      />

      {/* Ambient floating orbs */}
      <motion.div
        className="absolute top-20 left-1/4 w-64 h-64 bg-black/3 rounded-full blur-3xl"
        animate={{
          y: [0, 30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ zIndex: -5 }}
      />
      <motion.div
        className="absolute top-40 right-1/4 w-48 h-48 bg-black/2 rounded-full blur-3xl"
        animate={{
          y: [0, -20, 0],
          x: [0, -15, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{ zIndex: -5 }}
      />

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative max-w-5xl mx-auto space-y-8 pt-16 z-10"
      >
        <motion.h1
          className="text-5xl md:text-8xl font-medium tracking-tight text-black leading-[1.1]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          The only social betting <br className="hidden md:block" />
          <span className="relative inline-block">
            platform you need
            <motion.span
              className="absolute -bottom-2 left-0 right-0 h-1 bg-black/10 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
            />
          </span>
        </motion.h1>

        <motion.p
          className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-600 font-medium leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Free easy-to-use tools built for players who want full control. Track
          your wins, climb the leaderboard, and master the market.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <motion.button
            className="group relative inline-flex items-center gap-2 px-8 py-2 text-lg font-normal text-white bg-black rounded-full overflow-hidden shadow-lg"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-black via-neutral-800 to-black"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">Get Started for Free</span>
            <IconArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </motion.button>

          <motion.button
            className="px-8 py-2 text-lg font-medium text-black bg-white border border-black/10 rounded-full hover:bg-black/5 transition-colors shadow-sm"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Explore Features
          </motion.button>
        </motion.div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="pt-8"
        >
          <FloatingStats />
        </motion.div>

        {/* Scroll indicator */}
        {/* <motion.div
        className="relative bottom-0 left-[50vw] pt-18 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
       >
        <motion.div
          className="w-6 h-10 border-2 border-black/20 rounded-full p-1 flex justify-center"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="w-1 h-2 bg-black/30 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div> */}
      </motion.div>

      {/* Enhanced Dashboard Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1, duration: 1, type: "spring", stiffness: 100 }}
        className="relative mt-20 w-full max-w-7xl"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 2000 }}
      >
        <motion.div
          className="relative rounded-2xl border border-black/10 bg-white shadow-2xl overflow-hidden group cursor-pointer"
          style={{
            rotateX: mounted ? rotateX : 0,
            rotateY: mounted ? rotateY : 0,
            transformStyle: "preserve-3d",
          }}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Dashboard Preview */}
          <div className="relative bg-linear-to-br from-neutral-50 to-white p-4 md:p-6">
            <div className="relative aspect-video rounded-xl border border-black/5 overflow-hidden shadow-2xl">
              <Image
                src="/dashboard-mockup.png"
                alt="Dashboard Preview"
                fill
                className="object-cover object-top"
                priority
              />
              {/* Optional: Add a subtle overlay for depth */}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Overlay effects */}
          <div className="absolute inset-0 bg-linear-to-t from-black/5 via-transparent to-transparent pointer-events-none" />

          {/* Shimmer effect on hover */}
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.8 }}
          />
        </motion.div>

        {/* Enhanced Reflection */}
        <motion.div
          className="absolute -bottom-20 left-0 right-0 h-32 opacity-30 blur-2xl"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)",
            transform: "scaleY(-1)",
          }}
        />

        {/* Floating accent elements */}
        <motion.div
          className="absolute -top-4 -right-4 w-24 h-24 bg-black/5 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-6 -left-6 w-32 h-32 bg-black/5 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>
    </section>
  );
}

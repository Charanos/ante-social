"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  IconAccessPoint,
  IconArrowRight,
  IconPhoto,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import router from "next/router";
import Link from "next/link";
import { useLandingContent } from "@/lib/live-data";

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
    {
      icon: IconUsers,
      label: "Active Players",
      value: "12.5K",
      delay: 0.2,
      gradient: "from-blue-50/70 via-white/55 to-white/45",
    },
    {
      icon: IconTrendingUp,
      label: "Total Volume",
      value: "KSH 8.2M",
      delay: 0.4,
      gradient: "from-amber-50/70 via-white/55 to-white/45",
    },
    {
      icon: IconAccessPoint,
      label: "Markets Live",
      value: "342",
      delay: 0.6,
      gradient: "from-green-50/70 via-white/55 to-white/45",
    },
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
          className={`flex items-center gap-3 px-4 md:px-6 py-3 bg-gradient-to-br ${stat.gradient} bg-white/40 backdrop-blur-lg border border-white/50 rounded-full shadow-sm hover:shadow-md transition-shadow`}
        >
          <stat.icon className="w-4 h-4 text-black/80" />
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
  const { content } = useLandingContent();
  const heroContent = content?.hero || {};

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
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 md:pt-18 pt-6 md:pb-20 overflow-hidden text-center">
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
        className="relative max-w-5xl mx-auto space-y-8 pt-28 z-10"
      >
        <motion.h1
          className="text-5xl md:text-6xl lg:text-[88px] font-medium tracking-tight text-black leading-[1.1]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {heroContent.title ? (
            heroContent.title
          ) : (
            <>
              Monetize your {" "} 
              <span className="relative inline-block">
                {" "} conviction
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-black/10 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                />
              </span>
            </>
          )}
        </motion.h1>

        <motion.p
          className="max-w-2xl mx-auto text-md md:text-lg text-neutral-600 font-medium leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {heroContent.subtitle || "The first predictive market built on social trust. Turn your instinct into a signal asset. Track your accuracy, climb the leaderboard, and master the signal economy."}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <Link href={heroContent.ctaLink || "/register"}
            className="group relative inline-flex items-center gap-2 px-8 py-2 text-lg font-normal text-white bg-black cursor-pointer rounded-full overflow-hidden shadow-lg hover:bg-black/80 hover:scale-105 transition-all duration-300"
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-black via-neutral-800 to-black"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">{heroContent.ctaText || "Open Position"}</span>
            <IconArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href={heroContent.secondaryCtaLink || "/product/game-modes"}
            className="px-8 py-2 text-lg font-medium text-black bg-white border border-black/10 rounded-full cursor-pointer hover:bg-black/5 hover:scale-105 transition-all duration-300"
          >
            {heroContent.secondaryCtaText || "Explore Markets"}
          </Link>
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
        className="relative mt-20 w-full max-w-7xl px-4 sm:px-8 md:px-0"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 4000 }}
      >
        <div className="relative group mx-auto max-w-5xl">
          {/* Main Mockup Base */}
          <motion.div
            className="relative rounded-[1.5rem] md:rounded-[3rem] border border-black/10 bg-white shadow-2xl overflow-hidden cursor-pointer isolate"
            style={{
              rotateX: mounted ? rotateX : 0,
              rotateY: mounted ? rotateY : 0,
              transformStyle: "preserve-3d",
            }}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="relative bg-linear-to-br from-neutral-50 to-white/80 p-2 md:p-4">
              <div className="relative aspect-[16/10] md:aspect-video rounded-[1rem] md:rounded-[2.5rem] border border-black/5 overflow-hidden shadow-2xl">
                <Image
                  src="/dashboard-mockup.png"
                  alt="Dashboard Preview"
                  fill
                  className="object-cover object-top opacity-90 transition-opacity group-hover:opacity-100"
                  priority
                />
                {/* Visual texture overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.05)_100%)] pointer-events-none" />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none md:hidden" />
              </div>
            </div>

            {/* Shimmer overlay */}
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Floating Elements - Animated to float continuously on mobile */}
          
          {/* Notification / Live Win Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              y: [-5, 5, -5] 
            }}
            transition={{ 
              opacity: { delay: 1.4, duration: 0.8 },
              x: { delay: 1.4, duration: 0.8 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -top-4 left-0 md:-top-6 md:-left-12 z-20 w-[160px] md:w-[240px] p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/50 shadow-xl shadow-black/10 origin-top-left transform scale-90 md:scale-100"
            style={{ 
              transform: "translateZ(80px)",
              rotateY: -5
            }}
          >
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
                <IconTrendingUp className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-black/40 truncate">New Settlement</p>
                <p className="text-xs md:text-sm font-semibold text-black truncate">+ $1,240.00</p>
              </div>
            </div>
          </motion.div>

          {/* Wallet / Balance Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              y: [5, -5, 5] 
            }}
            transition={{ 
              opacity: { delay: 1.6, duration: 0.8 },
              x: { delay: 1.6, duration: 0.8 },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }
            }}
            className="absolute top-[40%] md:top-1/2 right-0 md:-right-16 z-20 w-[140px] md:w-[220px] p-3 md:p-5 rounded-2xl md:rounded-3xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl space-y-2 md:space-y-3 origin-right transform scale-90 md:scale-100"
            style={{ 
              transform: "translateZ(120px) translateY(-50%)",
              rotateY: 8
            }}
          >
            <div className="space-y-0.5 md:space-y-1">
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white/40">Portfolio Value</p>
              <p className="text-lg md:text-2xl font-mono font-bold text-white">$12,450.82</p>
            </div>
            <div className="flex items-center gap-1 md:gap-1.5 text-green-400 text-[10px] md:text-xs font-semibold">
              <IconTrendingUp className="w-3 h-3" />
              +14.2% (24h)
            </div>
          </motion.div>

          {/* User Count / Social Proof Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="absolute -bottom-6 md:-bottom-8 left-1/2 -translate-x-1/2 z-20 px-4 md:px-6 py-2 md:py-3 rounded-full bg-white/80 backdrop-blur-2xl border border-black/10 shadow-lg flex items-center gap-2 md:gap-3 whitespace-nowrap transform scale-90 md:scale-100"
            style={{ transform: "translateZ(60px) translateX(-50%)" }}
          >
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white bg-neutral-200 overflow-hidden relative">
                  <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" fill />
                </div>
              ))}
            </div>
            <span className="text-[10px] md:text-xs font-bold text-black/60 tracking-tight">Active Analysts: <span className="text-black text-xs md:text-sm">12.5K+</span></span>
          </motion.div>
        </div>
        {/* Enhanced Dynamic Reflection */}
        <motion.div
          className="absolute -bottom-24 left-0 right-0 h-40 opacity-20 blur-3xl pointer-events-none transition-all duration-500"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)",
            transform: "scaleY(-0.8)",
          }}
        />

        {/* Decorative Ambient Lights */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />
      </motion.div>
    </section>
  );
}

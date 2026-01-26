'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { Twitter, Github, MessageCircle, Mail, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import Image from "next/image";

// Wave Background Component (without particles)
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
        this.frequency = 0.003 + index * 0.0005;
        this.phase = index * Math.PI * 0.3;
        this.speed = 0.3 + index * 0.1;
        this.yOffset = 60 + index * 30; // Position waves at top
        this.opacity = 0.08 - index * 0.02;
      }

      draw(time: number) {
        ctx!.beginPath();
        ctx!.moveTo(0, 0);

        for (let x = 0; x <= width; x += 3) {
          const y = this.yOffset +
            Math.sin(x * this.frequency + time * this.speed + this.phase) * this.amplitude +
            Math.sin(x * this.frequency * 2 + time * this.speed * 0.7) * (this.amplitude * 0.3);

          if (x === 0) {
            ctx!.moveTo(x, y);
          } else {
            ctx!.lineTo(x, y);
          }
        }

        ctx!.lineTo(width, 0);
        ctx!.lineTo(0, 0);
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
      time += 0.006;
      ctx.clearRect(0, 0, width, height);

      waves.forEach(wave => wave.draw(time));

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
      className="absolute top-0 left-0 w-full h-64 pointer-events-none"
      style={{
        zIndex: 0,
        maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
      }}
    />
  );
}

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Game Modes", href: "#game-modes" },
    { label: "Pricing", href: "#pricing" },
    { label: "Roadmap", href: "#roadmap" },
  ],
  resources: [
    { label: "Documentation", href: "#docs" },
    { label: "API Reference", href: "#api" },
    { label: "Help Center", href: "#help" },
    { label: "Blog", href: "#blog" },
  ],
  company: [
    { label: "About Us", href: "#about" },
    { label: "Careers", href: "#careers" },
    { label: "Contact", href: "#contact" },
    { label: "Press Kit", href: "#press" },
  ],
  legal: [
    { label: "Terms of Service", href: "#terms" },
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Cookie Policy", href: "#cookies" },
    { label: "Responsible Gaming", href: "#responsible" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: MessageCircle, href: "https://discord.com", label: "Discord" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Mail, href: "mailto:hello@antesocial.com", label: "Email" },
];

export function Footer() {
  return (
    <footer className="relative py-16 md:py-20 px-4 md:px-6 bg-gradient-to-b from-neutral-50/30 to-white border-t border-black/5 overflow-hidden">

      {/* Wave Background */}
      <WaveBackground />

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-black/[0.01] via-transparent to-transparent pointer-events-none" style={{ zIndex: 1 }} />

      <div className="relative max-w-7xl mx-auto" style={{ zIndex: 2 }}>

        {/* Top Section - Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 pb-16 border-b border-black/5">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-24 h-24 -mr-4 -ml-6">
                <Image src="/ante-logo.png" alt="Ante Social" fill className="object-contain" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-black">
                ANTE SOCIAL
              </span>
            </Link>

            <p className="text-base text-black/60 font-medium leading-relaxed max-w-md">
              The modern social betting platform for Kenya. M-Pesa ready, crypto enabled,
              built for players who demand transparency and speed.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-sm border border-black/5 flex items-center justify-center hover:bg-white/60 hover:border-black/10 transition-all"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-black/60" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black/90">
              Stay in the Loop
            </h3>
            <p className="text-sm text-black/60 font-medium">
              Get updates on new markets, features, and exclusive promotions.
            </p>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-black/5 focus:border-black/20 focus:bg-white/60 outline-none transition-all text-sm font-medium text-black/90 placeholder:text-black/40"
              />
              <motion.button
                className="px-6 py-3 bg-black text-white rounded-xl font-semibold text-sm hover:bg-black/90 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </div>

            <p className="text-xs text-black/40 font-medium">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>

        {/* Middle Section - Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">

          {/* Product Column */}
          <div>
            <h4 className="text-sm font-semibold text-black/90 uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-black/60 hover:text-black/90 font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-sm font-semibold text-black/90 uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-black/60 hover:text-black/90 font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-sm font-semibold text-black/90 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-black/60 hover:text-black/90 font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-sm font-semibold text-black/90 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-black/60 hover:text-black/90 font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section - Copyright & Meta */}
        <div className="pt-8 border-t border-black/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Copyright */}
            <p className="text-sm text-black/50 font-medium">
              © {new Date().getFullYear()} Ante Social. All rights reserved.
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-black/40 font-semibold uppercase tracking-wider">
                We Accept
              </span>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-white/40 backdrop-blur-sm border border-black/5 rounded-lg">
                  <span className="text-xs font-bold text-black/70">M-PESA</span>
                </div>
                <div className="px-3 py-1.5 bg-white/40 backdrop-blur-sm border border-black/5 rounded-lg">
                  <span className="text-xs font-bold font-mono text-black/70">USDT</span>
                </div>
              </div>
            </div>

            {/* Language Selector (Optional) */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/40 backdrop-blur-sm border border-black/5 rounded-lg cursor-pointer hover:bg-white/60 transition-all">
              <span className="text-xs font-semibold text-black/70">🇰🇪 EN</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5">
          <p className="text-xs text-black/40 font-medium leading-relaxed text-center">
            Gambling can be addictive. Please play responsibly. Ante Social is licensed and regulated
            in Kenya. Players must be 18 years or older. If you or someone you know has a gambling
            problem, please seek help.
          </p>
        </div>
      </div>
    </footer>
  );
}
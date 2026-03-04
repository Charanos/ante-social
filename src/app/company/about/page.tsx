"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import Image from "next/image";
import { useRef } from "react";

// ─── Fade-up wrapper ──────────────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Glass card ──────────────────────────────────────────────────────────────
function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-white/50 backdrop-blur-xl border border-white/70 shadow-[0_2px_12px_rgba(0,0,0,0.05),0_8px_32px_-8px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.88)] ${className}`}
    >
      {/* Top sheen */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.9) 60%, transparent)",
        }}
      />
      {children}
    </div>
  );
}

// ─── Stat item ──────────────────────────────────────────────────────────────
function StatItem({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) {
  return (
    <motion.div
      className="flex flex-col gap-1 border-l border-black/10 pl-5 first:border-l-0 first:pl-0"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-gray-900 leading-none font-mono">
        {value}
      </span>
      <p className="text-[10px] md:text-[11px] font-normal uppercase tracking-[0.2em] text-gray-500 mt-1 font-mono">
        {label}
      </p>
    </motion.div>
  );
}

// ─── Values data ──────────────────────────────────────────────────────────────
const values = [
  {
    num: "01",
    title: "Radical Transparency",
    desc: "Every fee is flat, every outcome is verifiable. No opaque algorithms. No house advantage. The only edge that matters is yours.",
  },
  {
    num: "02",
    title: "Community First",
    desc: "The best predictor wins — not the platform. Our markets amplify collective intelligence and reward genuine foresight.",
  },
  {
    num: "03",
    title: "Borderless by Design",
    desc: "Born in Nairobi. Built for anyone with a take and an internet connection. Local instincts, global reach.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <PageLayout>
      <div className="bg-white overflow-hidden selection:bg-[#E8703A]/30">

        {/* ── Hero Section ── */}
        <section ref={heroRef} className="relative rounded-3xl mt-24 m-6 h-[90vh] min-h-[600px] flex items-end overflow-hidden">
          <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
            <Image
              src="/about-hero.png"
              alt="Nairobi skyline"
              fill
              priority
              className="object-cover scale-110"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-transparent" />
          </motion.div>

          <div className="relative z-10 w-full px-1 md:px-12 pb-16 md:pb-24 max-w-7xl mx-auto">
            <FadeUp delay={0.1}>
              <p className="text-[12px] font-medium uppercase tracking-[0.4em] text-white/70 mb-6 font-mono">
                About Ante Social
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-normal text-white leading-relaxed tracking-tight ">
                Building a market for human instinct.
              </h1>
            </FadeUp>
          </div>
        </section>

        {/* ── Intro Statement ── */}
        <section className="px-6 md:px-12 py-24 md:py-36 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
            <FadeUp className="md:col-span-3 flex md:flex-col items-center md:items-start gap-4 md:pt-3">
              <div className="hidden md:block w-px h-20 bg-black/10" />
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gray-400 font-mono">
                Our Story
              </p>
            </FadeUp>

            <div className="md:col-span-9 space-y-10">
              <FadeUp delay={0.1}>
                <p className="text-[clamp(1.6rem,4vw,2.8rem)] font-normal text-gray-900 leading-[1.15] tracking-tight">
                  In the streets of Nairobi, markets aren&apos;t abstractions — they&apos;re arguments, alliances, and instinct compressed into a moment. We built Ante Social to put that energy online.
                </p>
              </FadeUp>
              <FadeUp delay={0.2}>
                <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl">
                  Every day, millions of people form strong opinions about outcomes — political, sporting, cultural, financial. Those opinions have always been worth something. Now they can earn.
                </p>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ── Chapter 01 ── */}
        <section className="px-6 md:px-12 py-24 md:py-32 max-w-7xl mx-auto border-t border-black/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <FadeUp className="relative order-2 md:order-1">
              <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl">
                <Image
                  src="/stanley-g-mathu-oZGaBqNCm5w-unsplash.jpg"
                  alt="Nairobi context"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-white/60">
                    Chapter 01
                  </span>
                  <p className="text-white text-2xl font-normal mt-1">Roots in Nairobi</p>
                </div>
              </div>

              <GlassCard className="absolute -bottom-6 -right-4 md:-right-8 px-8 py-6 w-48 md:w-56">
                <p className="text-[10px] font-mono font-medium uppercase tracking-widest text-[#E8703A] mb-1">
                  Founded
                </p>
                <p className="text-4xl font-medium text-gray-900 leading-none font-mono">2024</p>
                <p className="text-[12px] text-gray-500 mt-2 font-normal">Nairobi, Kenya</p>
              </GlassCard>
            </FadeUp>

            <div className="space-y-8 order-1 md:order-2">
              <FadeUp>
                <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.3em] text-[#E8703A]">
                  The Origin
                </span>
              </FadeUp>
              <FadeUp delay={0.1}>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900 tracking-tight leading-[1.05]">
                  An observation that wouldn&apos;t go away.
                </h2>
              </FadeUp>
              <FadeUp delay={0.2} className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  The kibanda debates, the WhatsApp group predictions, the collective certainty people feel before results come in — that conviction is the raw material of markets.
                </p>
                <p>
                  Platforms designed for extraction, not participation. We looked at that and decided to go in the opposite direction entirely.
                </p>
              </FadeUp>
              <FadeUp delay={0.3}>
                <div className="pl-6 border-l-2 border-[#E8703A]/30 py-2">
                  <p className="text-2xl font-normal text-gray-800 leading-snug italic">
                    &quot;Why can&apos;t online markets feel as alive as the real thing?&quot;
                  </p>
                  <p className="text-[11px] text-gray-400 mt-4 font-mono uppercase tracking-[0.2em]">
                    — The question that started everything
                  </p>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ── Chapter 02 ── */}
        <section className="px-6 md:px-12 py-24 md:py-32 max-w-7xl mx-auto border-t border-black/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-8">
              <FadeUp>
                <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.3em] text-[#E8703A]">
                  The Approach
                </span>
              </FadeUp>
              <FadeUp delay={0.1}>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900 tracking-tight leading-[1.05]">
                  Leave only the instinct.
                </h2>
              </FadeUp>
              <FadeUp delay={0.2} className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  We built a space where your read of the room is the product. No complex odds. No house edge. Just pure game theory.
                </p>
              </FadeUp>
              <FadeUp delay={0.3}>
                <div className="grid grid-cols-2 gap-y-10 gap-x-4 pt-6">
                  {[
                    { value: "6", label: "Market formats" },
                    { value: "5%", label: "Platform fee" },
                    { value: "<5m", label: "Settlement" },
                    { value: "24/7", label: "Live Pulse" },
                  ].map((s, i) => (
                    <StatItem key={s.label} value={s.value} label={s.label} index={i} />
                  ))}
                </div>
              </FadeUp>
            </div>

            <FadeUp delay={0.2} className="relative">
              <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl">
                <Image
                  src="/michael-kyule-e_xHMHnZYO8-unsplash.jpg"
                  alt="Human intuition"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 right-8 text-right">
                  <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-white/60">
                    Chapter 02
                  </span>
                  <p className="text-white text-2xl font-normal mt-1">The Human Element</p>
                </div>
              </div>
              <GlassCard className="absolute -top-6 -left-4 md:-left-8 px-8 py-5">
                <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[#E8703A] mb-1">
                  Powered by
                </p>
                <p className="text-lg font-medium text-gray-900 leading-tight">
                  Collective Intelligence
                </p>
              </GlassCard>
            </FadeUp>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="px-6 md:px-12 py-24 md:py-36 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start mb-20">
              <FadeUp className="md:col-span-3">
                <div className="flex md:flex-col items-center md:items-start gap-5 md:pt-2">
                  <div className="hidden md:block w-px h-16 bg-[#E8703A]/20" />
                  <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gray-400 font-mono">
                    Our Values
                  </p>
                </div>
              </FadeUp>
              <FadeUp delay={0.1} className="md:col-span-9">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900 tracking-tight leading-[1.05]">
                  The things we will
                  <br />
                  never compromise on.
                </h2>
              </FadeUp>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <FadeUp key={v.num} delay={0.08 + i * 0.1}>
                  <GlassCard className="h-full p-10 flex flex-col gap-8 hover:border-[#E8703A]/30 transition-colors group">
                    <span className="text-[11px] font-mono font-semibold text-[#E8703A] tracking-[0.3em] uppercase">
                      {v.num}
                    </span>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-normal text-gray-900 tracking-tight group-hover:text-black transition-colors">
                        {v.title}
                      </h3>
                      <p className="text-[15px] text-gray-500 leading-relaxed">
                        {v.desc}
                      </p>
                    </div>
                  </GlassCard>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

       {/* ══════════════════════════════════════════════
            CTA BANNER — clean, dark, no gradient gimmicks
        ══════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-24 md:py-32 max-w-7xl mx-auto">
          <FadeUp>
            <div
              className="relative rounded-[2.5rem] overflow-hidden px-10 md:px-20 py-16 md:py-24"
              style={{ background: "rgba(0,0,0,0.88)" }}
            >
              {/* Subtle inner top sheen */}
              <div
                className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.12) 60%, transparent)",
                }}
              />

              {/* Plus bg inside dark card */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
                    `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><line x1="24" y1="20" x2="24" y2="28" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/><line x1="20" y1="24" x2="28" y2="24" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/></svg>`
                  )}")`,
                  backgroundSize: "48px 48px",
                }}
              />

              <div className="relative z-10">
                <p className="text-[13px] font-mono font-normal uppercase tracking-[0.3em] text-white/75 mb-6">
                  The beginning
                </p>
                <h2
                  className="text-[clamp(2rem,5vw,3.8rem)] font-normal text-white leading-[1.05] tracking-tight mb-8"
                >
                  The people who join now write the story.
                </h2>
                <p className="text-[16px] text-white/80 leading-relaxed mb-10">
                  We are still early. The markets are open. The crowd is forming. If you have a take, this is where it belongs.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <motion.a
                    href="/register"
                    className="inline-flex items-center gap-3 px-8 py-2 rounded-full bg-white text-black text-[15px] font-medium tracking-wide cursor-pointer no-underline"
                    style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create your account
                  </motion.a>
                  <span className="text-[12px] font-mono uppercase tracking-widest text-white/55">
                    M-Pesa · USDT · Free to join
                  </span>
                </div>
              </div>
            </div>
          </FadeUp>
        </section>
      </div>
    </PageLayout>
  );
}
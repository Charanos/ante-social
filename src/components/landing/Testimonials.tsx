"use client";

import { motion } from "framer-motion";
import { IconInfoCircle, IconMessageShare, IconStar } from '@tabler/icons-react';

import Marquee from "react-fast-marquee";

const testimonials = [
  // ... existing testimonials ...
  {
    text: "Finally, a betting platform that feels like a game, not a scam. The Betrayal Game is absolute chaos in the best way possible.",
    author: "Alex K.",
    role: "High Roller",
    location: "Nairobi",
    stats: { wins: "127", streak: "12" },
    initial: "A",
  },
  {
    text: "M-Pesa integration is seamless. Deposit in 45 seconds, withdraw just as fast. The glassmorphic UI is incredibly polished.",
    author: "Sarah M.",
    role: "Novice",
    location: "Mombasa",
    stats: { wins: "43", streak: "5" },
    initial: "S",
  },
  {
    text: "I created a private group for my friends. We bet on everything now - from sports to who's arriving late. Winner Takes All is brilliant.",
    author: "Mike O.",
    role: "High Roller",
    location: "Kisumu",
    stats: { wins: "89", streak: "8" },
    initial: "M",
  },
  {
    text: "The Reflex Reaction Test is addictive. 5 seconds to predict the crowd's instinct - it's pure adrenaline. Love the 2x multiplier tiers.",
    author: "Grace W.",
    role: "Novice",
    location: "Nakuru",
    stats: { wins: "56", streak: "7" },
    initial: "G",
  },
  {
    text: "Transparent fees, immutable audit logs, 2FA security. This is how betting platforms should be built. No hidden surprises.",
    author: "James N.",
    role: "High Roller",
    location: "Eldoret",
    stats: { wins: "203", streak: "15" },
    initial: "J",
  },
  {
    text: "Poll-style markets are my favorite. Pro-rata payouts feel fair, and the integrity weighting system prevents manipulation. Well designed.",
    author: "Linda A.",
    role: "Novice",
    location: "Nairobi",
    stats: { wins: "38", streak: "4" },
    initial: "L",
  },
];

function TestimonialCard({ testimonial, index }: any) {
  return (
    <div className="w-[380px] shrink-0 px-3">
      <div className="relative h-full min-h-[400px] justify-between p-6 md:p-8 rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 hover:border-black/10 hover:bg-white/60 transition-all duration-500 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.12)] flex flex-col group">
        {/* Subtle shine effect on hover */}
        <div className="absolute inset-0 bg-linear-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

        {/* Top border accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Quote Icon */}
          <IconMessageShare className="w-8 h-8 text-black/10 mb-6" />

          {/* Testimonial Text */}
          <p className="text-base md:text-lg text-black/70 font-medium leading-relaxed mb-6 flex-1">
            "{testimonial.text}"
          </p>

          {/* Author Info */}
          <div className="pt-6 border-t border-black/5 mt-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-black/5 backdrop-blur-sm flex items-center justify-center border border-black/10 font-semibold text-black/70">
                {testimonial.initial}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-black/90">
                  {testimonial.author}
                </div>
                <div className="text-xs text-black/50 font-medium">
                  {testimonial.role} • {testimonial.location}
                </div>
              </div>
            </div>

            {/* Stats Pills */}
            <div className="flex items-center gap-2 justify-start">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/40 backdrop-blur-sm border border-black/5 rounded-full">
                <span className="text-xs font-semibold text-black/40 uppercase tracking-wider">
                  Wins
                </span>
                <span className="text-xs font-semibold font-mono text-black/70">
                  {testimonial.stats.wins}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/40 backdrop-blur-sm border border-black/5 rounded-full">
                <span className="text-xs font-semibold text-black/40 uppercase tracking-wider">
                  Streak
                </span>
                <span className="text-xs font-semibold font-mono text-black/70">
                  {testimonial.stats.streak}x
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="relative py-24 md:py-32 px-4 md:px-6 bg-linear-to-b from-white via-neutral-50/30 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--tw-gradient-stops))] from-black/2 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20 text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-black/5 rounded-full shadow-sm mb-4">
            <IconStar className="w-4 h-4 text-black/60" />
            <span className="text-sm font-semibold text-black/70">
              Trusted by Players
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-black/90 leading-[1.1]">
            What Players Are Saying
          </h2>
          <p className="text-base md:text-lg text-black/60 font-medium max-w-2xl mx-auto leading-relaxed">
            Join thousands of Kenyan bettors who've found their new home on Ante
            Social.
          </p>
        </motion.div>

        {/* Infinite Scroll Container */}
        <div className="relative w-full overflow-hidden">
          {/* Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Track */}
          <Marquee
            gradient={false}
            speed={40}
            pauseOnHover={true}
            autoFill={true}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.author}-${index}`}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </Marquee>
        </div>

        {/* Social Proof Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 md:mt-20"
        >
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 p-8 md:p-10 rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold font-mono text-black/90 mb-1">
                12.5K+
              </div>
              <div className="text-sm text-black/50 font-semibold uppercase tracking-wider">
                Active Players
              </div>
            </div>
            <div className="w-px bg-black/5 hidden md:block" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold font-mono text-black/90 mb-1">
                KSH 8.2M
              </div>
              <div className="text-sm text-black/50 font-semibold uppercase tracking-wider">
                Total Volume
              </div>
            </div>
            <div className="w-px bg-black/5 hidden md:block" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold font-mono text-black/90 mb-1">
                98%
              </div>
              <div className="text-sm text-black/50 font-semibold uppercase tracking-wider">
                Trust Score
              </div>
            </div>
            <div className="w-px bg-black/5 hidden md:block" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold font-mono text-black/90 mb-1">
                342
              </div>
              <div className="text-sm text-black/50 font-semibold uppercase tracking-wider">
                Markets Live
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

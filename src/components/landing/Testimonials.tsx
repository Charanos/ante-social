"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    text: "Finally, a betting platform that feels like a game, not a scam. The Betrayal Game is absolute chaos in the best way.",
    author: "Alex R.",
    handle: "@strategy_king",
    initial: "A",
    color: "bg-blue-100 text-blue-700",
  },
  {
    text: "The UI is stunning. It's like if Apple designed a casino. Smooth, clean, and incredibly addictive.",
    author: "Sarah J.",
    handle: "@design_enthusiast",
    initial: "S",
    color: "bg-purple-100 text-purple-700",
  },
  {
    text: "I love that I can create my own markets for my friend group. We use it for everything now.",
    author: "Mike T.",
    handle: "@group_chat_admin",
    initial: "M",
    color: "bg-orange-100 text-orange-700",
  },
];

export function Testimonials() {
  return (
    <section className="py-32 px-6 bg-white border-t border-neutral-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-black mb-6">
            Player Stories
          </h2>
          <p className="text-neutral-500 text-lg font-medium">
            Join thousands of players who have found their new home.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-white border border-neutral-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-neutral-200 mb-6" />
              <p className="text-lg text-neutral-700 font-medium leading-relaxed mb-8">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${t.color}`}>
                  {t.initial}
                </div>
                <div>
                  <div className="text-black font-medium">{t.author}</div>
                  <div className="text-neutral-400 text-sm font-medium">{t.handle}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

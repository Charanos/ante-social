"use client";

import { motion } from "framer-motion";
import { Trophy, Wallet, Users, BarChart3, ArrowUpRight } from "lucide-react";

const features = [
  {
    title: "Public Betting Markets",
    description:
      "Create and join poll-style prediction markets. You set the odds, you run the market.",
    icon: BarChart3,
    className: "md:col-span-2",
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    title: "Real Money Betting",
    description:
      "Secure deposits with M-Pesa and Crypto. Transparent tier-based limits for safe betting.",
    icon: Wallet,
    className: "md:col-span-1",
    iconBg: "bg-green-50 text-green-600",
  },
  {
    title: "Daily Leaderboards",
    description:
      "Join the Hall of the Unreasonably Lucky. Compete for top ranks.",
    icon: Trophy,
    className: "md:col-span-1",
    iconBg: "bg-yellow-50 text-yellow-600",
  },
  {
    title: "Community Driven",
    description: "A social platform where reputation is everything.",
    icon: Users,
    className: "md:col-span-2",
    iconBg: "bg-purple-50 text-purple-600",
  },
];

export function FeatureGrid() {
  return (
    <section
      id="features"
      className="py-24 px-6 bg-white relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-8"
        >
          <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-black">
            Everything you need to win.
          </h2>
          <p className="text-neutral-600 text-lg font-medium max-w-2xl mx-auto">
            Powerful tools designed for the modern bettor.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className={`group relative p-8 rounded-2xl bg-white shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-neutral-100 hover:shadow-lg transition-all duration-300 cursor-pointer ${feature.className}`}
            >
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="space-y-6">
                  {/* Dashboard-style Icon Box */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${feature.iconBg}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-black tracking-tight mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-500 text-sm font-medium leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-2 text-sm font-medium text-black/40 group-hover:text-black transition-colors">
                  Learn more <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

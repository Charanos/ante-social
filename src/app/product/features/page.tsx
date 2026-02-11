
"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconTrophy, IconUsers, IconWallet, IconChartBar, IconShieldCheck, IconBolt, IconArrowRight } from "@tabler/icons-react";
import { MouseEvent } from "react";

const features = [
  {
    icon: IconTrophy,
    title: "Competitive Betting",
    description: "Engage in poll-style markets where your knowledge pays off. From sports to pop culture, if there's an opinion, there's a market.",
    colSpan: "md:col-span-12 lg:col-span-8",
    color: "from-yellow-400/20 to-orange-500/20",
  },
  {
    icon: IconUsers,
    title: "Social Interaction",
    description: "Betting is better with friends. Create private groups, challenge your circle, and prove who really knows best.",
    colSpan: "md:col-span-12 lg:col-span-4",
    color: "from-blue-400/20 to-indigo-500/20",
  },
  {
    icon: IconWallet,
    title: "Virtual Economy",
    description: "Play with Ante Points (AP) or real currency. Our dual-wallet system lets you practice risk-free or play for keeps.",
    colSpan: "md:col-span-12 lg:col-span-4",
    color: "from-green-400/20 to-emerald-500/20",
  },
  {
    icon: IconChartBar,
    title: "Live Analytics",
    description: "Track market trends in real-time. See where the community sentiment lies and make informed decisions before you weigh in.",
    colSpan: "md:col-span-12 lg:col-span-8",
    color: "from-purple-400/20 to-pink-500/20",
  },
  {
    icon: IconShieldCheck,
    title: "Secure & Transparent",
    description: "Built on a trustless architecture. Smart contracts ensure every outcome is verified and every payout is guaranteed.",
    colSpan: "md:col-span-12 lg:col-span-6",
    color: "from-cyan-400/20 to-blue-500/20",
  },
  {
    icon: IconBolt,
    title: "Instant Settlements",
    description: "No more waiting days for your winnings. Markets settle automatically upon verification, and funds are available immediately.",
    colSpan: "md:col-span-12 lg:col-span-6",
    color: "from-red-400/20 to-orange-500/20",
  },
];

function FeatureCard({ feature, index }: { feature: any; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`group relative ${feature.colSpan} flex flex-col`}
      onMouseMove={handleMouseMove}
    >
      <div className="relative h-full p-8 md:p-10 rounded-[2.5rem] bg-white border border-neutral-100/80 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group-hover:-translate-y-1">
         {/* Gradient Blob on Hover */}
         <motion.div
            className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  650px circle at ${mouseX}px ${mouseY}px,
                  rgba(0,0,0,0.03),
                  transparent 80%
                )
              `,
            }}
          />
          
         {/* Ambient Background Color */}
         <div className={`absolute top-0 right-0 w-64 h-64 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-100 blur-[80px] transition-opacity duration-700 pointer-events-none`} />

         <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center border border-black/5 mb-8 group-hover:scale-110 transition-transform duration-500">
                <feature.icon className="w-8 h-8 text-black/80" />
            </div>
            
            <h3 className="text-2xl font-medium text-black mb-4 tracking-tight">
                {feature.title}
            </h3>
            
            <p className="text-lg text-neutral-500 font-medium leading-relaxed max-w-lg">
                {feature.description}
            </p>
            
            <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-black opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                Learn more <IconArrowRight className="w-4 h-4" />
            </div>
         </div>
      </div>
    </motion.div>
  );
}

export default function FeaturesPage() {
  return (
    <PageLayout>
      <PageHeader 
        title="Features built for the modern bettor."
        description="Everything you need to analyze, predict, and win. Packed into a sleek, intuitive interface designed for speed and clarity."
      />

      <section className="bg-white/50 backdrop-blur-3xl border-y border-black/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="Core Capabilities" className="mb-12" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {features.map((feature, index) => (
                <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
         <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto rounded-[3rem] bg-black text-white p-12 md:p-24 text-center relative overflow-hidden"
         >
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-neutral-800 to-transparent opacity-50 pointer-events-none" />
             
             {/* Decorative circles */}
             <div className="absolute top-10 left-10 w-32 h-32 border border-white/10 rounded-full opacity-50" />
             <div className="absolute bottom-10 right-10 w-64 h-64 border border-white/5 rounded-full opacity-50" />

             <div className="relative z-10 space-y-8">
                 <h2 className="text-3xl md:text-5xl font-medium tracking-tight">Ready to experience the future?</h2>
                 <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                     Join thousands of players who have already switched to Ante Social. Experience betting re-imagined.
                 </p>
                 <div className="pt-4">
                    <a href="/register" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-black rounded-full font-medium text-lg hover:bg-neutral-200 hover:scale-105 transition-all shadow-xl hover:shadow-2xl hover:shadow-white/10">
                        Get Started Now <IconArrowRight className="w-5 h-5" />
                    </a>
                 </div>
             </div>
         </motion.div>
      </section>
    </PageLayout>
  );
}

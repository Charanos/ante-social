"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader"; // Assuming this exists or using the common one
import { IconUsersGroup, IconChartDots3, IconConfetti, IconChartDots, IconShieldCheck, IconArrowRight, IconWorldWww } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Feature Data
const features = [
  {
    title: "Social Betting",
    description: "Create private groups, challenge friends, and turn every match into a rivalry. It's not just about winning; it's about bragging rights.",
    icon: IconUsersGroup,
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
    bg: "bg-orange-50",
    text: "text-orange-900",
    border: "border-orange-100",
    gradient: "from-orange-500/10 to-transparent"
  },
  {
    title: "Instant Settlements",
    description: "Smart contracts ensure payouts happen the second the whistle blows. No delays, no disputes.",
    icon: IconConfetti,
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
    bg: "bg-neutral-900",
    text: "text-white",
    border: "border-neutral-800",
    gradient: "from-white/10 to-transparent"
  },
  {
    title: "Global Markets",
    description: "From the Premier League to the NBA, Esports to Politics. If it's happening, you can bet on it.",
    icon: IconWorldWww,
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
    bg: "bg-white",
    text: "text-neutral-900",
    border: "border-neutral-200",
    gradient: "from-neutral-500/5 to-transparent"
  },
  {
    title: "Live Analytics",
    description: "Real-time odds, possession stats, and momentum trackers. Make informed decisions while the action unfolds.",
    icon: IconChartDots,
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
    bg: "bg-stone-100", // Warm grey
    text: "text-stone-800",
    border: "border-stone-200",
    gradient: "from-stone-500/10 to-transparent"
  },
  {
    title: "Secure & Transparent",
    description: "Built on blockchain technology. Every transaction is verifiable, every outcome is immutable.",
    icon: IconShieldCheck,
    colSpan: "col-span-1 md:col-span-3 lg:col-span-3",
    bg: "bg-stone-50", 
    text: "text-neutral-900",
    border: "border-neutral-200",
    gradient: "from-stone-500/10 to-transparent"
  }
];

function BentoCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "group relative rounded-[2rem] overflow-hidden border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1",
        feature.colSpan,
        feature.bg,
        feature.border
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Hover Gradient */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.1),
              transparent 80%
            )
          `,
        }}
      />

      {/* Decorative Gradient Blob */}
      <div className={cn(
        "absolute top-0 right-0 w-64 h-64 bg-gradient-to-br opacity-50 blur-[80px] pointer-events-none",
        feature.gradient
      )} />

      <div className="relative p-8 h-full flex flex-col justify-between z-10">
        <div className="mb-8">
            <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center border mb-6 transition-transform duration-500 group-hover:scale-110",
                feature.text === "text-white" 
                    ? "bg-white/10 border-white/10 text-white" 
                    : "bg-black/5 border-black/5 text-black"
            )}>
                <feature.icon className="w-6 h-6" />
            </div>
            
            <h3 className={cn("text-2xl font-medium mb-3 tracking-tight", feature.text)}>
                {feature.title}
            </h3>
            
            <p className={cn(
                "text-base font-medium leading-relaxed max-w-xl",
                feature.text === "text-white" ? "text-white/60" : "text-black/60"
            )}>
                {feature.description}
            </p>
        </div>

        {/* Decorative pattern for "African" feel on large card */}
        {feature.title === "Secure & Transparent" && (
             <div className="absolute right-0 bottom-0 opacity-10">
                {/* SVG pattern remains */}
                <svg width="300" height="150" viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 150L50 100L100 150H0Z" fill="currentColor"/>
                    <path d="M100 150L150 100L200 150H100Z" fill="currentColor"/>
                    <path d="M200 150L250 100L300 150H200Z" fill="currentColor"/>
                    <path d="M50 100L100 50L150 100H50Z" fill="currentColor"/>
                    <path d="M150 100L200 50L250 100H150Z" fill="currentColor"/>
                </svg>
            </div>
        )}
      </div>
    </motion.div>
  );
}

export default function FeaturesPage() {
  return (
    <PageLayout>
      <PageHeader
        title="The Architecture of Play"
        description="Experience the future of social betting. Where community meets competition."
      />

      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
          {features.map((feature, index) => (
            <BentoCard key={index} feature={feature} index={index} />
          ))}
        </div>
        
        {/* Call to Action */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 relative overflow-hidden rounded-[2.5rem] bg-neutral-900 border border-neutral-800"
         >
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-neutral-800 to-transparent opacity-50 pointer-events-none" />
             
             

             <div className="relative z-10 space-y-8 p-12 md:p-24 text-center">
                 <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6">Ready to experience the future?</h2>
                 <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
                     Join thousands of players who have already switched to Ante Social. Experience betting re-imagined.
                 </p>
                 <Link href="/register" className="pt-4 flex justify-center">
                    <div className="inline-flex items-center gap-2 px-10 py-2 bg-white text-black rounded-full font-medium text-lg hover:bg-neutral-200 hover:scale-105 transition-all shadow-xl hover:shadow-2xl hover:shadow-white/10 cursor-pointer">
                        Get Started Now <IconArrowRight className="w-5 h-5" />
                    </div>
                 </Link>
             </div>
         </motion.div>
      </section>
    </PageLayout>
  );
}

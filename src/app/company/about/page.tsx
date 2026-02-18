
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import Image from "next/image";
import { PageHeader } from "@/components/landing/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useRef } from "react";
import { IconEyeCheck, IconHeartHandshake, IconGlobe } from "@tabler/icons-react";

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <PageLayout>
      <PageHeader
        title="We're not just a platform."
        description="Ante Social is a movement. Born in Nairobi, built for the world. We are rewriting the rules of social markets."
      />

      <section ref={containerRef} className="py-24 px-6 max-w-7xl mx-auto space-y-32">
        
        {/* Chapter 1: The Origin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-neutral-100 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700"
            >
                <Image 
                    src="/stanley-g-mathu-oZGaBqNCm5w-unsplash.jpg"
                    alt="Nairobi Cityscape" 
                    fill 
                    className="object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                    <p className="font-mono text-sm uppercase tracking-widest opacity-80 mb-2">Chapter 01</p>
                    <h3 className="text-3xl font-medium">Roots in the City</h3>
                </div>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
            >
                <h2 className="text-4xl md:text-5xl font-medium text-black tracking-tight leading-[1.1]">
                    It started with a simple observation.
                </h2>
                <div className="space-y-6 text-lg text-neutral-600 font-medium leading-relaxed">
                    <p>
                        In the bustling streets of Nairobi, trading isn't a solitary act—it's a communal event. It's the banter at the local kibanda, the debates in WhatsApp groups, the collective roar when a goal is scored.
                    </p>
                    <p>
                        Yet, digital platforms felt cold and isolated. Usernames without faces, numbers without context. We asked ourselves: <span className="text-black font-semibold">Why can't online markets feel as alive as the real thing?</span>
                    </p>
                </div>
            </motion.div>
        </div>

        {/* Chapter 2: The Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center md:flex-row-reverse">
             <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8 md:order-2"
            >
                <h2 className="text-4xl md:text-5xl font-medium text-black tracking-tight leading-[1.1]">
                    Stripping away the complexity.
                </h2>
                <div className="space-y-6 text-lg text-neutral-600 font-medium leading-relaxed">
                    <p>
                        We believed that the future of prediction markets wasn't in complex algorithm-driven odds, but in <strong>human intuition</strong>.
                    </p>
                    <p>
                        So we built Ante Social. A place where you don't just bet against the house—you bet with friends, challenge rivals, and prove your knowledge. We made it social, transparent, and undeniably fun.
                    </p>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-neutral-100 shadow-2xl -rotate-3 hover:rotate-0 transition-transform duration-700 md:order-1"
            >
                <Image 
                    src="/michael-kyule-e_xHMHnZYO8-unsplash.jpg"
                    alt="Friends chilling" 
                    fill 
                    className="object-cover" 
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 right-8 text-white text-right">
                    <p className="font-mono text-sm uppercase tracking-widest opacity-80 mb-2">Chapter 02</p>
                    <h3 className="text-3xl font-medium">The Human Element</h3>
                </div>
            </motion.div>
        </div>

        {/* Core Values */}
        <div className="py-12">
            <SectionHeading title="Our Core Values" className="mb-16" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { 
                        title: "Radical Transparency", 
                        desc: "No hidden fees, no opaque algorithms. Smart contracts ensure every outcome is verifiable and fair." 
                    },
                    { 
                        title: "Community First", 
                        desc: "The house doesn't win here—the best predictor does. Our markets are driven by collective wisdom." 
                    },
                    { 
                        title: "Borderless Ambition", 
                        desc: "Born in Kenya, but built for the world. We are bridging the gap between local insights and global markets." 
                    }
                ].map((value, i) => (
                    <motion.div
                        key={value.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-10 rounded-[2.5rem] bg-neutral-50 border border-neutral-100 hover:border-black/5 hover:bg-white hover:shadow-xl transition-all duration-500 group"
                    >
                        <h3 className="text-2xl font-medium mb-4 text-black">{value.title}</h3>
                        <p className="text-neutral-600 font-medium leading-relaxed text-lg">{value.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
        
        {/* The Future CTA */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[3rem] bg-black text-white p-12 md:p-13 text-center relative overflow-hidden"
        >
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-800 to-black opacity-50" />
             <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
             <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/20 rounded-full blur-[100px]" />

             <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <h2 className="text-5xl font-medium tracking-loose leading-[1.1]">
                    Ready to change  the game?
                </h2>
                <p className="text-xl text-neutral-400 font-normal leading-relaxed">
                    We are just getting started. Be part of the story as we redefine what it means to win together.
                </p>
                <div className="pt-8">
                     <a href="/register" className="cursor-pointer inline-flex items-center justify-center px-10 py-2 bg-white text-black rounded-full font-semibold  text-lg hover:bg-neutral-200 transition-colors shadow-lg hover:shadow-2xl">
                        Create your account
                     </a>
                </div>
             </div>
        </motion.div>

      </section>
    </PageLayout>
  );
}

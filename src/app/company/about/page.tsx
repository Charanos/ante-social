
"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import Image from "next/image";
import { PageHeader } from "@/components/landing/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function AboutPage() {
  return (
    <PageLayout>
      <PageHeader
        title="The future of social betting."
        description="Ante Social was born from a simple idea: betting should be fun, fair, and social. We're stripping away the complexity of traditional sportsbooks."
      />

      <section className="pb-24 px-6 max-w-7xl mx-auto space-y-24">
        
        {/* Mission Section with Split Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <SectionHeading title="Our Mission" />
            <h2 className="text-3xl md:text-5xl font-medium text-black leading-tight">
              Built for Kenya, <br/>
              Ready for the World.
            </h2>
            <div className="space-y-6 text-lg text-neutral-600 font-medium leading-relaxed">
              <p>
                We understand the unique pulse of the Kenyan market. That's why we've 
                integrated M-PESA deeply into our core, ensuring seamless transactions 
                that feel native to your daily life.
              </p>
              <p>
                But our ambition doesn't stop here. We're building a global platform 
                where friends from Nairobi to New York can challenge each other, 
                share insights, and win together.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-[3rem] overflow-hidden bg-neutral-100 border border-black/5 shadow-2xl"
          >
             <Image 
               src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2560&auto=format&fit=crop" 
               alt="Team working together" 
               fill 
               className="object-cover" 
             />
             <div className="absolute inset-0 bg-black/10" />
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { title: "Transparency First", desc: "No hidden algorithms. Our smart contracts and open order books mean you always know the true odds." },
                { title: "Community Driven", desc: "The house doesn't set the lines—you do. Markets move based on collective wisdom, not corporate interests." },
                { title: "Speed Matters", desc: "Instant deposits, instant settlements, instant withdrawals. Your money moves as fast as you do." }
            ].map((value, i) => (
                <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-10 rounded-[2.5rem] bg-white border border-neutral-100 hover:border-black/10 transition-colors shadow-sm"
                >
                    <h3 className="text-2xl font-medium mb-4 text-black">{value.title}</h3>
                    <p className="text-neutral-600 font-medium leading-relaxed">{value.desc}</p>
                </motion.div>
            ))}
        </div>
      </section>
    </PageLayout>
  );
}

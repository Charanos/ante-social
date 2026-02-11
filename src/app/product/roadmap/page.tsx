
"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { IconCircleCheck, IconCircleDashed } from "@tabler/icons-react";

const roadmapItems = [
  {
    quarter: "Q1 2026",
    status: "completed",
    title: "Platform Foundation",
    items: [
      "Platform Launch Beta",
      "Poll-Style Markets",
      "M-Pesa Integration",
      "Basic User Profiles"
    ]
  },
  {
    quarter: "Q2 2026",
    status: "active",
    title: "Social Expansion",
    items: [
      "Series A Smart Contracts",
      "The Betrayal Game Mode",
      "Dark Mode V2",
      "Private Group Chats"
    ]
  },
  {
    quarter: "Q3 2026",
    status: "upcoming",
    title: "Mobile & Speed",
    items: [
      "Mobile App (iOS & Android)",
      "Reflex Reaction Game Mode",
      "In-app Currency Exchange",
      "Creator Tools for Markets"
    ]
  },
  {
    quarter: "Q4 2026",
    status: "upcoming",
    title: "Ecosystem Growth",
    items: [
      "Global Expansion",
      "API Public Access",
      "Advanced Analytics Dashboard",
      "Community Governance"
    ]
  }
];

export default function RoadmapPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Product Roadmap"
        description="We're just getting started. Here's a look at where we've been and where we're going next."
      />

      <section className="pb-24 px-6 max-w-5xl mx-auto">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-200 md:left-1/2 md:-ml-px" />

          <div className="space-y-20">
            {roadmapItems.map((period, index) => (
              <motion.div 
                key={period.quarter}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col md:flex-row gap-8 md:gap-16 relative ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-[-5px] md:left-1/2 md:-ml-[5px] top-6 w-[11px] h-[11px] rounded-full bg-white border-2 border-black z-10">
                    {period.status === "active" && <div className="absolute inset-0 bg-black animate-ping opacity-20 rounded-full" />}
                </div>

                {/* Date Label (Desktop) - Appears on opposite side of card */}
                <div className={`hidden md:flex flex-1 items-start pt-4 ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                     <span className="text-sm font-semibold text-neutral-400 uppercase tracking-widest">{period.quarter}</span>
                </div>

                {/* Content Card */}
                <div className="flex-1 pl-8 md:pl-0">
                  <div className={`p-8 rounded-3xl bg-neutral-50/50 border border-neutral-200/60 hover:border-black/5 hover:bg-white hover:shadow-xl transition-all duration-300`}>
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="text-xl font-medium text-black">{period.title}</h3> 
                       <span className="md:hidden text-xs font-semibold text-neutral-400 uppercase tracking-widest">{period.quarter}</span>
                       {period.status === "active" && (
                         <span className="hidden md:block px-3 py-1 text-[10px] font-medium bg-black text-white rounded-full uppercase tracking-widest">
                             Current Focus
                         </span>
                       )}
                    </div>
                    
                    <ul className="space-y-4">
                      {period.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <IconCircleCheck className={`w-5 h-5 shrink-0 ${period.status === "completed" ? "text-black" : "text-neutral-300"}`} />
                          <span className={`${period.status === "upcoming" ? "text-neutral-500" : "text-neutral-700"} font-medium`}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

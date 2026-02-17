
"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconRocket, IconSearch, IconArrowRight, IconCode, IconLifebuoy, IconTerminal2, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const docCategories = [
  {
    icon: IconRocket,
    title: "Getting Started",
    description: "Everything you need to know to place your first bet.",
    links: ["How to Play", "Account Setup", "Deposits & Withdrawals"],
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-100"
  },
  {
    icon: IconCode,
    title: "Platform Rules",
    description: "Understanding market types, settlement, and fair play.",
    links: ["Poll Markets", "The Betrayal Game", "Platform Fees"],
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100"
  },
  {
    icon: IconTerminal2,
    title: "For Developers",
    description: "Integrate with the Ante Social API and build custom tools.",
    links: ["API Reference", "Webhooks", "Authentication"],
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-100"
  },
  {
    icon: IconLifebuoy,
    title: "Support",
    description: "Troubleshooting and getting help when you need it.",
    links: ["FAQ", "Contact Support", "Dispute Resolution"],
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-100"
  }
];

export default function DocsPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Documentation"
        description="Your guide to mastering the platform. From basic betting to advanced strategies."
      >
        <div className="relative max-w-xl mx-auto mt-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search documentation..." 
                  className="w-full px-6 py-4 pl-12 rounded-full bg-white border border-black/5 shadow-lg focus:outline-none focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all text-lg font-medium placeholder:text-neutral-400"
                />
                <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5 group-hover:text-black transition-colors" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-neutral-100 text-xs font-semibold text-neutral-500 border border-neutral-200">
                    ⌘ K
                </div>
            </div>
        </div>
      </PageHeader>

      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {docCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-[2rem] bg-white border border-neutral-100 hover:border-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
               <div className={cn("absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10", category.color)}>
                  <category.icon className="w-32 h-32 rotate-12" />
               </div>

              <div className="flex flex-col h-full relative z-10">
                <div className="flex items-start justify-between mb-6">
                    <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-500 group-hover:scale-110",
                        category.bg,
                        category.border
                    )}>
                      <category.icon className={cn("w-7 h-7", category.color)} />
                    </div>
                    <div className="p-2 rounded-full hover:bg-neutral-50 transition-colors cursor-pointer group/arrow">
                        <IconArrowRight className="w-5 h-5 text-neutral-400 group-hover/arrow:text-black transition-colors" />
                    </div>
                </div>
                
                <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-black mb-2 tracking-tight group-hover:text-orange-900 transition-colors">{category.title}</h3>
                    <p className="text-neutral-500 font-medium leading-relaxed">{category.description}</p>
                </div>
                
                <div className="mt-auto space-y-1">
                    {category.links.map((link) => (
                      <a 
                        key={link} 
                        href="#" 
                        className="flex items-center justify-between px-4 py-3 -mx-4 rounded-xl text-neutral-600 hover:text-black hover:bg-neutral-50 transition-all group/link"
                      >
                        <span className="font-medium">{link}</span>
                        <IconChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-neutral-400" />
                      </a>
                    ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Support CTA */}
        <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mt-16 p-8 rounded-3xl bg-neutral-50 border border-neutral-100 text-center"
        >
            <p className="text-neutral-500 font-medium">
                Can't find what you're looking for? <a href="/support/help" className="text-black font-semibold underline underline-offset-4 hover:text-orange-600 transition-colors">Visit our Help Center</a> or <a href="/company/contact" className="text-black font-semibold underline underline-offset-4 hover:text-orange-600 transition-colors">Contact Support</a>.
            </p>
        </motion.div>
      </section>
    </PageLayout>
  );
}

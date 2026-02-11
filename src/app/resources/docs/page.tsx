
"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconBook, IconSearch, IconArrowRight, IconApi, IconHelp, IconTerminal } from "@tabler/icons-react";

const docCategories = [
  {
    icon: IconBook,
    title: "Getting Started",
    description: "Everything you need to know to place your first bet.",
    links: ["How to Play", "Account Setup", "Deposits & Withdrawals"]
  },
  {
    icon: IconApi,
    title: "Platform Rules",
    description: "Understanding market types, settlement, and fair play.",
    links: ["Poll Markets", "The Betrayal Game", "Platform Fees"]
  },
  {
    icon: IconTerminal,
    title: "For Developers",
    description: "Integrate with the Ante Social API and build custom tools.",
    links: ["API Reference", "Webhooks", "Authentication"]
  },
  {
    icon: IconHelp,
    title: "Support",
    description: "Troubleshooting and getting help when you need it.",
    links: ["FAQ", "Contact Support", "Dispute Resolution"]
  }
];

export default function DocsPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Documentation"
        description="Your guide to mastering the platform. From basic betting to advanced strategies."
      >
        <div className="relative max-w-lg mx-auto">
            <input 
              type="text" 
              placeholder="Search documentation..." 
              className="w-full px-6 py-4 rounded-full bg-white border border-neutral-200 shadow-sm focus:outline-none focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all text-lg font-medium placeholder:text-neutral-400"
            />
            <IconSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
        </div>
      </PageHeader>

      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <SectionHeading title="Knowledge Base" className="mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {docCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-10 rounded-[2rem] bg-white border border-neutral-100 hover:border-black/5 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex flex-col sm:flex-row items-start gap-8">
                <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center shrink-0 border border-black/5 group-hover:bg-black group-hover:border-black transition-colors duration-300">
                  <category.icon className="w-8 h-8 text-neutral-700 group-hover:text-white transition-colors" />
                </div>
                
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-2xl font-medium text-black mb-2">{category.title}</h3>
                    <p className="text-neutral-600 font-medium leading-relaxed">{category.description}</p>
                  </div>
                  
                  <div className="h-px bg-neutral-100 w-full" />
                  
                  <ul className="space-y-3">
                    {category.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="flex items-center justify-between text-base font-medium text-neutral-500 hover:text-black transition-colors group/link p-2 -mx-2 rounded-lg hover:bg-neutral-50">
                          {link}
                          <IconArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

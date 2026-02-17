
"use client";

import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { IconChevronDown, IconHeadset, IconSend, IconMailFast, IconBrandWhatsapp, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    category: "General",
    items: [
      {
        question: "Is Ante Social legal in Kenya?",
        answer: "Yes, Ante Social is fully licensed and regulated by the Betting Control and Licensing Board (BCLB) of Kenya. We strictly adhere to all local gaming laws."
      },
      {
        question: "How do I deposit funds?",
        answer: "You can deposit instantly via M-PESA. Simply go to your wallet, select 'Deposit', enter the amount, and follow the prompt on your phone."
      }
    ]
  },
  {
    category: "Betting & Markets",
    items: [
       {
        question: "Can I create my own betting markets?",
        answer: "Yes! Any verified user can create a Private Group market. Public market creation is currently limited to trusted creators but will be opening up soon."
      },
      {
        question: "What is the platform fee?",
        answer: "We charge a flat 5% fee on the winning pot only. There are no fees for depositing or withdrawing funds."
      },
      {
         question: "How are disputes resolved?",
         answer: "For public markets, smart contracts and oracle data determine the outcome. For private groups, the admin declares the winner, but members can dispute it, triggering a platform review."
       }
    ]
  }
];

function Accordion({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className={cn(
        "border rounded-2xl bg-white overflow-hidden transition-all duration-300",
        isOpen ? "border-black/10 shadow-lg ring-4 ring-black/[0.02]" : "border-neutral-100 hover:border-black/5"
    )}>
      <button 
        onClick={onClick}
        className="w-full p-6 flex items-center justify-between text-left group"
      >
        <span className={cn("text-lg font-medium transition-colors", isOpen ? "text-black" : "text-neutral-700 group-hover:text-black")}>
          {question}
        </span>
        <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
            isOpen ? "bg-black text-white rotate-180" : "bg-neutral-50 text-neutral-400 group-hover:bg-neutral-100 group-hover:text-neutral-600"
        )}>
            {isOpen ? <IconChevronDown className="w-5 h-5" /> : <IconPlus className="w-5 h-5" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
            <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <div className="px-6 pb-6 pt-0 text-neutral-600 font-medium leading-relaxed max-w-3xl">
                {answer}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("0-0"); // First item open by default

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <PageLayout>
      <PageHeader
        title="Help Center"
        description="Frequently asked questions and support resources to keep you in the game."
      />

      <section className="pb-24 px-6 max-w-7xl mx-auto space-y-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
             {/* FAQs */}
             <div className="lg:col-span-8 space-y-12">
                 {faqs.map((section, sectionIndex) => (
                    <div key={section.category} className="space-y-6">
                        <h2 className="text-xl font-semibold text-black px-2">{section.category}</h2>
                        <div className="space-y-4">
                            {section.items.map((faq, index) => {
                                const id = `${sectionIndex}-${index}`;
                                return (
                                    <Accordion 
                                        key={faq.question} 
                                        {...faq} 
                                        isOpen={openIndex === id}
                                        onClick={() => toggleAccordion(id)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                 ))}
             </div>

             {/* Contact Sidebar */}
             <div className="lg:col-span-4 space-y-6">
                 <div className="sticky top-24 space-y-6">
                    <div className="p-8 rounded-[2rem] bg-neutral-900 text-white space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none" />
                        
                        <div className="relative z-10">
                             <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/10">
                                <IconHeadset className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">Need more help?</h3>
                            <p className="text-white/60 font-medium text-sm leading-relaxed mb-8">
                                Our support team is available 24/7 to assist you with any issues.
                            </p>
                            
                            <div className="space-y-3">
                                <button className="w-full py-3 px-4 bg-white text-black rounded-xl font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 text-sm">
                                    <IconSend className="w-4 h-4" /> Start Live Chat
                                </button>
                                <button className="w-full py-3 px-4 bg-transparent border border-white/20 text-white rounded-xl font-semibold hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-sm">
                                    <IconMailFast className="w-4 h-4" /> Email Support
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl border border-neutral-100 bg-white">
                        <h4 className="font-semibold text-black mb-4">Quick Links</h4>
                         <ul className="space-y-3">
                            {["Terms of Service", "Privacy Policy", "Responsible Gaming"].map((link) => (
                                <li key={link}>
                                    <a href="#" className="flex items-center justify-between text-sm font-medium text-neutral-500 hover:text-black transition-colors group">
                                        {link}
                                        <IconChevronDown className="w-4 h-4 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                 </div>
             </div>
        </div>
      </section>
    </PageLayout>
  );
}


"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { IconChevronDown, IconLifebuoy, IconMessage, IconMail } from "@tabler/icons-react";
import { useState } from "react";

const faqs = [
  {
    question: "Is Ante Social legal in Kenya?",
    answer: "Yes, Ante Social is fully licensed and regulated by the Betting Control and Licensing Board (BCLB) of Kenya. We strictly adhere to all local gaming laws."
  },
  {
    question: "How do I deposit funds?",
    answer: "You can deposit instantly via M-PESA. Simply go to your wallet, select 'Deposit', enter the amount, and follow the prompt on your phone."
  },
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
];

function Accordion({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-neutral-100 rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:border-black/5 hover:shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-left"
      >
        <span className="text-lg font-medium text-black">
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-180 bg-black text-white" : "text-neutral-500"}`}>
            <IconChevronDown className="w-5 h-5" />
        </div>
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 text-neutral-600 font-medium leading-relaxed">
           {answer}
        </div>
      </motion.div>
    </div>
  );
}

export default function HelpPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Help Center"
        description="Frequently asked questions and support resources to keep you in the game."
      />

      <section className="pb-24 px-6 max-w-7xl mx-auto space-y-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
             <div className="lg:col-span-2 space-y-4">
                 <h2 className="text-2xl font-medium text-black mb-6">Common Questions</h2>
                 {faqs.map((faq) => (
                    <Accordion key={faq.question} {...faq} />
                 ))}
             </div>

             <div className="space-y-6">
                 <h2 className="text-2xl font-medium text-black mb-6">Contact Us</h2>
                 
                 <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-100 space-y-6">
                     <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/5">
                                <IconLifebuoy className="w-5 h-5 text-neutral-700" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-black">Live Support</h4>
                                <p className="text-sm text-neutral-500 font-medium">Available 24/7</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/5">
                                <IconMail className="w-5 h-5 text-neutral-700" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-black">Email</h4>
                                <p className="text-sm text-neutral-500 font-medium">support@antesocial.com</p>
                            </div>
                        </div>
                     </div>
                     
                     <div className="pt-6 border-t border-black/5">
                        <button className="w-full py-2 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-colors">
                            Start a Chat
                        </button>
                     </div>
                 </div>
             </div>
        </div>
      </section>
    </PageLayout>
  );
}

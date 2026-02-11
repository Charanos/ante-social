
"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { IconCopy, IconCheck, IconCode } from "@tabler/icons-react";
import { useState } from "react";

const codeSnippet = `
// Example: Creating a new market via API
const response = await fetch('https://api.antesocial.com/v1/markets', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: "Will humans land on Mars by 2030?",
    type: "poll",
    options: ["Yes", "No"],
    ends_at: "2030-01-01T00:00:00Z"
  })
});

const market = await response.json();
console.log(market.id); // "mkt_123..."
`;

export default function ApiPage() {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout>
      <PageHeader
        title="Build the future of predictions."
        description="Integrate Ante Social markets into your own application. Real-time odds, automated settlements, and a powerful liquidity layer at your fingertips."
      />

      <section className="pb-24 px-6 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="space-y-8"
            >
                <div className="flex flex-col gap-6">
                    <div className="flex gap-4">
                         <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 w-fit">
                             <IconCode className="w-8 h-8 text-black" />
                         </div>
                    </div>
                    
                    <h2 className="text-3xl font-medium text-black">
                        Developer First
                    </h2>
                    
                    <p className="text-lg text-neutral-600 font-medium leading-relaxed">
                        Our API is designed for scale. Whether you're building a trading bot, an analytics dashboard, 
                        or a completely new betting interface, we give you the tools to do it.
                    </p>
                    
                    <div className="flex flex-col gap-4">
                         {["Webhooks for real-time updates", "Comprehensive TypeScript types", "99.99% Uptime SLA"].map(item => (
                             <div key={item} className="flex items-center gap-3">
                                 <div className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center">
                                     <IconCheck className="w-3 h-3 text-black" />
                                 </div>
                                 <span className="font-medium text-neutral-700">{item}</span>
                             </div>
                         ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <a href="/resources/docs" className="px-8 py-2 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-colors">
                        Read the Docs
                    </a>
                    <a href="#" className="px-8 py-2 bg-white text-black border border-black/10 rounded-full font-medium hover:bg-neutral-50 transition-colors">
                        Get API Keys
                    </a>
                </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full"
            >
                <div className="rounded-3xl bg-[#0F0F0F] border border-neutral-800 p-8 shadow-2xl relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 z-10">
                        <button 
                            onClick={copyCode}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                        >
                            {copied ? <IconCheck className="w-4 h-4 text-green-400" /> : <IconCopy className="w-4 h-4" />}
                        </button>
                    </div>
                    
                    <div className="flex gap-2 mb-6">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    
                    <pre className="font-mono text-sm leading-relaxed text-neutral-300 overflow-x-auto custom-scrollbar">
                        <code>{codeSnippet.trim()}</code>
                    </pre>

                    {/* Code glow effect */}
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
                </div>
            </motion.div>
         </div>
      </section>
    </PageLayout>
  );
}

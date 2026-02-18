"use client";

import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { IconShieldLock, IconClock, IconCoin, IconUserOff, IconAlertCircle } from "@tabler/icons-react";

const tools = [
  {
    icon: IconCoin,
    title: "Deposit Limits",
    description: "Set a daily, weekly, or monthly cap on how much money you can deposit into your account.",
  },
  {
    icon: IconClock,
    title: "Time Out",
    description: "Take a short break from the markets. Lock your account for 24 hours, 7 days, or up to 6 weeks.",
  },
  {
    icon: IconUserOff,
    title: "Self-Exclusion",
    description: "If you feel you're no longer in control, you can self-exclude for 6 months, 1 year, or permanently.",
  }
];

const signs = [
  "Chasing market losses to win back money.",
  "Trading with money you can't afford to lose.",
  "Validating borrowing money or selling assets to trade.",
  "Neglecting work, family, or personal responsibilities.",
  "Feeling anxious or stressed about your trading habits."
];

export default function ResponsibleGamingPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Responsible Trading"
        description="We are committed to helping you stay in control. Trading should be entertainment, not a problem."
      />

      <section className="pb-24 px-6 max-w-5xl mx-auto space-y-24">
        
        {/* Core Philosophy */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
             <IconShieldLock className="w-16 h-16 mx-auto text-black" stroke={1.5} />
             <h2 className="text-3xl font-semibold text-black tracking-tight" style={{ fontWeight: 600 }}>Stay in Control</h2>
             <p className="text-lg text-neutral-600 leading-relaxed font-medium">
                Ante Social is designed for fun and social interaction. We provide tools to help you manage your play, but it's important to recognize when it stops being a game.
             </p>
        </div>

        <div className="w-full h-px bg-neutral-100" />

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tools.map((tool) => (
                <div key={tool.title} className="p-8 rounded-[2rem] border border-neutral-200 bg-white hover:border-black transition-colors duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-6 group-hover:bg-black transition-colors">
                        <tool.icon className="w-6 h-6 text-black group-hover:text-white transition-colors" stroke={1.5} />
                    </div>
                    <h3 className="text-xl font-semibold text-black mb-3" style={{ fontWeight: 600 }}>{tool.title}</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed font-medium">
                        {tool.description}
                    </p>
                </div>
            ))}
        </div>

        {/* Warning Signs */}
        <div className="bg-neutral-50 rounded-[2.5rem] p-8 md:p-12 border border-neutral-100">
            <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="md:w-1/3 space-y-4">
                     <div className="flex items-center gap-3 text-red-600">
                        <IconAlertCircle className="w-6 h-6" />
                        <span className="font-semibold tracking-wide uppercase text-xs">Warning Signs</span>
                     </div>
                     <h3 className="text-2xl font-semibold text-black">Know the signs of problematic behavior.</h3>
                </div>
                
                <div className="md:w-2/3">
                    <ul className="space-y-4">
                        {signs.map((sign, index) => (
                            <li key={index} className="flex items-start gap-4">
                                <span className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-semibold text-neutral-600 shrink-0 mt-0.5">
                                    {index + 1}
                                </span>
                                <span className="text-neutral-700 font-medium">{sign}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* Resources / Help */}
        <div className="text-center space-y-8">
            <h3 className="text-2xl font-semibold text-black">Need professional help?</h3>
            <p className="text-neutral-600 max-w-2xl mx-auto font-medium">
                If you or someone you know is struggling, confidential help is available 24/7.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <a href="https://www.gamhelp.org" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-neutral-800 transition-colors w-full sm:w-auto">
                    Visit GamHelp
                 </a>
                 <a href="tel:1199" className="px-8 py-4 bg-white border border-neutral-200 text-black rounded-full font-semibold hover:bg-neutral-50 transition-colors w-full sm:w-auto">
                    Call Helpline (1199)
                 </a>
            </div>
        </div>

      </section>
    </PageLayout>
  );
}

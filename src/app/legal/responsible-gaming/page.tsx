
"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { IconLifebuoy, IconClock, IconBan } from "@tabler/icons-react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

export default function ResponsiblePage() {
  const [activeModal, setActiveModal] = useState<"exclusion" | "limits" | "support" | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <PageLayout>
      <PageHeader
        title="Responsible Gaming"
        description="Betting should be entertainment, not a problem. We're committed to keeping it that way."
      />

      <section className="pb-24 px-6 max-w-6xl mx-auto space-y-16">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                onClick={() => setActiveModal("exclusion")}
                className="p-10 rounded-[2.5rem] bg-white border border-neutral-100 hover:border-black/5 hover:shadow-lg transition-all cursor-pointer group"
            >
                <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <IconBan className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-medium mb-4 text-black">Self-Exclusion</h3>
                <p className="text-neutral-600 font-medium leading-relaxed">
                    Need a break? You can lock your account for 24 hours, 7 days, or permanently at any time.
                </p>
                <div className="mt-6 text-red-500 font-semibold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <span>&rarr;</span>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                onClick={() => setActiveModal("limits")}
                className="p-10 rounded-[2.5rem] bg-white border border-neutral-100 hover:border-black/5 hover:shadow-lg transition-all cursor-pointer group"
            >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <IconClock className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-medium mb-4 text-black">Time Limits</h3>
                <p className="text-neutral-600 font-medium leading-relaxed">
                    Set a daily or weekly limit on how much time you spend on the platform.
                </p>
                <div className="mt-6 text-blue-500 font-semibold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    View controls <span>&rarr;</span>
                </div>
            </motion.div>

             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                onClick={() => setActiveModal("support")}
                className="p-10 rounded-[2.5rem] bg-white border border-neutral-100 hover:border-black/5 hover:shadow-lg transition-all cursor-pointer group"
            >
                <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <IconLifebuoy className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-medium mb-4 text-black">Support</h3>
                <p className="text-neutral-600 font-medium leading-relaxed">
                    If you or someone you know has a gambling problem, help is available. 
                </p>
                 <div className="mt-6 text-green-500 font-semibold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Get help <span>&rarr;</span>
                </div>
            </motion.div>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-black rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden"
        >
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-neutral-800 to-transparent opacity-50 pointer-events-none" />
             
             <div className="relative z-10 space-y-8">
                <h3 className="text-3xl font-medium">National Gambling Helpline</h3>
                <p className="text-neutral-400 font-medium text-lg max-w-xl mx-auto">
                    Free, confidential help is available 24/7 for you or anyone you care about.
                </p>
                <div className="text-5xl md:text-7xl font-medium tracking-tighter text-white/90">
                    0800-000-000
                </div>
             </div>
        </motion.div>
      </section>

      {/* Modals */}
      <Modal 
        isOpen={activeModal === "exclusion"} 
        onClose={closeModal} 
        title="Self-Exclusion Program"
      >
        <div className="space-y-4 text-neutral-600">
            <p>
                We understand that sometimes you need to step away. Our self-exclusion program allows you to voluntarily ban yourself from accessing your account for a set period.
            </p>
            <h4 className="font-semibold text-black">How it works:</h4>
            <ul className="list-disc pl-5 space-y-2">
                <li>You can choose a period of 24 hours, 7 days, 30 days, or permanent exclusion.</li>
                <li>During this time, you cannot log in, deposit, or place bets.</li>
                <li>Any pending bets will remain active, and winnings will be credited after the event concludes.</li>
                <li>Once the period is set, it <strong>cannot be reversed</strong>.</li>
            </ul>
            <div className="pt-4">
                <button className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition">
                    Navigate to Account Settings
                </button>
            </div>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === "limits"} 
        onClose={closeModal} 
        title="Setting Limits"
      >
        <div className="space-y-4 text-neutral-600">
            <p>
               Staying in control is key to responsible gaming. We provide tools to help you manage your time and money.
            </p>
            <h4 className="font-semibold text-black">Available Controls:</h4>
             <ul className="list-disc pl-5 space-y-2">
                <li><strong>Deposit Limits:</strong> Cap the amount you can deposit per day, week, or month.</li>
                <li><strong>Wager Limits:</strong> Limit the total amount you can bet in a given period.</li>
                <li><strong>Time Alerts:</strong> Get a notification after you've been active for a certain amount of time.</li>
            </ul>
             <div className="pt-4">
                <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
                    Set Limits
                </button>
            </div>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === "support"} 
        onClose={closeModal} 
        title="Get Support"
      >
        <div className="space-y-4 text-neutral-600">
            <p>
               Gambling addiction is a serious issue. If you feel visuals are no longer fun, please seek help immediately.
            </p>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <h4 className="font-semibold text-black mb-1">Gamblers Anonymous</h4>
                <p className="text-sm">Support groups and resources for recovery.</p>
                <a href="https://www.gamblersanonymous.org" target="_blank" rel="noopener noreferrer" className="text-green-600 font-medium text-sm hover:underline block mt-2">Visit Website &rarr;</a>
            </div>
             <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <h4 className="font-semibold text-black mb-1">Responsible Betting Council</h4>
                <p className="text-sm">Educational resources and self-assessment tools.</p>
                <a href="https://startyourrecovery.org/behavioral-health/gambling-addiction" target="_blank" rel="noopener noreferrer" className="text-green-600 font-medium text-sm hover:underline block mt-2">Visit Website &rarr;</a>
            </div>
        </div>
      </Modal>

    </PageLayout>
  );
}

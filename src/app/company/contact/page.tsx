"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { IconBrandX, IconBrandDiscordFilled, IconMailFast, IconMapPin2, IconSend, IconLoader } from "@tabler/icons-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const contactMethods = [
  {
    icon: IconMailFast,
    title: "Email Support",
    description: "For general inquiries and support.",
    value: "support@antesocial.com",
    bg: "bg-blue-50",
    color: "text-blue-600"
  },
  {
    icon: IconBrandX,
    title: "Twitter / X",
    description: "Follow us for real-time updates.",
    value: "@AnteSocial",
    bg: "bg-black/5",
    color: "text-black"
  },
  {
    icon: IconBrandDiscordFilled,
    title: "Discord Community",
    description: "Join the conversation with other players.",
    value: "Ante Social Server",
    bg: "bg-indigo-50",
    color: "text-indigo-600"
  }
];

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate submission
        setTimeout(() => setIsSubmitting(false), 2000);
    };

  return (
    <PageLayout>
      <PageHeader
        title="Get in Touch"
        description="We'd love to hear from you. Whether you have a question, feedback, or just want to say hello."
      />

      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Contact Info & Methods */}
            <div className="space-y-12">
                <div className="space-y-6">
                    <h2 className="text-3xl font-semibold text-black tracking-tight">Contact Information</h2>
                    <p className="text-neutral-600 font-medium leading-relaxed text-lg">
                        Our team is available 24/7 to assist you. Select a channel below or use the contact form to reach us directly.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {contactMethods.map((method, index) => (
                        <motion.a
                            href="#"
                            key={method.title}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group flex items-center gap-6 p-6 rounded-[2rem] border border-neutral-100 bg-white hover:border-black/5 hover:shadow-xl transition-all duration-300"
                        >
                            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110", method.bg)}>
                                <method.icon className={cn("w-7 h-7", method.color)} />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-black mb-1">{method.title}</h3>
                                <p className="text-neutral-500 font-medium text-sm mb-1">{method.description}</p>
                                <p className="text-black font-semibold">{method.value}</p>
                            </div>
                        </motion.a>
                    ))}
                </div>

                 <div className="p-8 rounded-[2rem] bg-neutral-900 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-neutral-800 to-transparent rounded-full blur-3xl opacity-50" />
                      <div className="relative z-10 flex items-start gap-4">
                           <IconMapPin2 className="w-8 h-8 text-white/80 shrink-0" />
                           <div className="space-y-2">
                               <h3 className="text-xl font-semibold">Headquarters</h3>
                               <p className="text-white/60 font-medium leading-relaxed">
                                   Nairobi, Kenya<br />
                                   Silicon Savannah, Westlands<br />
                                   P.O. Box 40404 - 00100
                               </p>
                           </div>
                      </div>
                 </div>
            </div>

            {/* Contact Form */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
            >
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

                <form onSubmit={handleSubmit} className="relative z-10 p-8 md:p-10 rounded-[2.5rem] bg-white border border-neutral-100 shadow-2xl shadow-neutral-100/50 space-y-6">
                    <h3 className="text-2xl font-semibold text-black mb-2">Send us a message</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-neutral-700 ml-1">First Name</label>
                            <input type="text" className="w-full px-6 py-4 rounded-2xl bg-neutral-50 border-none focus:ring-2 focus:ring-black/5 font-medium placeholder:text-neutral-400 text-black transition-all" placeholder="John" required />
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-semibold text-neutral-700 ml-1">Last Name</label>
                            <input type="text" className="w-full px-6 py-4 rounded-2xl bg-neutral-50 border-none focus:ring-2 focus:ring-black/5 font-medium placeholder:text-neutral-400 text-black transition-all" placeholder="Doe" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-700 ml-1">Email Address</label>
                        <input type="email" className="w-full px-6 py-4 rounded-2xl bg-neutral-50 border-none focus:ring-2 focus:ring-black/5 font-medium placeholder:text-neutral-400 text-black transition-all" placeholder="john@example.com" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-700 ml-1">Subject</label>
                         <select className="w-full px-6 py-4 rounded-2xl bg-neutral-50 border-none focus:ring-2 focus:ring-black/5 font-medium text-black transition-all appearance-none cursor-pointer">
                            <option>General Inquiry</option>
                            <option>Technical Support</option>
                            <option>Partnership</option>
                            <option>Feedback</option>
                        </select>
                    </div>

                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-700 ml-1">Message</label>
                        <textarea rows={5} className="w-full px-6 py-4 rounded-2xl bg-neutral-50 border-none focus:ring-2 focus:ring-black/5 font-medium placeholder:text-neutral-400 text-black transition-all resize-none" placeholder="How can we help you?" required />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={cn(
                            "w-full py-4 rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1",
                            isSubmitting ? "bg-neutral-800 cursor-not-allowed" : "bg-black hover:bg-neutral-900"
                        )}
                    >
                        {isSubmitting ? <IconLoader className="w-5 h-5 animate-spin" /> : <><IconSend className="w-5 h-5" /> Send Message</>}
                    </button>
                </form>
            </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}

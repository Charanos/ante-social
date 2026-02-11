
"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { IconMail, IconBrandTwitter, IconBrandDiscord, IconSend } from "@tabler/icons-react";
import { useToast } from "@/components/ui/toast-notification";
import { useState } from "react";

export default function ContactPage() {
  const { success } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
        setIsSubmitting(false);
        success("Message sent!", "We'll get back to you as soon as possible.");
        (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <PageLayout>
      <PageHeader
        title="Get in touch"
        description="Have a question, partnership proposal, or just want to say hi? We'd love to hear from you."
      />

      <section className="pb-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-10 rounded-[2.5rem] bg-white border border-neutral-100 shadow-xl"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-900 ml-1">Name</label>
                    <input required type="text" className="w-full px-6 py-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all font-medium text-black placeholder:text-neutral-400" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-900 ml-1">Email</label>
                    <input required type="email" className="w-full px-6 py-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all font-medium text-black placeholder:text-neutral-400" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-900 ml-1">Message</label>
                    <textarea required rows={4} className="w-full px-6 py-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all font-medium text-black placeholder:text-neutral-400 resize-none" placeholder="How can we help?" />
                </div>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 bg-black text-white rounded-xl font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Sending..." : "Send Message"} 
                    {!isSubmitting && <IconSend className="w-4 h-4" />}
                </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12 flex flex-col justify-center"
          >
            <div className="space-y-8">
                <h3 className="text-2xl font-medium text-black">Connect directly</h3>
                <div className="space-y-4">
                    {[
                        { icon: IconMail, label: "hello@antesocial.com", href: "mailto:hello@antesocial.com" },
                        { icon: IconBrandTwitter, label: "@antesocial", href: "https://twitter.com/antesocial" },
                        { icon: IconBrandDiscord, label: "Join our Community", href: "https://discord.gg/antesocial" }
                    ].map((item) => (
                        <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 p-4 rounded-2xl bg-white hover:bg-neutral-50 border border-transparent hover:border-black/5 transition-all group cursor-pointer">
                            <div className="w-12 h-12 rounded-xl bg-neutral-50 group-hover:bg-black group-hover:text-white flex items-center justify-center shrink-0 border border-black/5 transition-colors">
                                <item.icon className="w-6 h-6 text-neutral-600 group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-lg font-medium text-neutral-600 group-hover:text-black transition-colors">{item.label}</span>
                        </a>
                    ))}
                </div>
            </div>
            
            <div className="p-8 rounded-[2rem] bg-neutral-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none" />
                
                <p className="text-lg font-medium leading-relaxed opacity-90 relative z-10">
                    "We built Ante Social to bring people together. If you have an idea on how we can do that better, my inbox is always open."
                </p>
                <div className="mt-6 flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-white/20" />
                    <div>
                        <div className="font-semibold">Dennis</div>
                        <div className="text-xs text-white/60 uppercase tracking-wider font-semibold">Founder</div>
                    </div>
                </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}

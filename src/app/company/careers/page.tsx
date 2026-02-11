
"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { IconArrowUpRight, IconBriefcase } from "@tabler/icons-react";

const positions = [
  {
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Remote (Kenya)",
    type: "Full-time"
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote (Global)",
    type: "Contract"
  },
  {
    title: "Community Manager",
    department: "Marketing",
    location: "Nairobi",
    type: "Full-time"
  }
];

export default function CareersPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Join the Revolution"
        description="We're looking for builders, dreamers, and risk-takers to help us redefine the betting industry."
      />

      <section className="pb-24 px-6 max-w-4xl mx-auto space-y-20">
        
        <div className="space-y-4">
            {positions.map((job, index) => (
                <motion.div 
                    key={job.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group p-8 rounded-[2rem] border border-neutral-100 bg-white hover:border-black/5 hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between cursor-pointer gap-6"
                >
                    <div className="flex gap-6 items-start">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center border border-black/5 shrink-0 group-hover:bg-black group-hover:border-black transition-colors">
                            <IconBriefcase className="w-6 h-6 text-neutral-600 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-black mb-2">{job.title}</h3>
                            <div className="flex flex-wrap gap-3 text-sm font-medium">
                                <span className="text-black/60 bg-black/5 px-3 py-1 rounded-full">{job.department}</span>
                                <span className="text-black/60 bg-black/5 px-3 py-1 rounded-full">{job.location}</span>
                                <span className="text-black/60 bg-black/5 px-3 py-1 rounded-full">{job.type}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-12 rounded-[2.5rem] bg-neutral-50 border border-neutral-100"
        >
            <h3 className="text-2xl font-medium mb-4 text-black">Don't see your role?</h3>
            <p className="text-neutral-600 font-medium mb-8 max-w-lg mx-auto leading-relaxed">
                We're always looking for exceptional talent. If you think you can make an impact, we want to hear from you.
            </p>
            <a href="mailto:careers@antesocial.com" className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-colors">
                Email Us <IconArrowUpRight className="w-4 h-4" />
            </a>
        </motion.div>
      </section>
    </PageLayout>
  );
}

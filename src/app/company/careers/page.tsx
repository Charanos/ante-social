
"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { IconArrowUpRight, IconBriefcaseFilled, IconMapPin2, IconClockHour4, IconArrowRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const positions = [
  {
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Remote (Kenya)",
    type: "Full-time",
    tags: ["React", "Node.js", "Web3"]
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote (Global)",
    type: "Contract",
    tags: ["Figma", "UI/UX", "Motion"]
  },
  {
    title: "Community Manager",
    department: "Marketing",
    location: "Nairobi",
    type: "Full-time",
    tags: ["Social Media", "Events", "Growth"]
  },
  {
    title: "Smart Contract Engineer",
    department: "Engineering",
    location: "Remote (Global)",
    type: "Full-time",
    tags: ["Solidity", "Rust", "DeFi"]
  }
];

function JobCard({ job, index }: { job: typeof positions[0]; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white border border-neutral-100 rounded-[2rem] p-8 hover:border-black/5 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
        >
             <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
                <div className="p-3 rounded-full bg-black text-white">
                    <IconArrowRight className="w-5 h-5 -rotate-45" />
                </div>
             </div>

            <div className="flex flex-col md:flex-row md:items-start gap-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center shrink-0 border border-black/5 group-hover:bg-black group-hover:border-black transition-colors duration-300">
                    <IconBriefcaseFilled className="w-6 h-6 text-neutral-600 group-hover:text-white transition-colors" />
                </div>
                
                <div className="flex-1 space-y-4">
                    <div>
                        <h3 className="text-xl font-semibold text-black mb-1">{job.title}</h3>
                        <p className="text-neutral-500 font-medium">{job.department}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm font-medium text-neutral-600">
                         <div className="flex items-center gap-1.5">
                            <IconMapPin2 className="w-4 h-4 text-neutral-400" />
                            {job.location}
                         </div>
                         <div className="flex items-center gap-1.5">
                            <IconClockHour4 className="w-4 h-4 text-neutral-400" />
                            {job.type}
                         </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                        {job.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-neutral-50 text-neutral-600 text-xs font-semibold border border-neutral-100">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default function CareersPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Join the Revolution"
        description="We're looking for builders, dreamers, and risk-takers to help us redefine the betting industry."
      />

      <section className="pb-24 px-6 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar / Filter (Visual only for now) */}
            <div className="lg:col-span-4 space-y-8">
                 <div className="p-8 rounded-[2rem] bg-stone-100 border border-stone-200">
                    <h3 className="text-xl font-semibold text-black mb-6">Departments</h3>
                    <ul className="space-y-3">
                        {["All Departments", "Engineering", "Design", "Marketing", "Product", "Operations"].map((dept, i) => (
                            <li key={dept}>
                                <button className={cn(
                                    "w-full text-left py-2 px-4 rounded-xl font-medium transition-all flex items-center justify-between group",
                                    i === 0 ? "bg-black text-white" : "text-neutral-600 hover:bg-white hover:text-black"
                                )}>
                                    {dept}
                                    {i !== 0 && <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>}
                                </button>
                            </li>
                        ))}
                    </ul>
                 </div>

                 <div className="p-8 rounded-[2rem] bg-orange-500 text-white relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                      <div className="relative z-10 space-y-6">
                          <h3 className="text-2xl font-semibold">Perks & Benefits</h3>
                          <ul className="space-y-3 text-white/90 font-medium text-sm">
                              <li className="flex items-center gap-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                  Competitive Salary & Equity
                              </li>
                              <li className="flex items-center gap-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                  Remote-First Culture
                              </li>
                               <li className="flex items-center gap-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                  Comprehensive Health
                              </li>
                               <li className="flex items-center gap-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                  Annual Retreats
                              </li>
                          </ul>
                      </div>
                 </div>
            </div>

            {/* Job List */}
            <div className="lg:col-span-8 space-y-6">
                {positions.map((job, index) => (
                    <JobCard key={index} job={job} index={index} />
                ))}

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center p-12 rounded-[2.5rem] bg-neutral-50 border border-neutral-100"
                >
                    <h3 className="text-2xl font-semibold mb-4 text-black">Don't see your role?</h3>
                    <p className="text-neutral-600 font-medium mb-8 max-w-lg mx-auto leading-relaxed">
                        We're always looking for exceptional talent. If you think you can make an impact, we want to hear from you.
                    </p>
                    <a href="mailto:careers@antesocial.com" className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-colors">
                        Email Us <IconArrowUpRight className="w-4 h-4" />
                    </a>
                </motion.div>
            </div>
         </div>
      </section>
    </PageLayout>
  );
}


"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import Image from "next/image";
import { IconArrowUpRight } from "@tabler/icons-react";

const posts = [
  {
    title: "Understanding Betting Odds in 2026",
    excerpt: "How social prediction markets are replacing traditional bookmakers. We dive into the math and the psychology behind crowd-driven odds.",
    date: "Feb 10, 2026",
    category: "Industry",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2560&auto=format&fit=crop"
  },
  {
    title: "The Psychology of 'The Betrayal Game'",
    excerpt: "Why do we trust strangers? A deep dive into game theory mechanics and why the prisoner's dilemma is so addictive.",
    date: "Feb 05, 2026",
    category: "Game Theory",
    image: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?q=80&w=2560&auto=format&fit=crop"
  },
  {
    title: "Ante Social Raises Series A",
    excerpt: "Accelerating our mission to create the world's most transparent betting platform. Read about our new partners and roadmap.",
    date: "Jan 28, 2026",
    category: "Company",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2560&auto=format&fit=crop"
  }
];

export default function BlogPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Latest News"
        description="Insights, updates, and stories from the Ante Social team."
      />

      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer flex flex-col h-full"
            >
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 relative border border-black/5 bg-neutral-100">
                <Image 
                  src={post.image} 
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4">
                     <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wider text-black border border-black/5">
                         {post.category}
                     </span>
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                    {post.date}
                    </span>
                    <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <IconArrowUpRight className="w-4 h-4 text-black" />
                    </div>
                </div>
                
                <h3 className="text-2xl font-medium text-black group-hover:text-black/70 transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-neutral-600 font-medium leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

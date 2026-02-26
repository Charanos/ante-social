"use client";

import { motion } from "framer-motion";
import { IconArrowRight, IconArrowUpRight, IconCalendarEvent } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  publishedAt?: string;
};

type BlogsResponse = {
  data?: BlogPost[];
};

const defaultImg = "https://images.unsplash.com/photo-1611974714851-eb605503936f?q=80&w=1200&auto=format&fit=crop";

const fallbackPosts: BlogPost[] = [
  {
    _id: "1",
    slug: "introducing-ante-social",
    title: "Introducing Ante Social: The Future of Prediction Markets",
    excerpt: "Discover how we are revolutionizing social betting and prediction markets with cutting-edge tech and gamification mechanics.",
    publishedAt: new Date().toISOString(),
    author: "Ante Team",
    coverImage: "/dashboard-mockup.png",
  },
  {
    _id: "2",
    slug: "understanding-amm",
    title: "How Our Advanced Automated Market Maker Works",
    excerpt: "A deep dive into the math and mechanics behind our dynamic odds and seamless liquidity.",
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    author: "Protocol Eng",
    coverImage: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    _id: "3",
    slug: "community-governance",
    title: "The Dawn of Community Governance in Predictions",
    excerpt: "Empowering our users to curate markets and resolve disputes.",
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    author: "Community Lead",
    coverImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
  }
];

function formatDate(dateString?: string) {
  if (!dateString) return "Just now";
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function BlogSection() {
  const { data, isLoading } = useQuery<BlogsResponse>({
    queryKey: ["landing-blogs"],
    queryFn: async () => {
      const res = await fetch("/api/public/blogs?limit=3&offset=0", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return res.json();
    },
    staleTime: 60 * 1000,
  });

  const posts = data?.data && data.data.length > 0 ? data.data : fallbackPosts;
  const featured = posts[0];
  const secondary = posts.slice(1, 3);

  return (
    <section className="relative py-24 md:py-32 px-4 md:px-6 bg-linear-to-b from-white via-neutral-50/30 to-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 max-w-2xl"
          >
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-black/90 leading-[1.1]">
              Latest Insights
            </h2>
            <p className="text-base md:text-lg text-black/60 font-medium leading-relaxed">
              Market analysis, platform updates, and advanced prediction strategies from the Ante team.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-semibold text-sm hover:text-black/80 transition-all  group"
            >
              View All Posts
              <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
          {/* Featured Post */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="xl:col-span-8"
          >
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="group relative block h-full min-h-[450px] md:min-h-[600px] rounded-[2.5rem] overflow-hidden isolate shadow-2xl shadow-black/5 ring-1 ring-black/5">
                <Image src={featured.coverImage || defaultImg} alt={featured.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
                
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-5 text-white/90">
                     <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-xs font-semibold uppercase tracking-widest text-white shadow-inner">Featured</span>
                     <span className="flex items-center gap-1.5 text-sm font-medium"><IconCalendarEvent className="w-4 h-4" /> {formatDate(featured.publishedAt)}</span>
                  </div>
                  <h3 className="text-3xl md:text-5xl lg:text-5xl font-medium text-white mb-5 leading-[1.15] group-hover:text-blue-100 transition-colors duration-400">
                    {featured.title}
                  </h3>
                  <p className="text-lg md:text-xl text-white/80 font-medium line-clamp-2 mb-10 max-w-2xl leading-relaxed">
                    {featured.excerpt || "Dive into our latest analysis and platform updates to stay ahead in the predictive markets."}
                  </p>

                  <div className="flex items-center justify-between border-t border-white/10 pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white font-semibold text-lg shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        {(featured.author || "A")[0].toUpperCase()}
                      </div>
                      <span className="text-white font-medium text-lg">{featured.author || "Ante Team"}</span>
                    </div>
                    
                    <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-400 shadow-xl group-hover:scale-110">
                      <IconArrowUpRight className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </motion.div>

          {/* Secondary Posts */}
          <div className="xl:col-span-4 flex flex-col gap-6 md:gap-8">
            {secondary.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 + index * 0.15 }}
                className="h-full"
              >
                <Link href={`/blog/${post.slug}`} className="group flex flex-col sm:flex-row xl:flex-col gap-0 p-3 rounded-[2.5rem] bg-white border border-neutral-100 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:bg-neutral-50/50 transition-all duration-500 overflow-hidden h-full ring-1 ring-black/5 hover:ring-black/10">
                  <div className="relative w-full sm:w-2/5 xl:w-full h-48 sm:h-full xl:h-56 rounded-[2rem] overflow-hidden shrink-0 shadow-inner">
                     <Image src={post.coverImage || defaultImg} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                     <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-80" />
                     <div className="absolute bottom-4 left-4">
                       <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                         Analysis
                       </span>
                     </div>
                  </div>
                  <div className="flex flex-col flex-1 justify-center p-5 sm:p-6 xl:p-5">
                     <div className="flex items-center gap-2 mb-2.5 text-black/40 text-[11px] font-bold uppercase tracking-widest">
                       <IconCalendarEvent className="w-3.5 h-3.5" />
                       <span>{formatDate(post.publishedAt)}</span>
                     </div>
                     <h4 className="text-xl md:text-xl font-semibold text-black/90 mb-3 leading-[1.3] group-hover:text-amber-600 transition-colors line-clamp-2 md:line-clamp-3">
                       {post.title}
                     </h4>
                     <p className="text-sm text-black/60 line-clamp-2 mb-4">
                       {post.excerpt}
                     </p>
                     <div className="mt-auto flex items-center gap-1.5 text-xs font-bold text-black/60 group-hover:text-amber-600 uppercase tracking-widest transition-colors">
                        Read Story <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


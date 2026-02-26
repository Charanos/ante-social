"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { IconArrowRight, IconCalendar, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  publishedAt?: string;
  tags?: string[];
};

type BlogsResponse = {
  data?: BlogPost[];
  meta?: { total?: number };
};

export default function BlogIndexPage() {
  const { data, isLoading } = useQuery<BlogsResponse>({
    queryKey: ["public-blogs"],
    queryFn: async () => {
      const res = await fetch("/api/public/blogs?limit=20&offset=0", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return res.json();
    },
  });

  const blogs = data?.data || [];

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black overflow-x-hidden">
      <Navbar />

      <section className="pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-black/90 leading-[1.1]">
            Blog
          </h1>
          <p className="text-base md:text-lg text-black/80 font-medium max-w-2xl mx-auto">
            Market insights, platform updates, and forecasting strategies from the
            Ante Social team.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-16 text-black/50 font-medium">
            Loading posts…
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-black/50 font-medium mb-4">
              No blog posts yet. Check back soon!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold text-sm hover:bg-neutral-800 transition-all"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="block group h-full"
                >
                  <div className="h-full rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 hover:border-black/10 hover:bg-white/60 transition-all duration-500 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.12)] overflow-hidden">
                    {post.coverImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-black/40 bg-black/5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <h2 className="text-xl font-medium text-black/90 mb-2 group-hover:text-black transition-colors">
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="text-sm text-black/60 font-medium leading-relaxed mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-black/5">
                        <div className="flex items-center gap-4 text-xs text-black/40 font-medium">
                          {post.author && (
                            <span className="flex items-center gap-1">
                              <IconUser className="w-3 h-3" />
                              {post.author}
                            </span>
                          )}
                          {post.publishedAt && (
                            <span className="flex items-center gap-1">
                              <IconCalendar className="w-3 h-3" />
                              {new Date(post.publishedAt).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          )}
                        </div>
                        <IconArrowRight className="w-4 h-4 text-black/30 group-hover:text-black/60 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

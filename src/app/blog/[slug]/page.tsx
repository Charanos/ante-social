"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { IconArrowLeft, IconCalendar, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  publishedAt?: string;
  tags?: string[];
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const res = await fetch(`/api/public/blogs/${slug}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Blog not found");
      return res.json();
    },
    enabled: !!slug,
  });

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black overflow-x-hidden">
      <Navbar />

      <article className="pt-32 pb-24 px-4 md:px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-black/50 hover:text-black/80 transition-colors mb-8"
          >
            <IconArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {isLoading ? (
            <div className="text-center py-16 text-black/50 font-medium">
              Loading…
            </div>
          ) : error || !post ? (
            <div className="text-center py-16">
              <p className="text-black/50 font-medium mb-4">
                Blog post not found.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold text-sm hover:bg-neutral-800 transition-all"
              >
                View All Posts
              </Link>
            </div>
          ) : (
            <>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-black/40 bg-black/5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-black/90 leading-[1.15] mb-6">
                {post.title}
              </h1>

              <div className="flex items-center gap-6 text-sm text-black/50 font-medium mb-10">
                {post.author && (
                  <span className="flex items-center gap-2">
                    <IconUser className="w-4 h-4" />
                    {post.author}
                  </span>
                )}
                {post.publishedAt && (
                  <span className="flex items-center gap-2">
                    <IconCalendar className="w-4 h-4" />
                    {new Date(post.publishedAt).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>

              {post.coverImage && (
                <div className="relative h-64 md:h-[480px] rounded-3xl overflow-hidden mb-12 shadow-lg">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div
                className="prose prose-lg prose-neutral max-w-none
                  prose-headings:font-medium prose-headings:tracking-tight
                  prose-a:text-black prose-a:underline-offset-4
                  prose-p:text-black/70 prose-p:font-medium prose-p:leading-relaxed
                  prose-li:text-black/70 prose-li:font-medium
                  prose-strong:text-black/90 prose-strong:font-semibold
                  prose-img:rounded-2xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-16 pt-8 border-t border-black/5">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-medium text-black/50 hover:text-black/80 transition-colors"
                >
                  <IconArrowLeft className="w-4 h-4" />
                  Back to all posts
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </article>

      <Footer />
    </main>
  );
}

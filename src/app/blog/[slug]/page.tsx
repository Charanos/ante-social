"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  IconArrowLeft,
  IconCalendar,
  IconUser,
  IconClock,
  IconShare,
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconLink,
  IconCheck,
  IconBookmark,
  IconBookmarkFilled,
  IconChevronRight,
  IconEye,
  IconLoader3
} from "@tabler/icons-react"
import Link from "next/link"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/toast-notification"
import { useLiveUser } from "@/lib/live-data"

type BlogPost = {

  _id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  coverImage?: string
  author?: string
  publishedAt?: string
  tags?: string[]
  readTime?: number
  views?: number
}

type RelatedPost = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  coverImage?: string
  publishedAt?: string
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [readProgress, setReadProgress] = useState(0)
  const toast = useToast()
  const { user } = useLiveUser()

  const { scrollYProgress } = useScroll()
  
  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const article = document.querySelector('article')
      if (!article) return
      
      const articleTop = article.offsetTop
      const articleHeight = article.offsetHeight
      const windowHeight = window.innerHeight
      const scrollTop = window.scrollY
      
      const progress = ((scrollTop - articleTop + windowHeight) / articleHeight) * 100
      setReadProgress(Math.min(Math.max(progress, 0), 100))
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Initialize bookmark state
  useEffect(() => {
    if (typeof window !== "undefined" && slug) {
      const saved = localStorage.getItem(`bookmark_${slug}`)
      if (saved === "true") setIsBookmarked(true)
    }
  }, [slug])

  // Increment view count
  useEffect(() => {
    if (slug) {
      const timer = setTimeout(() => {
        fetch(`/api/public/blogs/${slug}/view`, { method: "POST" }).catch(console.error)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [slug])

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const res = await fetch(`/api/public/blogs/${slug}`, {
        cache: "no-store"
      })
      if (!res.ok) throw new Error("Blog not found")
      return res.json()
    },
    enabled: !!slug
  })

  const { data: relatedPosts } = useQuery<RelatedPost[]>({
    queryKey: ["related-posts", post?.tags],
    queryFn: async () => {
      if (!post) return []
      // Use existing endpoint and filter frontend-side for related posts
      const res = await fetch(`/api/public/blogs?limit=5&offset=0`, { cache: 'no-store' })
      if (!res.ok) return []
      const json = await res.json()
      const allBlogs = json.data || []
      return allBlogs.filter((b: any) => b._id !== post._id).slice(0, 2)
    },
    enabled: !!post
  })

  const handleShareClick = async () => {
    const url = window.location.href;
    const title = post?.title || "Blog Post";

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        toast.success("Shared Successfully", "The blog post was shared!");
      } catch (err) {
        // Fallback or user canceled
        console.error("Native share failed:", err);
      }
    } else {
      // Fallback
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link Copied", "Share this post with your friends!");
      } catch (err) {
        console.error("Failed to copy:", err);
        toast.error("Share Failed", "Could not copy link to clipboard.");
      }
    }
  };

  const toggleBookmark = () => {
    const newState = !isBookmarked
    setIsBookmarked(newState)
    
    if (typeof window !== "undefined" && slug) {
      if (newState) {
        localStorage.setItem(`bookmark_${slug}`, "true")
      } else {
        localStorage.removeItem(`bookmark_${slug}`)
      }
    }
  }



  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-white to-black/[0.02] text-black selection:bg-black/10 selection:text-black overflow-x-hidden">
      <Navbar />

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-orange-500 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <article className="pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Link & Admin Actions */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-black/40 hover:text-black/80 transition-colors group"
            >
              <IconArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>

            {user && ['admin', 'superadmin'].includes(user.role || '') && (
              <Link
                href="/dashboard/admin/blogs"
                className="inline-flex items-center gap-2 text-sm font-medium bg-black text-white px-5 py-2.5 rounded-full hover:bg-black/80 transition-all shadow-md hover:shadow-lg"
              >
                Edit Post
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="text-center flex flex-col items-center justify-center py-16">
              <IconLoader3 className="w-8 text-black/60 h-8 animate-spin" />
              <p className="mt-4 text-black/40 font-normal">Loading article...</p>
            </div>
          ) : error || !post ? (
            <div className="text-center flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-4">
                <IconArrowLeft className="w-8 h-8 text-black/20" />
              </div>
              <p className="text-black/50 font-normal mb-6 text-lg">
                Blog post not found.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2  font-medium text-sm underline transition-all cursor-pointer"
              >
                View All Posts
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-12">
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-black/50 bg-black/5 border border-black/10 rounded-full hover:bg-black/10 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-black/90 leading-[1.1] mb-8">
                  {post.title}
                </h1>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-xl text-black/60 font-normal leading-relaxed mb-8">
                    {post.excerpt}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-black/50 font-normal">
                  {post.author && (
                    <span className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-black/10 to-black/5 flex items-center justify-center">
                        <IconUser className="w-5 h-5 text-black/50" />
                      </div>
                      <span className="font-medium text-black/70">{post.author}</span>
                    </span>
                  )}
                  
                  {post.publishedAt && (
                    <span className="flex items-center gap-2">
                      <IconCalendar className="w-4 h-4" />
                      {new Date(post.publishedAt).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                  )}
                  
                  {post.readTime && (
                    <span className="flex items-center gap-2">
                      <IconClock className="w-4 h-4" />
                      {post.readTime} min read
                    </span>
                  )}

                  {post.views !== undefined && (
                    <span className="flex items-center gap-2">
                      <IconEye className="w-4 h-4" />
                      {post.views.toLocaleString()} views
                    </span>
                  )}
                </div>
              </div>

              {/* Cover Image */}
              {post.coverImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative h-64 md:h-[500px] rounded-3xl overflow-hidden mb-16 shadow-2xl"
                >
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>
              )}

              {/* Floating Action Buttons */}
              <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
                {/* Share Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShareClick}
                  className="w-12 h-12 rounded-full bg-white shadow-lg border border-black/10 flex items-center justify-center hover:shadow-xl transition-all cursor-pointer group"
                >
                  <IconShare className="w-5 h-5 text-black/60 group-hover:text-black transition-colors" />
                </motion.button>

                {/* Bookmark Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleBookmark}
                  className="w-12 h-12 rounded-full bg-white shadow-lg border border-black/10 flex items-center justify-center hover:shadow-xl transition-all cursor-pointer group"
                >
                  {isBookmarked ? (
                    <IconBookmarkFilled className="w-5 h-5 text-black" />
                  ) : (
                    <IconBookmark className="w-5 h-5 text-black/60 group-hover:text-black transition-colors" />
                  )}
                </motion.button>

                {/* Reading Progress Indicator */}
                <div className="w-12 h-12 rounded-full bg-white shadow-lg border border-black/10 flex items-center justify-center relative">
                  <svg className="w-full h-full -rotate-90 absolute inset-0">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="text-black/10"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 20}`}
                      strokeDashoffset={`${2 * Math.PI * 20 * (1 - readProgress / 100)}`}
                      className="text-black transition-all duration-300"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-xs font-medium text-black/70 relative z-10">
                    {Math.round(readProgress)}%
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="prose prose-lg prose-neutral max-w-7xl mx-auto
                  [&_h1]:text-5xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:mb-8 [&_h1]:text-black/90
                  [&_h2]:text-3xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:mt-16 [&_h2]:mb-6 [&_h2]:text-black/90 scroll-mt-24
                  [&_h3]:text-2xl [&_h3]:font-normal [&_h3]:mt-12 [&_h3]:mb-4 [&_h3]:text-black/80
                  [&_p]:text-lg [&_p]:leading-[1.8] [&_p]:text-black/80 [&_p]:mb-8 [&_p]:font-normal
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-8 [&_ul_li]:text-lg [&_ul_li]:leading-[1.8] [&_ul_li]:text-black/80 [&_ul_li]:mb-3
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-8 [&_ol_li]:text-lg [&_ol_li]:leading-[1.8] [&_ol_li]:text-black/80 [&_ol_li]:mb-3
                  [&_a]:text-black [&_a]:underline [&_a]:underline-offset-4 [&_a]:font-medium hover:[&_a]:text-black/70 [&_a]:transition-colors
                  [&_strong]:text-black [&_strong]:font-semibold
                  [&_blockquote]:border-l-4 [&_blockquote]:border-black/20 [&_blockquote]:pl-6 [&_blockquote]:py-4 [&_blockquote]:pr-6 [&_blockquote]:my-10 [&_blockquote]:italic [&_blockquote]:text-black/70 [&_blockquote]:bg-black/[0.02] [&_blockquote]:rounded-r-2xl
                  [&_code]:text-black/90 [&_code]:bg-black/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-sm
                  [&_pre]:bg-black/[0.03] [&_pre]:border [&_pre]:border-black/10 [&_pre]:rounded-2xl [&_pre]:my-10 [&_pre]:p-6 [&_pre]:overflow-x-auto
                  [&_img]:rounded-2xl [&_img]:shadow-xl [&_img]:my-12 [&_img]:border [&_img]:border-black/10 [&_img]:mx-auto [&_section>img]:w-full [&_section>img]:object-cover
                  [&_hr]:border-black/10 [&_hr]:my-16"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Article Footer */}
              <div className="mt-16 pt-8 border-t border-black/10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm font-medium text-black/50 hover:text-black/80 transition-colors group"
                  >
                    <IconArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to all posts
                  </Link>

                  {/* Mobile Share */}
                  <div className="flex items-center gap-3 lg:hidden">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleBookmark}
                      className="px-4 py-2 rounded-xl border border-black/10 hover:bg-black/5 transition-colors cursor-pointer flex items-center gap-2"
                    >
                      {isBookmarked ? (
                        <IconBookmarkFilled className="w-4 h-4" />
                      ) : (
                        <IconBookmark className="w-4 h-4" />
                      )}
                      <span className="text-sm font-normal">Bookmark</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShareClick}
                      className="px-4 py-2 rounded-xl bg-black text-white hover:bg-black/90 transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <IconShare className="w-4 h-4" />
                      <span className="text-sm font-medium">Share</span>
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts && relatedPosts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-24"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
                    <h2 className="text-2xl font-medium text-black/90">Related Articles</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {relatedPosts.slice(0, 2).map((relatedPost, index) => (
                      <motion.div
                        key={relatedPost._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <Link
                          href={`/blog/${relatedPost.slug}`}
                          className="block group"
                        >
                          <div className="relative overflow-hidden rounded-2xl bg-white border border-black/10 hover:shadow-xl transition-all">
                            {relatedPost.coverImage && (
                              <div className="relative h-48 overflow-hidden">
                                <Image
                                  src={relatedPost.coverImage}
                                  alt={relatedPost.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            )}
                            <div className="p-6">
                              <h3 className="text-lg font-medium text-black/90 mb-2 group-hover:text-black transition-colors line-clamp-2">
                                {relatedPost.title}
                              </h3>
                              {relatedPost.excerpt && (
                                <p className="text-sm text-black/60 line-clamp-2 mb-4">
                                  {relatedPost.excerpt}
                                </p>
                              )}
                              {relatedPost.publishedAt && (
                                <span className="text-xs text-black/40 font-normal">
                                  {new Date(relatedPost.publishedAt).toLocaleDateString(undefined, {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric"
                                  })}
                                </span>
                              )}
                              <div className="flex items-center gap-2 mt-4 text-sm font-normal text-black/50 group-hover:text-black/80 transition-colors">
                                Read more
                                <IconChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </article>

      <Footer />
    </main>
  )
}
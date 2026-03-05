"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { LoadingLogo } from "@/components/ui/LoadingLogo"
import { useToast } from "@/components/ui/toast-notification"
import { SearchFilterBar } from "@/components/ui/SearchFilterBar"
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconArticle,
  IconX,
} from "@tabler/icons-react"
import Link from "next/link"
import { blogsApi, type BlogItem } from "@/lib/api"

export default function AdminBlogsPage() {
  const toast = useToast()
  const [blogs, setBlogs] = useState<BlogItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null)

  // Form state
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: "",
    author: "",
    tags: "",
    status: "draft",
  })
  const [isSaving, setIsSaving] = useState(false)

  const loadBlogs = async () => {
    setIsLoading(true)
    try {
      const res = await blogsApi.list({ limit: 100 })
      setBlogs(res.data || [])
    } catch {
      toast.error("Failed to load blogs")
    }
    setIsLoading(false)
  }

  useEffect(() => {
    void loadBlogs()
  }, [])

  const resetForm = () => {
    setForm({ title: "", slug: "", content: "", excerpt: "", coverImage: "", author: "", tags: "", status: "draft" })
    setEditingBlog(null)
    setShowCreateModal(false)
  }

  const openEditModal = (blog: BlogItem) => {
    setEditingBlog(blog)
    setForm({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt || "",
      coverImage: blog.coverImage || "",
      author: blog.author || "",
      tags: (blog.tags || []).join(", "),
      status: blog.status,
    })
    setShowCreateModal(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required")
      return
    }
    setIsSaving(true)
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }
      if (editingBlog) {
        await blogsApi.update(editingBlog._id, payload)
        toast.success("Blog Updated", "Blog post updated successfully")
      } else {
        await blogsApi.create(payload)
        toast.success("Blog Created", "Blog post created successfully")
      }
      resetForm()
      void loadBlogs()
    } catch {
      toast.error(editingBlog ? "Failed to update blog" : "Failed to create blog")
    }
    setIsSaving(false)
  }

  const handleDelete = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return
    try {
      await blogsApi.remove(blogId)
      toast.success("Blog Deleted", "Post removed successfully")
      void loadBlogs()
    } catch {
      toast.error("Failed to delete blog")
    }
  }

  const filteredBlogs = blogs.filter((blog) => {
    if (statusFilter !== "all" && blog.status !== statusFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return blog.title.toLowerCase().includes(q) || (blog.excerpt || "").toLowerCase().includes(q)
    }
    return true
  })

  if (isLoading) return <LoadingLogo fullScreen size="lg" />

  return (
    <div className="space-y-10 pb-20 pl-0 md:pl-8">
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search blog posts..."
        activeTab={statusFilter}
        onTabChange={setStatusFilter}
        tabs={[
          { id: "all", label: "All" },
          { id: "published", label: "Published" },
          { id: "draft", label: "Drafts" },
          { id: "archived", label: "Archived" },
        ]}
        rightElement={
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { resetForm(); setShowCreateModal(true) }}
            className="group flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-black px-5 text-white shadow-md transition-all hover:bg-black/90 hover:shadow-lg"
          >
            <IconPlus className="h-4 w-4" />
            <span className="font-medium text-sm">New Post</span>
          </motion.button>
        }
      />

      {/* Blog List */}
      <div className="space-y-4">
        {filteredBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-4">
              <IconArticle className="w-8 h-8 text-black/20" />
            </div>
            <h3 className="text-lg font-medium text-black/60 mb-2">No blog posts</h3>
            <p className="text-sm text-black/40">Create your first blog post to get started</p>
          </div>
        ) : (
          filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <DashboardCard className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-black/90">
                        {blog.title}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                          blog.status === "published"
                            ? "bg-green-100 text-green-700"
                            : blog.status === "draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </div>
                    {blog.excerpt && (
                      <p className="text-sm text-black/60 leading-relaxed max-w-2xl mb-2">
                        {blog.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-black/40 font-medium">
                      {blog.author && <span>By {blog.author}</span>}
                      {blog.publishedAt && (
                        <span>
                          {new Date(blog.publishedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      <span className="text-black/30">/{blog.slug}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {blog.status === "published" && (
                      <Link href={`/blog/${blog.slug}`} target="_blank">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-medium text-black/70 transition-all hover:bg-black/5"
                        >
                          <IconEye className="h-3.5 w-3.5" />
                          View
                        </motion.button>
                      </Link>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openEditModal(blog)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-medium text-black/70 transition-all hover:bg-black/5"
                    >
                      <IconEdit className="h-3.5 w-3.5" />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(blog._id)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition-all hover:bg-red-100"
                    >
                      <IconTrash className="h-3.5 w-3.5" />
                    </motion.button>
                  </div>
                </div>
              </DashboardCard>
            </motion.div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-black/5 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-black/5 flex items-center justify-between">
                <h2 className="text-xl font-medium text-black/90">
                  {editingBlog ? "Edit Blog Post" : "Create Blog Post"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
                >
                  <IconX className="w-5 h-5 text-black/40" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-black/70 mb-1 block">Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-black/10 focus:border-black/30 outline-none text-sm font-medium text-black"
                    placeholder="Blog post title"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-black/70 mb-1 block">Slug</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-black/10 focus:border-black/30 outline-none text-sm font-medium text-black"
                    placeholder="auto-generated-from-title"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-black/70 mb-1 block">Excerpt</label>
                  <textarea
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-black/10 focus:border-black/30 outline-none text-sm font-medium resize-none text-black"
                    placeholder="Short summary..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-black/70 mb-1 block">Content *</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-black/10 focus:border-black/30 outline-none text-sm font-medium resize-none text-black"
                    placeholder="Blog post content (supports HTML)..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-black/70 mb-1 block">Cover Image URL</label>
                    <input
                      value={form.coverImage}
                      onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/60 border border-black/10 focus:border-black/30 outline-none text-sm font-medium text-black"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black/70 mb-1 block">Author</label>
                    <input
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/60 border border-black/10 focus:border-black/30 outline-none text-sm font-medium text-black"
                      placeholder="Author name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-black/70 mb-1 block">Tags</label>
                    <input
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/60 border border-black/10 focus:border-black/30 outline-none text-sm font-medium text-black"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black/70 mb-1 block">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/60 border border-black/10 focus:border-black/30 outline-none text-sm font-medium cursor-pointer text-black"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-black/5 flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-xl border border-black/10 text-sm font-medium text-black/60 hover:bg-black/5 transition-colors cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => void handleSave()}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/90 transition-colors shadow-md cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : editingBlog ? "Update" : "Create"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

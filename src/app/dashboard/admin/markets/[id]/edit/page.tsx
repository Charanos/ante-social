"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Upload, Plus, X, Save, Send, CheckCircle2, Calendar, Image as ImageIcon, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function EditMarketPage() {
  const router = useRouter()
  const [tags, setTags] = useState<string[]>(["memes", "mood", "wager", "bet"])
  const [currentTag, setCurrentTag] = useState("")
  const [outcomes, setOutcomes] = useState([
    { id: 1, name: "Barely holding it together", image: "23cc01c4e_49b.jpg" },
    { id: 2, name: "Not bad actually", image: "3bc8b42f4_nello.gif" },
    { id: 3, name: "I thrive off of chaos", image: "62439bdce_17hfk7.jpg" },
    { id: 4, name: "Does it matter anymore?", image: "162dba405_pablo.jpg" },
    { id: 5, name: "I'm fine...", image: "2026a3003_0_ZjYSm_q36J4KChdn.jpg" }
  ])

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleAddOutcome = () => {
    setOutcomes([...outcomes, { id: outcomes.length + 1, name: "", image: "" }])
  }

  const handleRemoveOutcome = (id: number) => {
    if (outcomes.length > 2) {
      setOutcomes(outcomes.filter(outcome => outcome.id !== id))
    }
  }

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-full mx-auto px-6 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <div>
              <h1 className="text-2xl font-medium text-neutral-900">Edit Market</h1>
              <p className="text-sm text-neutral-600 mt-0.5">Update market details and outcomes</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium">Draft saved 4:11:11 AM</span>
          </div>
        </motion.div>

        {/* Market Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-neutral-200 p-8 mb-6"
        >
          <h2 className="text-lg font-medium text-neutral-900 mb-6">Market Details</h2>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Market Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue="What's your vibe right now?"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              defaultValue="Pick the one that matches your brain's current state. Trust your gut — your mood might just make you money today."
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all resize-none"
            />
            <div className="flex justify-end mt-1.5">
              <span className="text-xs text-neutral-500">113 / 2000 characters</span>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Market Image/GIF (Optional)
            </label>
            <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-neutral-200 bg-green-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">Image attached</p>
                  <p className="text-xs text-neutral-600">23cc01c4e_49b.jpg</p>
                </div>
              </div>
              <button className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
                <X className="w-4 h-4 text-neutral-600" />
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Tags (Optional)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Add tags..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-xs font-medium text-neutral-700 border border-neutral-200"
                  >
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500 transition-colors cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-neutral-100 my-6"></div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Buy-in Amount */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Buy-in Amount (MP) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                defaultValue={1}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Market Duration
              </label>
              <select className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all appearance-none">
                <option>Daily (24h)</option>
                <option>Weekly (7d)</option>
                <option>Monthly (30d)</option>
                <option>Custom</option>
              </select>
              <p className="text-xs text-neutral-600 mt-1.5">Affects early bettor bonus calculations</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Min Participants */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Min Participants <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                defaultValue={5}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
            </div>

            {/* Max Participants */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Max Participants (Optional)
              </label>
              <input
                type="number"
                defaultValue={1000}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="border-t border-neutral-100 my-6"></div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Close Time */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Close Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                defaultValue="2025-12-02T08:30"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
              <p className="text-xs text-neutral-600 mt-1.5">in 7 hours</p>
            </div>

            {/* Settlement Time */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Settlement Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                defaultValue="2025-12-02T10:00"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
              <p className="text-xs text-neutral-600 mt-1.5">in 8 hours</p>
            </div>

            {/* Publish Time */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Scheduled Publish Time (Optional)
              </label>
              <input
                type="text"
                placeholder="dd/mm/yyyy --:--"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
              <p className="text-xs text-neutral-600 mt-1.5">If set, market will automatically publish at this time</p>
            </div>
          </div>
        </motion.div>

        {/* Outcome Options Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-neutral-200 p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-neutral-900">Outcome Options</h2>
            <button
              onClick={handleAddOutcome}
              className="text-sm font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Option
            </button>
          </div>

          <div className="space-y-6">
            {outcomes.map((outcome, index) => (
              <div key={outcome.id} className="p-6 rounded-lg border border-neutral-200 bg-neutral-50/50">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-neutral-900">
                    Option {index + 1} <span className="text-red-500">*</span>
                  </label>
                  {outcomes.length > 2 && (
                    <button
                      onClick={() => handleRemoveOutcome(outcome.id)}
                      className="p-1.5 rounded text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  defaultValue={outcome.name}
                  placeholder="Option text..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all mb-4"
                />

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Option Image/GIF (Optional)
                  </label>
                  {outcome.image ? (
                    <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-neutral-200 bg-green-50/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <ImageIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            {outcome.image.includes('.gif') ? 'GIF attached' : 'Image attached'}
                          </p>
                          <p className="text-xs text-neutral-600">{outcome.image}</p>
                        </div>
                      </div>
                      <button className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer">
                        <X className="w-4 h-4 text-neutral-600" />
                      </button>
                    </div>
                  ) : (
                    <button className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 group cursor-pointer">
                      <Upload className="w-4 h-4 text-neutral-600 group-hover:text-neutral-700 transition-colors" />
                      <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900 transition-colors">Upload Media</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-end gap-3">
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button className="px-5 py-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-all flex items-center gap-2 cursor-pointer">
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button className="px-6 py-2.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all flex items-center gap-2 cursor-pointer">
            <Send className="w-4 h-4" />
            Publish Now
          </button>
        </div>
      </div>
    </div>
  )
}

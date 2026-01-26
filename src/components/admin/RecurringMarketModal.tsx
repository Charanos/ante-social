"use client"

import { useState } from "react"
import { X, Upload, Plus, Calendar, Clock, Info } from "lucide-react"

interface RecurringMarketModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RecurringMarketModal({ isOpen, onClose }: RecurringMarketModalProps) {
  const [outcomes, setOutcomes] = useState([{ id: 1, name: "" }, { id: 2, name: "" }])
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")

  const handleAddOutcome = () => {
    setOutcomes([...outcomes, { id: outcomes.length + 1, name: "" }])
  }

  const handleRemoveOutcome = (id: number) => {
    if (outcomes.length > 2) {
      setOutcomes(outcomes.filter(outcome => outcome.id !== id))
    }
  }

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag])
      setCurrentTag("")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-neutral-600" />
            <h2 className="text-lg font-medium text-neutral-900">Set Up Recurring Market</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Template Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-neutral-600" />
              <h3 className="text-base font-medium text-neutral-900">Template Information</h3>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="Daily Market Series #1"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Market Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="Daily Question - {date}"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
                <p className="text-xs text-neutral-500 mt-1.5">
                  Use variables: <span className="font-mono bg-neutral-100 px-1 py-0.5 rounded">{"{date}"}</span> for date, <span className="font-mono bg-neutral-100 px-1 py-0.5 rounded">{"{week}"}</span> for week number
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Market description..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Recurrence Schedule */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-neutral-600" />
              <h3 className="text-base font-medium text-neutral-900">Recurrence Schedule</h3>
            </div>

            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="dd/mm/yyyy"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Recurrence <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all appearance-none">
                    <option>Does not repeat</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Market Open Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  defaultValue="09:00"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
                <p className="text-xs text-neutral-500 mt-1.5">
                  Local: <span className="text-blue-600">09:00 (Africa/Nairobi)</span> | UTC: <span className="text-neutral-600">06:00</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Market Close Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  defaultValue="17:00"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
                <p className="text-xs text-neutral-500 mt-1.5">
                  Local: <span className="text-blue-600">17:00 (Africa/Nairobi)</span> | UTC: <span className="text-neutral-600">14:00</span>
                </p>
              </div>
            </div>
          </div>

          {/* Market Settings */}
          <div>
            <h3 className="text-base font-medium text-neutral-900 mb-4">Market Settings</h3>

            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Buy-in Amount (USD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    defaultValue={10}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Market Duration Type
                  </label>
                  <select className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all appearance-none">
                    <option>Daily</option>
                    <option>Weekly</option>
                  </select>
                  <p className="text-xs text-neutral-500 mt-1.5">
                    Daily: 24 hours | Weekly: 168 hours (7 days)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Settlement Delay (Hours)
                </label>
                <input
                  type="number"
                  defaultValue={2}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="auto-publish"
                  className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-2 focus:ring-neutral-900"
                />
                <label htmlFor="auto-publish" className="text-sm font-medium text-neutral-900">
                  Auto-publish generated markets
                </label>
              </div>
            </div>
          </div>

          {/* Outcome Options */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-neutral-900">
                Outcome Options <span className="text-red-500">*</span>
              </h3>
              <button
                onClick={handleAddOutcome}
                className="text-sm font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Option
              </button>
            </div>

            <div className="space-y-8">
              {outcomes.map((outcome, index) => (
                <div key={outcome.id} className="p-4 rounded-lg border border-neutral-200 bg-neutral-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-neutral-900">
                      Option {index + 1}
                    </label>
                    {outcomes.length > 2 && (
                      <button
                        onClick={() => handleRemoveOutcome(outcome.id)}
                        className="p-1 rounded text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Option text..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all mb-3"
                  />
                  <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-all">
                    <Upload className="w-4 h-4" />
                    Upload Media
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Tags (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tag..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-xs font-medium text-neutral-700 border border-neutral-200"
                  >
                    {tag}
                    <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Info Message */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-neutral-700">
              <span className="font-medium">How it works:</span> Markets will be generated automatically based on your schedule. Each market will inherit these settings but can be edited individually before publication if needed.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-neutral-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button className="px-6 py-2.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all">
            Create Recurring Market
          </button>
        </div>
      </div>
    </div>
  )
}

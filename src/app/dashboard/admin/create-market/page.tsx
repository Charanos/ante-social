"use client"

import { useState } from "react"
import { motion,  AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, Plus, X, Save, Image as ImageIcon,
  Users, Zap, Brain, ShieldAlert, Trophy, Calendar, DollarSign, Clock
} from "lucide-react"
import { useRouter } from "next/navigation"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/useToast"

const marketTypes = [
  { id: "poll", name: "Poll-Style", icon: Users, description: "Option with most votes wins", color: "blue" },
  { id: "betrayal", name: "Betrayal Game", icon: ShieldAlert, description: "Cooperate or betray", color: "red" },
  { id: "reflex", name: "Reflex Reaction", icon: Zap, description: "5-second prediction test", color: "amber" },
  { id: "ladder", name: "Majority Ladder", icon: Brain, description: "Rank items by prediction", color: "purple" }
]

export default function CreateMarketPage() {
  const router = useRouter()
  const toast = useToast()
  
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [buyIn, setBuyIn] = useState("")
  const [closeDate, setCloseDate] = useState("")
  const [options, setOptions] = useState([{ id: 1, text: "", emoji: "" }, { id: 2, text: "", emoji: "" }])
  const [ladderItems, setLadderItems] = useState([
    { id: 1, text: "", emoji: "" },
    { id: 2, text: "", emoji: "" },
    { id: 3, text: "", emoji: "" }
  ])
  const [scenario, setScenario] = useState("")

  const handleAddOption = () => {
    setOptions([...options, { id: options.length + 1, text: "", emoji: "" }])
  }

  const handleRemoveOption = (id: number) => {
    if (options.length > 2) {
      setOptions(options.filter(opt => opt.id !== id))
    }
  }

  const handleAddLadderItem = () => {
    setLadderItems([...ladderItems, { id: ladderItems.length + 1, text: "", emoji: "" }])
  }

  const handleRemoveLadderItem = (id: number) => {
    if (ladderItems.length > 3) {
      setLadderItems(ladderItems.filter(item => item.id !== id))
    }
  }

  const handleSubmit = () => {
    if (!selectedType || !title || !description || !buyIn) {
      toast.error("Missing Fields", "Please fill in all required fields")
      return
    }

    toast.success("Market Created!", `${marketTypes.find(t => t.id === selectedType)?.name} market created successfully`)
    setTimeout(() => router.push("/dashboard/admin/markets"), 1500)
  }

  const getTypeColor = (typeId: string) => {
    const type = marketTypes.find(t => t.id === typeId)
    return type?.color || "neutral"
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        {/* Header */}
        <DashboardHeader 
          subtitle="Choose a market type and configure the details" 
        />

        {/* Visual Separator */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Select Market Type</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Market Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
        >
          {marketTypes.map((type) => {
            const Icon = type.icon
            const isSelected = selectedType === type.id
            return (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedType(type.id)}
                className={`
                  relative p-6 rounded-xl border-2 transition-all text-left
                  ${isSelected
                    ? `border-${type.color}-500 bg-${type.color}-50 shadow-lg`
                    : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${isSelected ? `bg-${type.color}-100` : 'bg-neutral-100'}`}>
                    <Icon className={`w-6 h-6 ${isSelected ? `text-${type.color}-600` : 'text-neutral-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-neutral-900 mb-1">{type.name}</h3>
                    <p className="text-sm text-neutral-600">{type.description}</p>
                  </div>
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className={`rounded-full bg-${type.color}-500 p-1`}>
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </motion.button>
            )
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedType && (
            <motion.div
              key={selectedType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Visual Separator */}
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
                <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Market Configuration</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
              </div>

              {/* Basic Details */}
              <DashboardCard className="p-6 mb-6">
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Basic Details</h3>
                
                <div className="space-y-8">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                      Market Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., What's your vibe right now?"
                      className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Provide details about the market..."
                      className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Settings Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Buy-in Amount */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-900 mb-2">
                        Buy-in Amount <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                          type="number"
                          value={buyIn}
                          onChange={(e) => setBuyIn(e.target.value)}
                          min="1"
                          placeholder="10"
                          className="w-full pl-10 pr-12 py-3 rounded-lg border-2 border-neutral-200 focus:border-blue-500 focus:outline-none transition-colors font-mono"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">MP</span>
                      </div>
                    </div>

                    {/* Close Date */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-900 mb-2">
                        Close Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                          type="datetime-local"
                          value={closeDate}
                          onChange={(e) => setCloseDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardCard>

              {/* Type-Specific Configuration */}
              {selectedType === "poll" && (
                <DashboardCard className="p-6 mb-6">
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">Poll Options</h3>
                  <p className="text-sm text-neutral-600 mb-4">Add options for participants to vote on. Winners split the pool pro-rata.</p>
                  
                  <div className="space-y-3">
                    {options.map((option, index) => (
                      <div key={option.id} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-medium text-blue-700 text-sm">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => {
                            const newOptions = [...options]
                            newOptions[index].text = e.target.value
                            setOptions(newOptions)
                          }}
                          placeholder={`Option ${index + 1} text`}
                          className="flex-1 px-4 py-2 rounded-lg border-2 border-neutral-200 focus:border-blue-500 focus:outline-none transition-colors"
                        />
                        {options.length > 2 && (
                          <button
                            onClick={() => handleRemoveOption(option.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <X className="w-5 h-5 text-red-500" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleAddOption}
                    className="mt-4 w-full py-2 border-2 border-dashed border-neutral-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-neutral-600 hover:text-blue-600 font-medium cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                    Add Option
                  </button>
                </DashboardCard>
              )}

              {selectedType === "reflex" && (
                <DashboardCard className="p-6 mb-6">
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">Reflex Test Configuration</h3>
                  
                  <div className="space-y-8">
                    {/* Scenario */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-900 mb-2">
                        Scenario <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={scenario}
                        onChange={(e) => setScenario(e.target.value)}
                        rows={2}
                        placeholder="e.g., When suddenly added to a group chat, what's your first reaction?"
                        className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-amber-500 focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    {/* Quick Options */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-900 mb-2">
                        Quick Options (5-second choices) <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-3">
                        {options.map((option, index) => (
                          <div key={option.id} className="flex items-center gap-3">
                            <input
                              type="text"
                              value={option.emoji}
                              onChange={(e) => {
                                const newOptions = [...options]
                                newOptions[index].emoji = e.target.value
                                setOptions(newOptions)
                              }}
                              placeholder="🏃"
                              maxLength={2}
                              className="w-16 text-center text-2xl px-2 py-2 rounded-lg border-2 border-neutral-200 focus:border-amber-500 focus:outline-none transition-colors"
                            />
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => {
                                const newOptions = [...options]
                                newOptions[index].text = e.target.value
                                setOptions(newOptions)
                              }}
                              placeholder={`Option ${index + 1} text`}
                              className="flex-1 px-4 py-2 rounded-lg border-2 border-neutral-200 focus:border-amber-500 focus:outline-none transition-colors"
                            />
                            {options.length > 2 && (
                              <button
                                onClick={() => handleRemoveOption(option.id)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <X className="w-5 h-5 text-red-500" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={handleAddOption}
                        className="mt-3 w-full py-2 border-2 border-dashed border-neutral-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors flex items-center justify-center gap-2 text-neutral-600 hover:text-amber-600 font-medium cursor-pointer"
                      >
                        <Plus className="w-5 h-5" />
                        Add Option
                      </button>
                    </div>
                  </div>
                </DashboardCard>
              )}

              {selectedType === "ladder" && (
                <DashboardCard className="p-6 mb-6">
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">Ranking Items</h3>
                  <p className="text-sm text-neutral-600 mb-4">Create items for participants to rank. Winners match the majority's exact order.</p>
                  
                  <div className="space-y-3">
                    {ladderItems.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-medium text-purple-700 text-sm">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          value={item.emoji}
                          onChange={(e) => {
                            const newItems = [...ladderItems]
                            newItems[index].emoji = e.target.value
                            setLadderItems(newItems)
                          }}
                          placeholder="🐌"
                          maxLength={2}
                          className="w-16 text-center text-2xl px-2 py-2 rounded-lg border-2 border-neutral-200 focus:border-purple-500 focus:outline-none transition-colors"
                        />
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => {
                            const newItems = [...ladderItems]
                            newItems[index].text = e.target.value
                            setLadderItems(newItems)
                          }}
                          placeholder={`Item ${index + 1} to rank`}
                          className="flex-1 px-4 py-2 rounded-lg border-2 border-neutral-200 focus:border-purple-500 focus:outline-none transition-colors"
                        />
                        {ladderItems.length > 3 && (
                          <button
                            onClick={() => handleRemoveLadderItem(item.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <X className="w-5 h-5 text-red-500" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleAddLadderItem}
                    className="mt-4 w-full py-2 border-2 border-dashed border-neutral-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 text-neutral-600 hover:text-purple-600 font-medium cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                    Add Item
                  </button>
                </DashboardCard>
              )}

              {selectedType === "betrayal" && (
                <DashboardCard className="p-6 mb-6 bg-gradient-to-br from-red-50 to-white border-2 border-red-200">
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">Betrayal Game</h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    This market type has predefined mechanics: <strong>Cooperate</strong> or <strong>Betray</strong>. No additional configuration needed.
                  </p>
                  
                  <div className="p-4 rounded-lg bg-white border border-red-200">
                    <h4 className="font-medium text-red-900 mb-2">Outcome Rules:</h4>
                    <ul className="text-sm text-neutral-700 space-y-1">
                      <li>• All cooperate → Small win for all</li>
                      <li>• Majority cooperate, minority betray → Betrayers win big</li>
                      <li>• Majority betray → Everyone loses</li>
                      <li>• All betray → Zero for everyone</li>
                    </ul>
                  </div>
                </DashboardCard>
              )}

              {/* Submit */}
              <div className="flex gap-4">
                <button
                  onClick={() => router.back()}
                  className="flex-1 py-3 rounded-lg border-2 border-neutral-200 bg-white hover:bg-neutral-50 font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Create Market
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedType && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Choose a Market Type</h3>
            <p className="text-sm text-neutral-500">Select a market type above to begin configuration</p>
          </div>
        )}
      </div>
    </div>
  )
}
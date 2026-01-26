"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ArrowLeft, Users, Clock, DollarSign, GripVertical, TrendingUp, ArrowRight } from "lucide-react"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/useToast"

interface RankItem {
  id: string
  text: string
  emoji: string
}

// Sortable Item Component
function SortableItem({ item, index }: { item: RankItem; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-4 p-4 rounded-xl border-2 bg-white transition-all
        ${isDragging ? 'border-blue-500 shadow-2xl z-50' : 'border-neutral-200 hover:border-blue-300 shadow-sm hover:shadow-md'}
      `}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex-shrink-0 cursor-grab active:cursor-grabbing p-2 hover:bg-neutral-100 rounded-lg transition-colors"
      >
        <GripVertical className="w-5 h-5 text-neutral-400" />
      </div>

      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium font-mono">
        {index + 1}
      </div>

      <div className="flex-1 flex items-center gap-3">
        <span className="text-3xl">{item.emoji}</span>
        <span className="font-medium text-neutral-900">{item.text}</span>
      </div>
    </div>
  )
}

// Mock market data
const getMockLadderMarket = (id: string) => ({
  id,
  title: "Rank These Inconveniences",
  description: "Predict how the majority will rank these everyday annoyances from most to least inconvenient. Match the crowd's consensus to win!",
  market_type: "ladder",
  buy_in_amount: 5,
  total_pool: 350,
  participant_count: 70,
  status: "active",
  close_date: new Date(Date.now() + 86400000 * 3), // 3 days
  items: [
    { id: "item1", text: "Slow internet connection", emoji: "🐌" },
    { id: "item2", text: "Forgetting your password", emoji: "🔐" },
    { id: "item3", text: "Traffic jam when late", emoji: "🚗" },
    { id: "item4", text: "Phone dying at 1%", emoji: "🔋" },
    { id: "item5", text: "Wet socks", emoji: "🧦" }
  ]
})

export default function MajorityLadderPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  const marketId = params.id as string

  const market = getMockLadderMarket(marketId)
  
  const [rankedItems, setRankedItems] = useState<RankItem[]>(market.items)
  const [stakeAmount, setStakeAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setRankedItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSubmitRanking = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) < market.buy_in_amount) {
      toast.error("Invalid Stake", `Minimum stake is ${market.buy_in_amount} USD`)
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const chain = rankedItems.map(item => item.text).join(" → ")
      toast.success("Ranking Submitted!", `Your chain: ${chain.substring(0, 50)}...`)
      setIsSubmitting(false)
    }, 1000)
  }

  const getTimeRemaining = () => {
    const diff = market.close_date.getTime() - Date.now()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return `${days}d ${hours}h`
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        {/* Header */}
        <DashboardHeader 
          subtitle={market.description} 
        />

        <div className="flex items-center gap-2 -mt-16 mb-8 relative z-10 px-2 justify-end">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium uppercase tracking-wide border border-purple-200 shadow-sm">
                Majority Ladder
              </span>
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium uppercase tracking-wide border border-green-200 shadow-sm">
              {market.status}
            </span>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
        >
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900/60">Buy-in</p>
                  <p className="mt-2 text-2xl font-medium font-mono text-blue-900">{market.buy_in_amount} USD</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900/60">Total Pool</p>
                  <p className="mt-2 text-2xl font-medium numeric text-green-900">${market.total_pool}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900/60">Players</p>
                  <p className="mt-2 text-2xl font-medium numeric text-purple-900">{market.participant_count}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-amber-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-100/50 blur-2xl transition-all group-hover:bg-amber-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-900/60">Closes In</p>
                  <p className="mt-2 text-2xl font-medium numeric text-amber-900">{getTimeRemaining()}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Visual Separator */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Drag to Rank</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Instructions Card */}
        <DashboardCard className="p-6 mb-10 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <GripVertical className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-1">How to Play</h4>
              <p className="text-sm text-blue-700">
                Drag items to rank them from <strong>most inconvenient (#1)</strong> to <strong>least inconvenient</strong>. 
                Your goal is to match what the <strong>majority</strong> will choose. Winners split the prize pool!
              </p>
            </div>
          </div>
        </DashboardCard>

        {/* Drag and Drop Ranking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <DashboardCard className="p-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={rankedItems.map(item => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {rankedItems.map((item, index) => (
                    <SortableItem key={item.id} item={item} index={index} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </DashboardCard>
        </motion.div>

        {/* Chain Preview */}
        <DashboardCard className="p-6 mb-10 bg-neutral-50">
          <h4 className="text-sm font-medium text-neutral-600 mb-3 uppercase tracking-wide">Your Chain Preview</h4>
          <div className="flex items-center gap-2 flex-wrap">
            {rankedItems.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-white border-2 border-neutral-200 font-medium text-sm text-neutral-900">
                  {item.emoji} {item.text}
                </span>
                {index < rankedItems.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                )}
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Stake & Submit */}
        <DashboardCard className="p-6">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Your Stake Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  min={market.buy_in_amount}
                  step="1"
                  placeholder={`Minimum $${market.buy_in_amount}`}
                  className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-blue-500 focus:outline-none transition-all numeric text-lg"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">USD</span>
              </div>
            </div>

            <button
              onClick={handleSubmitRanking}
              disabled={isSubmitting}
              className={`
                w-full py-3 rounded-lg font-medium text-white transition-all cursor-pointer
                ${isSubmitting
                  ? 'bg-neutral-300 cursor-not-allowed'
                  : 'bg-neutral-900 hover:bg-neutral-800 shadow-lg hover:shadow-xl'
                }
              `}
            >
              {isSubmitting ? 'Submitting Ranking...' : 'Submit Ranking'}
            </button>

            <p className="text-xs text-center text-neutral-500">
              Winners are those whose ranking matches the majority's consensus exactly
            </p>
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}

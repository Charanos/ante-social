"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { LoadingLogo } from "@/components/ui/LoadingLogo"
import { useToast } from "@/components/ui/toast-notification"
import { contentApi } from "@/lib/api"
import { IconDeviceFloppy, IconRefresh } from "@tabler/icons-react"

type SectionData = Record<string, unknown>

type LandingSettings = {
  hero?: SectionData
  features?: SectionData
  gameModes?: SectionData
  testimonials?: SectionData
  hallOfFame?: SectionData
  currency?: SectionData
  socialProofStats?: SectionData
}

const SECTIONS = [
  { key: "hero", label: "Hero Section", description: "Main headline, subtext, and CTA" },
  { key: "features", label: "Features", description: "Feature grid items and descriptions" },
  { key: "gameModes", label: "Game Modes", description: "Available prediction market types" },
  { key: "testimonials", label: "Testimonials", description: "User testimonials and reviews" },
  { key: "hallOfFame", label: "Hall of Fame", description: "Leaderboard configuration" },
  { key: "currency", label: "Currency", description: "Ante Points and tokenomics section" },
  { key: "socialProofStats", label: "Social Proof Stats", description: "Platform statistics counters" },
] as const

export default function AdminLandingPageCMS() {
  const toast = useToast()
  const [settings, setSettings] = useState<LandingSettings>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [editBuffers, setEditBuffers] = useState<Record<string, string>>({})

  const loadSettings = async () => {
    setIsLoading(true)
    try {
      const data = await contentApi.getAdminLandingPage()
      setSettings(data as LandingSettings)
      const buffers: Record<string, string> = {}
      for (const s of SECTIONS) {
        const value = (data as Record<string, unknown>)?.[s.key]
        buffers[s.key] = value ? JSON.stringify(value, null, 2) : "{}"
      }
      setEditBuffers(buffers)
    } catch {
      toast.error("Failed to load landing page settings")
    }
    setIsLoading(false)
  }

  useEffect(() => {
    void loadSettings()
  }, [])

  const handleSaveSection = async (sectionKey: string) => {
    setIsSaving(true)
    try {
      const parsed = JSON.parse(editBuffers[sectionKey] || "{}")
      await contentApi.updateLandingPage({ [sectionKey]: parsed })
      toast.success("Saved", `${sectionKey} section updated`)
    } catch (e: any) {
      if (e instanceof SyntaxError) {
        toast.error("Invalid JSON", "Please check the JSON syntax")
      } else {
        toast.error("Failed to save section")
      }
    }
    setIsSaving(false)
  }

  if (isLoading) return <LoadingLogo fullScreen size="lg" />

  return (
    <div className="space-y-10 pb-20 pl-0 md:pl-8">
      <div className="flex gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => void loadSettings()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-black/10 text-sm font-medium text-black/60 hover:bg-black/5 transition-colors cursor-pointer"
        >
          <IconRefresh className="w-4 h-4" />
          Reload
        </motion.button>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((section) => (
          <DashboardCard key={section.key} className="overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
              className="w-full p-6 flex items-center justify-between cursor-pointer text-left hover:bg-black/[0.02] transition-colors"
            >
              <div>
                <h3 className="text-base font-medium text-black/90">{section.label}</h3>
                <p className="text-sm text-black/50 mt-0.5">{section.description}</p>
              </div>
              <span className="text-sm font-mono text-black/30">
                {expandedSection === section.key ? "▲" : "▼"}
              </span>
            </button>

            {expandedSection === section.key && (
              <div className="px-6 pb-6 space-y-4 border-t border-black/5 pt-4">
                <textarea
                  value={editBuffers[section.key] || "{}"}
                  onChange={(e) => setEditBuffers({ ...editBuffers, [section.key]: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-black/10 focus:border-black/30 outline-none text-sm font-mono resize-y"
                  spellCheck={false}
                />
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => void handleSaveSection(section.key)}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/90 transition-colors shadow-md cursor-pointer disabled:opacity-60"
                  >
                    <IconDeviceFloppy className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save Section"}
                  </motion.button>
                </div>
              </div>
            )}
          </DashboardCard>
        ))}
      </div>
    </div>
  )
}

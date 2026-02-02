"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Target, Calendar, DollarSign, ChevronRight, Info, Plus } from "lucide-react"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { cn } from "@/lib/utils"

export default function CreateMarketPage() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "winner_takes_all",
        buyIn: "",
        endDate: ""
    })

    return (
        <div className="space-y-8 pb-20 max-w-4xl mx-auto">
            <DashboardHeader
                user={{ username: "Creator" }}
                subtitle="Launch a new betting market"
            />

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 px-4">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-4">
                        <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-all",
                            step >= s ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                        )}>
                            {s}
                        </div>
                        {s < 3 && <div className={cn("w-16 h-1 bg-gray-100 rounded-full", step > s && "bg-black")} />}
                    </div>
                ))}
            </div>

            <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border-white/60 bg-white/70 shadow-xl shadow-gray-200/50 relative overflow-hidden">

                {/* Decorative background blob */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                <form className="relative z-10 space-y-8" onSubmit={(e) => e.preventDefault()}>

                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900 ml-1">Market Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Who will win the 2026 World Cup?"
                                    className="w-full text-2xl font-semibold bg-transparent border-b-2 border-gray-200 focus:border-black py-4 outline-none placeholder:text-gray-300 transition-colors"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900 ml-1">Description (Optional)</label>
                                <textarea
                                    rows={3}
                                    placeholder="Add some context for the participants..."
                                    className="w-full rounded-2xl bg-gray-50/50 border border-gray-200 p-4 outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all resize-none"
                                />
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <label className="text-sm font-semibold text-gray-900 ml-1">Select Market Type</label>
                            <div className="grid md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setFormData({ ...formData, type: "winner_takes_all" })}
                                    className={cn(
                                        "p-6 rounded-3xl border-2 text-left transition-all hover:scale-[1.02]",
                                        formData.type === 'winner_takes_all'
                                            ? "border-purple-600 bg-purple-50/50 ring-4 ring-purple-100"
                                            : "border-gray-100 bg-white hover:border-purple-200"
                                    )}
                                >
                                    <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                                        <Trophy className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Winner Takes All</h3>
                                    <p className="text-sm text-gray-500 mt-2">Multiple options, one winner takes the entire pool.</p>
                                </button>

                                <button
                                    onClick={() => setFormData({ ...formData, type: "binary" })}
                                    className={cn(
                                        "p-6 rounded-3xl border-2 text-left transition-all hover:scale-[1.02]",
                                        formData.type === 'binary'
                                            ? "border-blue-600 bg-blue-50/50 ring-4 ring-blue-100"
                                            : "border-gray-100 bg-white hover:border-blue-200"
                                    )}
                                >
                                    <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Binary (Yes/No)</h3>
                                    <p className="text-sm text-gray-500 mt-2">Simple outcome. Did it happen or not?</p>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-900 ml-1">Buy-In Amount</label>
                                    <div className="relative group">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full rounded-2xl bg-gray-50 border border-gray-200 pl-10 pr-4 py-4 font-mono font-semibold text-lg outline-none focus:ring-2 focus:ring-black/5 focus:border-black focus:bg-white transition-all"
                                            value={formData.buyIn}
                                            onChange={e => setFormData({ ...formData, buyIn: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-900 ml-1">End Date</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
                                        <input
                                            type="date"
                                            className="w-full rounded-2xl bg-gray-50 border border-gray-200 pl-10 pr-4 py-4 font-medium outline-none focus:ring-2 focus:ring-black/5 focus:border-black focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-4 items-start">
                                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-800 leading-relaxed">
                                    Platform fee is 5%. This ensures fair play and secure handling of funds. The fee is deducted from the total pool upon settlement.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-3 rounded-xl font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                                Back
                            </button>
                        ) : <div />}

                        <button
                            type="button"
                            onClick={() => step < 3 ? setStep(step + 1) : null}
                            className="px-8 py-3 rounded-xl bg-black text-white font-semibold shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                        >
                            {step === 3 ? "Launch Market" : "Continue"}
                            {step < 3 && <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

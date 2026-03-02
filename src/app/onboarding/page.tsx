"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  IconLoader3,
  IconCheck,
  IconUser,
  IconWallet,
  IconArrowRight,
  IconSparkles,
} from "@tabler/icons-react"
import { useToast } from "@/components/ui/toast-notification"
import Image from "next/image"
import Link from "next/link"
import { signIn } from "next-auth/react"

export default function OnboardingPage() {
  const router = useRouter()
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Check if user needs onboarding
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const needsOnboarding = sessionStorage.getItem("needsOnboarding")
    const email = sessionStorage.getItem("userEmail")

    if (!needsOnboarding || !email) {
      router.push("/login")
      return
    }

    setUserEmail(email)
  }, [router])

  // Profile form data
  const [profileData, setProfileData] = useState({
    fullName: "",
    location: "",
    bio: "",
    preferredCurrency: "USD" as "USD" | "KSH",
  })

  const handleComplete = async () => {
    if (!profileData.fullName.trim()) {
      toast.error("Name Required", "Please enter your full name.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          fullName: profileData.fullName.trim(),
          location: profileData.location.trim(),
          bio: profileData.bio.trim(),
          preferredCurrency: profileData.preferredCurrency,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error("Update Failed", data?.message || "Could not update profile.")
        setIsLoading(false)
        return
      }

      toast.success("Profile Updated", "Your details have been saved.")
      setIsComplete(true)
    } catch (error) {
      console.error("Profile update error:", error)
      toast.error("Update Failed", "System error. Please try again.")
      setIsLoading(false)
    }
  }

  const handleEnterDashboard = async (addFunds: boolean) => {
    setIsLoading(true)

    // Clear onboarding flags
    sessionStorage.removeItem("needsOnboarding")
    sessionStorage.removeItem("userEmail")

    toast.success("Welcome Aboard", "Your account is ready!")

    // Redirect based on choice
    setTimeout(() => {
      if (addFunds) {
        router.push("/dashboard/wallet?action=deposit")
      } else {
        router.push("/dashboard")
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 relative overflow-hidden">
      {/* LEFT SIDE: Brand */}
      <div className="relative bg-white text-black flex flex-col justify-between p-12 lg:p-20 z-10 order-last lg:order-first">
        <div>
          <div className="relative w-24 h-24 md:w-36 md:h-36 mb-2 -ml-6">
            <Image
              src="/ante-logo.png"
              alt="Ante Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="max-w-md z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-5xl font-normal tracking-tight leading-tight mb-6">
              {isComplete ? "You're ready." : "Welcome aboard."}
            </h1>
            <p className="text-lg text-neutral-600 font-normal leading-relaxed">
              {isComplete
                ? "Fund your wallet to start placing bets and forecasting on markets."
                : "Complete your profile to start forecasting."}
            </p>
          </motion.div>
        </div>

        <div className="text-sm font-medium text-neutral-500">
          © {new Date().getFullYear()} Ante Social. All rights reserved.
        </div>

        {/* Subtle background texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* RIGHT SIDE: Onboarding Form */}
      <div className="relative bg-[#080808] text-white flex flex-col justify-center p-8 lg:p-24 z-10 order-first lg:order-last">
        <div className="max-w-md w-full mx-auto">
          {!isComplete ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-10">
                <div className="w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6">
                  <IconUser className="w-7 h-7 text-orange-500" />
                </div>
                <h2 className="text-3xl font-normal mb-2">
                  Complete Your Profile
                </h2>
                <p className="text-neutral-600">
                  Tell us a bit about yourself to personalize your experience.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-neutral-600 font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-orange-500 transition-colors duration-300 font-normal"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-neutral-600 font-medium">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        location: e.target.value,
                      })
                    }
                    className="w-full bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-orange-500 transition-colors duration-300 font-normal"
                    placeholder="Nairobi, Kenya"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-neutral-600 font-medium">
                    Preferred Currency
                  </label>
                  <div className="flex gap-4 pt-2 pb-4">
                    <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border cursor-pointer transition-all duration-300 ${profileData.preferredCurrency === 'USD' ? 'border-orange-500 bg-orange-500/10 text-white' : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                      <input
                        type="radio"
                        name="currency"
                        value="USD"
                        checked={profileData.preferredCurrency === 'USD'}
                        onChange={() => setProfileData({ ...profileData, preferredCurrency: 'USD' })}
                        className="hidden"
                      />
                      <span className="font-medium">USD ($)</span>
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border cursor-pointer transition-all duration-300 ${profileData.preferredCurrency === 'KSH' ? 'border-orange-500 bg-orange-500/10 text-white' : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                      <input
                        type="radio"
                        name="currency"
                        value="KSH"
                        checked={profileData.preferredCurrency === 'KSH'}
                        onChange={() => setProfileData({ ...profileData, preferredCurrency: 'KSH' })}
                        className="hidden"
                      />
                      <span className="font-medium">KSH (KSh)</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-neutral-600 font-medium">
                    Bio (Optional)
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-orange-500 transition-colors duration-300 font-normal resize-none"
                    placeholder="Tell us about yourself..."
                    maxLength={200}
                  />
                  <p className="text-xs text-neutral-600 text-right">
                    {profileData.bio.length}/200
                  </p>
                </div>

                <button
                  onClick={handleComplete}
                  disabled={isLoading || !profileData.fullName.trim()}
                  className="w-full bg-white text-black font-semibold py-2 uppercase tracking-wider rounded-full mt-6 hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <IconLoader3 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center mb-6 mx-auto"
                >
                  <IconCheck className="w-10 h-10 text-green-500" />
                </motion.div>
                <h2 className="text-3xl font-normal mb-2 text-center">
                  Profile Complete!
                </h2>
                <p className="text-neutral-600 text-center">
                  Add funds to start forecasting on markets.
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-4 mb-8">
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 text-left">
                  <div className="flex items-start gap-3">
                    <IconCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white mb-1">
                        Email Verified
                      </p>
                      <p className="text-xs text-neutral-500">{userEmail}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 text-left">
                  <div className="flex items-start gap-3">
                    <IconCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white mb-1">
                        Profile Completed
                      </p>
                      <p className="text-xs text-neutral-500">
                        {profileData.fullName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet Prompt */}
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Fund Your Wallet
                    </h3>
                    <p className="text-sm text-neutral-400">
                      Add funds via M-Pesa or USDT to start placing bets on
                      markets.
                    </p>  
                  </div>
                </div>

                <button
                  onClick={() => handleEnterDashboard(true)}
                  disabled={isLoading}
                  className="w-full bg-orange-500 text-white font-semibold py-2 uppercase tracking-wider rounded-full hover:bg-orange-600 transition-all duration-300 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <IconLoader3 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Add Funds Now
                      <IconArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Skip Option */}
              <button
                onClick={() => handleEnterDashboard(false)}
                disabled={isLoading}
                className="w-full text-neutral-300 hover:text-white font-medium text-sm transition-colors cursor-pointer disabled:opacity-50 py-2"
              >
                I'll add funds later
              </button>

              <div className="mt-6 text-center">
                <p className="text-xs text-neutral-200">
                  You can add payment methods anytime from your wallet settings
                  or when placing your first bet.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

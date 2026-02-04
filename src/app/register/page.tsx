"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, LoaderPinwheel, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/useToast"
import Image from "next/image"

export default function RegisterPage() {
  const router = useRouter()
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    dob: "",
    currency: "KSH",
    agreed: false
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!formData.agreed) {
      toast.error("Agreement Required", "You must agree to the terms.")
      setIsLoading(false)
      return
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Identity Created", "Welcome to the inner circle.")
      router.push("/login")
    } catch (error) {
      toast.error("Registration Failed", "System error.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 relative overflow-hidden">

      {/* LEFT SIDE: Brand (White) */}
      <div className="relative bg-white text-black flex flex-col justify-between p-12 lg:p-20 z-10 order-last lg:order-first">
        <div>
          <div className="relative w-24 h-24 md:w-36 md:h-36 mb-2">
            <Image src="/ante-logo.png" alt="Ante Logo" fill className="object-contain" />
          </div>
        </div>

        <div className="max-w-md z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-5xl font-normal tracking-tight leading-tight mb-6">
              Join the house.
            </h1>
            <p className="text-lg text-neutral-600 font-normal leading-relaxed mb-12 md:mb-0">
              Start your journey. High stakes, zero compromise. The table is set.
            </p>
          </motion.div>
        </div>

        <div className="text-sm font-medium text-neutral-500">
          © {new Date().getFullYear()} Ante Social. All rights reserved.
        </div>

        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* RIGHT SIDE: Form (Dark) */}
      <div className="relative bg-[#080808] text-white flex flex-col justify-center p-8 lg:p-24 z-10 order-first lg:order-last">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 lg:mt-0 mt-8">
            <h2 className="text-3xl font-normal mb-2">Create Account</h2>
            <p className="text-neutral-600">Initialize your profile to begin.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-neutral-600 font-medium">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-orange-500 transition-colors duration-300 font-normal"
                  placeholder="jdoe"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-neutral-600 font-medium">DOB</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full bg-transparent border-b border-neutral-800 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors duration-300 font-normal scheme-dark"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-neutral-600 font-medium">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-orange-500 transition-colors duration-300 font-normal"
                placeholder="name@example.com"
                required
              />
            </div>

            {/* M-Pesa / Currency Row */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-neutral-600 font-medium">M-Pesa Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-orange-500 transition-colors duration-300 font-normal"
                  placeholder="+254..."
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-neutral-600 font-medium">Currency</label>
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, currency: "KSH" })}
                    className={`text-sm font-medium transition-colors ${formData.currency === "KSH" ? "text-orange-500 border-b border-orange-500" : "text-neutral-600 hover:text-white"}`}
                  >
                    KSH
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, currency: "USD" })}
                    className={`text-sm font-medium transition-colors ${formData.currency === "USD" ? "text-orange-500 border-b border-orange-500" : "text-neutral-600 hover:text-white"}`}
                  >
                    USD
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-neutral-600 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-orange-500 transition-colors duration-300 font-normal pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 border transition-colors flex items-center justify-center ${formData.agreed ? "bg-orange-500 border-orange-500" : "border-neutral-700 group-hover:border-white"}`}>
                  {formData.agreed && <ArrowRight className="w-3 h-3 text-black" />}
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.agreed}
                    onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                  />
                </div>
                <span className="text-xs text-neutral-600 group-hover:text-neutral-300 transition-colors">
                  I agree to the Terms & Privacy Policy
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-semibold py-2 uppercase tracking-wider rounded-full mt-4 hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? <LoaderPinwheel className="w-5 h-5 animate-spin mx-auto" /> : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center pb-8 lg:pb-0">
            <p className="text-neutral-600 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-white hover:text-orange-500 transition-colors font-medium border-b border-transparent hover:border-orange-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* FLOATING BLOB w/ PARALLAX - ABSOLUTE CENTER */}
      {/* <div className="absolute left-1/2 top-50 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-20 opacity-90 hidden lg:block">
        <motion.div
          animate={{
            y: [20, -20, 20],
            rotate: [0, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-full h-full"
        >
          <Image
            src="/login-blob.png"
            alt="Ante Blob"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      </div> */}

    </div>
  )
}

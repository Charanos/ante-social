"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Loader2, ArrowRight, Wallet, User, Calendar, Phone, Lock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/useToast"

export default function RegisterPage() {
  const router = useRouter()
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [currency, setCurrency] = useState<"KSH" | "USD">("KSH")

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    dob: "",
    agreed: false
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Basic Validation
    if (!formData.agreed) {
      toast.error("Agreement Required", "You must be 18+ and agree to the terms.")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          dob: formData.dob,
          currency: currency
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Success
      toast.success("Account Created!", "Welcome to Ante Social. Please log in.")
      router.push("/login")
    } catch (error: any) {
      toast.error("Registration Failed", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Form Side */}
      <div className="flex items-center justify-center p-6 bg-neutral-50 order-2 lg:order-1">
        <Card className="w-full max-w-md border-none shadow-none bg-transparent">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight">Create an account</CardTitle>
            <CardDescription>
              Join the social betting revolution.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="space-y-8">
              {/* Username & Email */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <label className="text-sm font-medium leading-none" htmlFor="username">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      id="username"
                      type="text"
                      placeholder="jdoe_bets"
                      className="flex h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 px-3 py-2 text-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 font-medium"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-medium leading-none" htmlFor="dob">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      id="dob"
                      type="date"
                      className="flex h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 px-3 py-2 text-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 font-medium"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="flex h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {/* Phone & Currency */}
              <div className="space-y-4">
                <label className="text-sm font-medium leading-none">Phone Number (M-Pesa)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="tel"
                    placeholder="+254 700 000 000"
                    className="flex h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 px-3 py-2 text-sm font-mono placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium leading-none">Primary Currency</label>
                <div className="grid grid-cols-2 gap-3 h-11">
                  <button
                    type="button"
                    onClick={() => setCurrency("KSH")}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium transition-all ${currency === "KSH"
                        ? "border-green-600 bg-green-50 text-green-700 ring-2 ring-green-600 ring-offset-2"
                        : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                      }`}
                  >
                    <span className="font-mono">KSH</span>
                    {currency === "KSH" && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency("USD")}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium transition-all ${currency === "USD"
                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600 ring-offset-2"
                        : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                      }`}
                  >
                    <span className="font-mono">USD</span>
                    {currency === "USD" && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-4">
                <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="flex h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 font-medium pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  checked={formData.agreed}
                  onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                />
                <label htmlFor="terms" className="text-sm text-neutral-500 leading-normal">
                  I confirm I am over 18 years of age and I agree to the Terms of Service and Privacy Policy.
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-black px-8 text-sm font-medium text-white ring-offset-white transition-colors hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 mt-4"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-8 text-center text-sm text-neutral-500">
            <p>
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-black hover:underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Visual Side */}
      <div className="hidden lg:flex relative bg-neutral-900 items-center justify-center overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-black opacity-80" />
        <div className="relative z-10 p-12 text-white max-w-xl">
          <div className="mb-8 p-3 bg-white/10 w-fit rounded-xl backdrop-blur-md border border-white/10">
            <Wallet className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-bold tracking-tighter mb-6">
            Join the High Rollers.
          </h1>
          <div className="space-y-6 text-lg text-neutral-400">
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <p>Instant M-Pesa Withdrawals</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <p>Secure Crypto Deposits</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              <p>Private Group Betting</p>
            </div>
          </div>
        </div>

        {/* Abstract shapes */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>
    </div>
  )
}

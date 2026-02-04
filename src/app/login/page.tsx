"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, LoaderPinwheel, ArrowRight } from "lucide-react"
import { signIn } from "next-auth/react"
import { useToast } from "@/hooks/useToast"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const toast = useToast()

  const [step, setStep] = useState<"credentials" | "2fa">("credentials")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (res?.error) {
        if (res.error.includes("2FA")) {
          setStep("2fa")
        } else {
          toast.error("Login Failed", "Invalid email or password.")
        }
      } else {
        toast.success("Welcome Back", "Successfully logged in.")
        router.push("/dashboard")
      }
    } catch (error) {
      toast.error("Error", "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    toast.info("Feature Update", "2FA pending. Converting...")
    handleLogin(e)
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 relative overflow-hidden">

      {/* LEFT SIDE: Brand (White) */}
      <div className="relative bg-white text-black flex flex-col justify-between p-12 lg:p-20 z-10">
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
              Elevate your game.
            </h1>
            <p className="text-lg text-neutral-600 font-normal leading-relaxed mb-12 md:mb-0">
              Join Kenya's most exclusive social betting circle. Connect with fellow analysts, master the markets, and play with unmatched precision.
            </p>
          </motion.div>
        </div>

        <div className="text-sm font-medium text-neutral-500">
          © {new Date().getFullYear()} Ante Social. All rights reserved.
        </div>

        {/* Subtle background texture for left side */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* RIGHT SIDE: Form (Dark) */}
      <div className="relative bg-[#080808] text-white flex flex-col justify-center p-12 lg:p-24 z-10">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-normal mb-2">
              {step === "credentials" ? "Welcome back" : "Security check"}
            </h2>
            <p className="text-neutral-600">
              {step === "credentials" ? "Enter your credentials to access your account." : "Please verify it's really you."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "credentials" ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleLogin}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-neutral-600 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-orange-500 transition-colors duration-300 font-normal text-lg"
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs uppercase tracking-wider text-neutral-600 font-medium">Password</label>
                    <Link href="/forgot-password" className="text-xs text-orange-500 hover:text-orange-400 transition-colors">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-orange-500 transition-colors duration-300 cursor-pointer font-normal text-lg pr-10"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black font-semibold py-2 uppercase tracking-wider rounded-full mt-8 hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? <LoaderPinwheel className="w-5 h-5 animate-spin mx-auto" /> : "Sign In"}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="2fa-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerify2FA}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-neutral-600 font-medium">Authentication Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-transparent border-b border-neutral-800 py-3 text-white text-center text-3xl tracking-[0.5em] focus:outline-none focus:border-orange-500 transition-colors duration-300"
                    placeholder="000 000"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setStep("credentials")}
                    className="w-full bg-transparent border border-neutral-800 text-neutral-500 font-medium py-3 rounded-full hover:border-neutral-600 hover:text-white transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || twoFactorCode.length !== 6}
                    className="w-full bg-white text-black font-medium py-3 rounded-full hover:bg-orange-500 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? <LoaderPinwheel className="w-5 h-5 animate-spin mx-auto" /> : "Verify"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-12 text-center">
            <p className="text-neutral-600 text-sm">
              New to the platform?{" "}
              <Link href="/register" className="text-white hover:text-orange-500 transition-colors font-medium border-b border-transparent hover:border-orange-500">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* FLOATING BLOB w/ PARALLAX - ABSOLUTE CENTER */}
      {/* <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-20 mix-blend-exclusion opacity-90 hidden lg:block">
        <motion.div
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
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

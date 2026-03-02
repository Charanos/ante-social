"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  IconArrowRight,
  IconEye,
  IconEyeOff,
  IconLoader3,
  IconCheck,
  IconX,
} from "@tabler/icons-react"

import { useToast } from "@/components/ui/toast-notification"
import Image from "next/image"

export default function RegisterPage() {
  const router = useRouter()
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    agreed: false,
  })

  // Password validation helpers
  const passwordRequirements = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
  }

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean)
  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword.length > 0

  const isAdult = (dateString: string) => {
    const dob = new Date(dateString)
    if (Number.isNaN(dob.getTime())) return false

    const now = new Date()
    let age = now.getFullYear() - dob.getFullYear()
    const monthDiff = now.getMonth() - dob.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
      age--
    }

    return age >= 18
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (!formData.agreed) {
      toast.error("Agreement Required", "You must agree to the terms.")
      setIsLoading(false)
      return
    }

    if (!isPasswordValid) {
      toast.error("Weak Password", "Password must meet all requirements.")
      setIsLoading(false)
      return
    }

    if (!passwordsMatch) {
      toast.error(
        "Passwords Don't Match",
        "Please ensure both passwords are identical.",
      )
      setIsLoading(false)
      return
    }

    if (!isAdult(formData.dob)) {
      toast.error(
        "Age Restriction",
        "You must be at least 18 years old to register.",
      )
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          dateOfBirth: formData.dob,
        }),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        const message =
          payload?.error?.message ||
          payload?.message ||
          payload?.error ||
          "Registration failed."

        if (message.toLowerCase().includes("service unavailable")) {
          toast.error(
            "Service Unavailable",
            "Registration backend is unavailable or not configured for this environment.",
          )
          setIsLoading(false)
          return
        }

        toast.error("Registration Failed", message)
        setIsLoading(false)
        return
      }

      // Success - redirect to OTP verification
      toast.success(
        "Account Created",
        "Check your email for verification code.",
      )

      // Store email for OTP page
      sessionStorage.setItem(
        "pendingVerification",
        formData.email.trim().toLowerCase(),
      )

      // Redirect to OTP verification page
      router.push(
        `/verify-email?email=${encodeURIComponent(formData.email.trim().toLowerCase())}`,
      )
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Registration Failed", "System error. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 relative overflow-hidden">
      {/* LEFT SIDE: Brand (White) */}
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
              Join the house.
            </h1>
            <p className="text-lg text-neutral-600 font-normal leading-relaxed mb-12 md:mb-0">
              Start your journey. High stakes, zero compromise. The table is
              set.
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

      {/* RIGHT SIDE: Form (Dark) */}
      <div className="relative bg-[#080808] text-white flex flex-col justify-center p-8 lg:p-24 z-10 order-first lg:order-last overflow-y-auto max-h-screen">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 lg:mt-0 mt-8">
            <h2 className="text-3xl font-normal mb-2">Create Account</h2>
            <p className="text-neutral-600">
              Initialize your profile to begin.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-neutral-600 font-medium">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-orange-500 transition-colors duration-300 font-normal"
                  placeholder="jdoe"
                  required
                  minLength={3}
                  maxLength={20}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-neutral-600 font-medium">
                  DOB
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-neutral-800 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors duration-300 font-normal scheme-dark"
                  required
                  max={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 18),
                    )
                      .toISOString()
                      .split("T")[0]
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-neutral-600 font-medium">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-orange-500 transition-colors duration-300 font-normal"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-neutral-600 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-orange-500 transition-colors duration-300 font-normal pr-10"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-600 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <IconEyeOff className="w-5 h-5" />
                  ) : (
                    <IconEye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              {formData.password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-1 mt-2"
                >
                  <PasswordRequirement
                    met={passwordRequirements.minLength}
                    text="At least 8 characters"
                  />
                  <PasswordRequirement
                    met={passwordRequirements.hasUppercase}
                    text="One uppercase letter"
                  />
                  <PasswordRequirement
                    met={passwordRequirements.hasLowercase}
                    text="One lowercase letter"
                  />
                  <PasswordRequirement
                    met={passwordRequirements.hasNumber}
                    text="One number"
                  />
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-neutral-600 font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-orange-500 transition-colors duration-300 font-normal pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-600 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <IconEyeOff className="w-5 h-5" />
                  ) : (
                    <IconEye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Match Indicator */}
              {formData.confirmPassword.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 mt-2"
                >
                  {passwordsMatch ? (
                    <>
                      <IconCheck className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-green-500">
                        Passwords match
                      </span>
                    </>
                  ) : (
                    <>
                      <IconX className="w-4 h-4 text-red-500" />
                      <span className="text-xs text-red-500">
                        Passwords don't match
                      </span>
                    </>
                  )}
                </motion.div>
              )}
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`w-4 h-4 border transition-colors flex items-center justify-center ${formData.agreed ? "bg-orange-500 border-orange-500" : "border-neutral-700 group-hover:border-white"}`}
                >
                  {formData.agreed && (
                    <IconArrowRight className="w-3 h-3 text-black" />
                  )}
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.agreed}
                    onChange={(e) =>
                      setFormData({ ...formData, agreed: e.target.checked })
                    }
                  />
                </div>
                <span className="text-xs text-neutral-600 group-hover:text-neutral-300 transition-colors">
                  I agree to the{" "}
                  <Link
                    href="/legal/terms-of-service"
                    className="text-orange-500 hover:underline"
                  >
                    Terms
                  </Link>{" "}
                  &{" "}
                  <Link
                    href="/legal/privacy-policy"
                    className="text-orange-500 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={
                isLoading ||
                !isPasswordValid ||
                !passwordsMatch ||
                !formData.agreed
              }
              className="w-full bg-white text-black font-semibold py-2 uppercase tracking-wider rounded-full mt-4 hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <IconLoader3 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center pb-8 lg:pb-0">
            <p className="text-neutral-600 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-white hover:text-orange-500 transition-colors font-medium border-b border-transparent hover:border-orange-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper component for password requirements
function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <IconCheck className="w-3 h-3 text-green-500" />
      ) : (
        <IconX className="w-3 h-3 text-neutral-600" />
      )}
      <span
        className={`text-[10px] ${met ? "text-green-500" : "text-neutral-600"}`}
      >
        {text}
      </span>
    </div>
  )
}
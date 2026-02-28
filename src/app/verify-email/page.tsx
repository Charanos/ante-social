"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { IconLoader3, IconMail, IconArrowLeft } from "@tabler/icons-react"
import { useToast } from "@/components/ui/toast-notification"
import Image from "next/image"
import Link from "next/link"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()
  
  const email = searchParams?.get('email') || sessionStorage.getItem('pendingVerification') || ''
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      toast.error("No Email Found", "Please register first.")
      router.push('/register')
    }
  }, [email, router, toast])

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields filled
    if (value && index === 5 && newOtp.every(digit => digit)) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace: clear current and focus previous
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    // Arrow keys navigation
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    
    // Only accept 6-digit numbers
    if (!/^\d{6}$/.test(pastedData)) {
      toast.error("Invalid Code", "Please paste a 6-digit code.")
      return
    }

    const digits = pastedData.split('')
    setOtp(digits)
    
    // Focus last input
    inputRefs.current[5]?.focus()
    
    // Auto-submit
    handleVerify(pastedData)
  }

  const handleVerify = async (code?: string) => {
    const otpCode = code || otp.join('')
    
    if (otpCode.length !== 6) {
      toast.error("Incomplete Code", "Please enter all 6 digits.")
      return
    }

    setIsVerifying(true)

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: otpCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(
          "Verification Failed",
          data?.message || "Invalid or expired code."
        )
        // Clear OTP on error
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
        setIsVerifying(false)
        return
      }

      // Success
      toast.success("Email Verified", "Redirecting to onboarding...")
      
      // Clear pending verification
      sessionStorage.removeItem('pendingVerification')
      
      // Set flag for onboarding
      sessionStorage.setItem('needsOnboarding', 'true')
      sessionStorage.setItem('userEmail', email)
      
      // Redirect to onboarding
      setTimeout(() => {
        router.push('/onboarding')
      }, 1000)

    } catch (error) {
      console.error('Verification error:', error)
      toast.error("Verification Failed", "System error. Please try again.")
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    setIsResending(true)

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error("Resend Failed", data?.message || "Could not resend code.")
        setIsResending(false)
        return
      }

      toast.success("Code Sent", "Check your email for a new verification code.")
      
      // Reset countdown
      setCountdown(60)
      setCanResend(false)
      
      // Clear current OTP
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()

    } catch (error) {
      console.error('Resend error:', error)
      toast.error("Resend Failed", "System error. Please try again.")
    } finally {
      setIsResending(false)
    }
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
              Almost there.
            </h1>
            <p className="text-lg text-neutral-600 font-normal leading-relaxed">
              We've sent a 6-digit code to your email. Enter it to verify your
              account and complete registration.
            </p>
          </motion.div>
        </div>

        <div className="text-sm font-medium my-6 text-neutral-500">
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

      {/* RIGHT SIDE: OTP Form */}
      <div className="relative bg-[#080808] text-white flex flex-col justify-center p-8 lg:p-24 z-10 order-first lg:order-last">
        <div className="max-w-md w-full mx-auto">
          {/* Back Button */}
          <Link href="/register">
            <motion.button
              whileHover={{ x: -4 }}
              className="flex items-center cursor-pointer gap-2 text-neutral-600 hover:text-white transition-colors mb-8"
            >
              <IconArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to register</span>
            </motion.button>
          </Link>

          <div className="mb-10">
            <h2 className="text-3xl font-normal mb-2">Verify Your Email</h2>
            <p className="text-neutral-600">
              Enter the 6-digit code sent to
            </p>
            <p className="text-white font-medium my-4">{email}</p>
          </div>

          {/* OTP Input */}
          <div className="mb-8">
            <div className="flex gap-3 justify-between mb-6" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-full aspect-square text-center text-2xl font-semibold bg-transparent border-b-2 border-neutral-800 focus:border-orange-500 focus:outline-none transition-colors text-white"
                  disabled={isVerifying}
                />
              ))}
            </div>

            {/* Resend Button */}
            <div className="text-center">
              {canResend ? (
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-sm cursor-pointer text-orange-500 hover:text-orange-400 font-medium transition-colors disabled:opacity-50"
                >
                  {isResending ? (
                    <span className="flex cursor-not-allowed items-center gap-2 justify-center">
                      <IconLoader3 className="w-4 h-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Resend Code"
                  )}
                </button>
              ) : (
                <p className="text-sm text-neutral-600">
                  Resend code in <span className="text-white font-mono">{countdown}s</span>
                </p>
              )}
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={() => handleVerify()}
            disabled={isVerifying || otp.some(digit => !digit)}
            className="w-full bg-white text-black font-semibold py-2 uppercase tracking-wider rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <IconLoader3 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              "Verify Email"
            )}
          </button>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-xs text-neutral-600">
              Didn't receive the code? Check your spam folder or{" "}
              <button
                onClick={handleResend}
                disabled={!canResend || isResending}
                className="text-orange-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

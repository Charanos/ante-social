"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { signIn } from "next-auth/react"
import { useToast } from "@/hooks/useToast"

export default function LoginPage() {
  const router = useRouter()
  const toast = useToast()
  
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<"credentials" | "2fa">("credentials")
  
  // Form State
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [twoFactorCode, setTwoFactorCode] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        // Check if error implies 2FA required (custom logic or status)
        // For now, simpler handling: if error is standard, show it.
        // If we implement HTTP 428 equivalent in NextAuth, it's tricky.
        // We will assume simpler flow: Login successful -> Dashboard.
        // Or if we want pre-2FA check, we'd need a custom endpoint fetch first.
        // Given current AuthConfig, it just validates credentials. 
        // 2FA enforcement is handled via checking 'two_factor_enabled' in user object mostly?
        // Or we should update the provider to throw a specific error?
        // Let's stick to standard sign-in for now. 
        // If 2FA is needed, the USER object in session has 'two_factor_enabled'.
        // This login page handles 'pre-login' 2FA? Or 'post-login' 2FA?
        // Standard flow: Login -> (if 2FA) -> 2FA Page -> Dashboard.
        // But NextAuth Credentials provider signs you in immediately.
        // We might want to protect Dashboard with middleware that checks 2FA status?
        // Or we handle 2FA in the `authorize` callback throwing an error if 2FA code missing?
        // Let's go with: Login -> Success. If they need 2FA, the middleware or dashboard prompts it.
        // Wait, the UI has a "2FA Step".
        // Let's implement the 'verify' logic on the second step.
        // But the first step 'signIn' logs them in.
        // Modified Flow: 
        // 1. Credentials check (custom API or signIn with fake password to check existence? no)
        // 2. We will use signIn. If successful, we check session.
        // Actually, for this specific "2FA Step" UI, we usually verify credentials first, then ask for code, THEN sign in fully.
        // But NextAuth makes this hard.
        // OPTION 2: Just sign in directly.
        // If user has 2FA, prompt for it AFTER login (interstitial) or
        // pass code TO signIn: signIn('credentials', { ..., code: '...' })
        // Let's assume we pass code if step is 2fa.
        
        // REVISED PLAN:
        // We will modify the login form to handle this.
        // But the `authorize` function generally expects all credentials at once.
        // I will implement standard signIn. If it fails, toast error.
        
        toast.error("Login Failed", "Invalid email or password")
      } else {
        toast.success("Welcome back!", "Redirecting to dashboard...")
        router.push("/dashboard")
      }
    } catch (error) {
      toast.error("Login Error", "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  // NOTE: This UI had a 2-step flow mock. 
  // With standard NextAuth Credentials, we typically bundle the 2FA code with the password 
  // OR we rely on a separate 2FA flow. 
  // To keep it simple and working: We just use standard login for now.
  // The 'step' state is kept for future expansion if we add 'pre-flight' checks.
  
  const handleVerify2FA = async (e: React.FormEvent) => {
      // This would be used if we had a multi-stage login API.
      // For now, let's merge with handleLogin or simplify.
      // I will keep the function signature but warn it's not fully wired to NextAuth yet without custom backend logic.
      e.preventDefault();
      toast.info("Feature Update", "2FA Login integration pending backend update. Converting to standard login.");
      // Fallback
      handleLogin(e);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Visual Side */}
      <div className="hidden lg:flex relative bg-black items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-800 via-black to-black opacity-50" />
        <div className="relative z-10 p-12 text-white max-w-xl">
          <div className="mb-8 p-3 bg-white/10 w-fit rounded-xl backdrop-blur-md border border-white/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-medium tracking-tight mb-6">
            Welcome back to the arena.
          </h1>
          <p className="text-lg text-neutral-400 leading-relaxed">
            The market never sleeps. Secure your position, analyze the trends, and make your move.
          </p>
        </div>
        
        {/* Abstract shapes */}
        <motion.div 
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-6 bg-neutral-50">
        <Card className="w-full max-w-md border-none shadow-none bg-transparent">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-medium tracking-tight">
              {step === "credentials" ? "Sign in" : "Two-Factor Auth"}
            </CardTitle>
            <CardDescription>
              {step === "credentials" 
                ? "Enter your credentials to access your account" 
                : "Enter the 6-digit code from your authenticator app"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {step === "credentials" ? (
              <form onSubmit={handleLogin} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="flex h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium leading-none" htmlFor="password">
                      Password
                    </label>
                    <Link 
                      href="/forgot-password" 
                      className="text-sm font-medium text-neutral-500 hover:text-black transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="flex h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-medium pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex h-11 cursor-pointer w-full items-center justify-center rounded-xl bg-black px-8 text-sm font-medium text-white ring-offset-white transition-colors hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Sign In <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify2FA} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Authentication Code</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000 000"
                      className="flex h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 px-3 py-2 text-lg tracking-widest ring-offset-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-mono text-center"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("credentials")}
                    disabled={isLoading}
                    className="flex-1 inline-flex h-11 items-center justify-center rounded-xl border border-neutral-200 bg-transparent px-4 text-sm font-medium text-black ring-offset-white transition-colors hover:bg-neutral-100"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || twoFactorCode.length !== 6}
                    className="flex-1 inline-flex h-11 items-center justify-center rounded-xl bg-black px-8 text-sm font-medium text-white transition-colors hover:bg-neutral-900 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                  </button>
                </div>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-8 text-center text-sm text-neutral-500">
            <p>
              Don't have an account?{" "}
              <Link href="/register" className="font-medium text-black hover:underline underline-offset-4">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { ToastContainer } from "@/components/ui/toast-notification"
import { useToastStore } from "@/hooks/useToast"

export function Providers({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useToastStore()
  
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
        {children}
        <ToastContainer toasts={toasts.map(t => ({ ...t, onClose: removeToast }))} />
      </ThemeProvider>
    </SessionProvider>
  )
}

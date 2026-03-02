import { useSession } from "next-auth/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export type CurrencyType = "USD" | "KSH"

// Helper to format currency regardless of React lifecycle
export function formatCurrencyString(amount: number, currency: CurrencyType = "USD", options?: { compact?: boolean }): string {
  if (options?.compact && amount >= 1000) {
    const value = amount / 1000
    const suffix = "K"
    const formatted = value.toLocaleString(currency === "KSH" ? "en-KE" : "en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })
    return currency === "KSH" ? `KSh ${formatted}${suffix}` : `$${formatted}${suffix}`
  }

  if (currency === "KSH") {
    // KSh formatting
    return `KSh ${amount.toLocaleString("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // USD default
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function useCurrency() {
  const { data: session } = useSession()

  // Fetch user profile to get preferredCurrency
  const { data: profile } = useQuery({
    queryKey: ["userProfile", session?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/user/profile")
      if (!response.ok) throw new Error("Failed to fetch profile")
      return response.json()
    },
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Fetch latest exchange rates (USD base) for KES conversion
  const { data: rates, isLoading: ratesLoading } = useQuery({
    queryKey: ["exchangeRates", "USD"],
    queryFn: async () => {
      const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY || "0e77530835c88c969e365ebe"
      const apiUrl = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_URL || "https://v6.exchangerate-api.com/v6"
      
      const resp = await fetch(`${apiUrl}/${apiKey}/latest/USD`)
      if (!resp.ok) throw new Error("Failed to fetch exchange rates")
      const json = await resp.json()
      
      if (json.result === "success") {
        return json.conversion_rates // v6 uses conversion_rates instead of rates
      }
      throw new Error(json["error-type"] || "Failed to fetch exchange rates")
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })

  const preferredCurrency: CurrencyType = profile?.preferredCurrency || "USD"

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (newCurrency: CurrencyType) => {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferredCurrency: newCurrency }),
      })
      if (!response.ok) throw new Error("Failed to update currency")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", session?.user?.id] })
    },
  })

  // Optimistically toggle currency
  const toggleCurrency = () => {
    const nextCurrency = preferredCurrency === "USD" ? "KSH" : "USD"
    mutation.mutate(nextCurrency)
  }

  /**
   * Helper to convert between currencies
   */
  const convertAmount = (amount: number, from: CurrencyType, to: CurrencyType) => {
    if (from === to) return amount
    // The API uses KES, but our app uses KSH. Handle both.
    const kesRate = rates?.KES || rates?.KSH 
    if (!kesRate) return amount // Fallback if rates not loaded

    if (from === "USD" && to === "KSH") {
      return amount * kesRate
    }
    if (from === "KSH" && to === "USD") {
      return amount / kesRate
    }
    return amount
  }

  /**
   * Format an amount (assumed to be in KSH base) using the user's preferred currency
   */
  const formatCurrency = (amount: number, from: CurrencyType = "KSH", options?: { compact?: boolean }) => {
    const converted = convertAmount(amount, from, preferredCurrency)
    return formatCurrencyString(converted, preferredCurrency, options)
  }

  return {
    preferredCurrency,
    formatCurrency,
    convertAmount,
    toggleCurrency,
    isToggling: mutation.isPending,
    symbol: preferredCurrency === "KSH" ? "KSh" : "$",
    // Expose raw exchange rates for UI reference
    exchangeRates: rates,
    isLoading: ratesLoading,
  }
}

import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api"

function toIsoDate(value: unknown, fallback: Date) {
  if (typeof value !== "string") return fallback.toISOString()
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return fallback.toISOString()
  return parsed.toISOString()
}

function normalizeOutcomes(value: unknown) {
  if (!Array.isArray(value)) {
    return [
      { optionText: "Yes" },
      { optionText: "No" },
    ]
  }

  const outcomes = value
    .map((item) => {
      if (typeof item === "string") return { optionText: item }
      if (!item || typeof item !== "object") return null
      const optionText =
        (item as { optionText?: unknown }).optionText ||
        (item as { text?: unknown }).text ||
        (item as { label?: unknown }).label
      if (typeof optionText !== "string" || !optionText.trim()) return null
      return {
        optionText: optionText.trim(),
        mediaUrl:
          typeof (item as { mediaUrl?: unknown }).mediaUrl === "string"
            ? (item as { mediaUrl: string }).mediaUrl
            : typeof (item as { image?: unknown }).image === "string"
              ? (item as { image: string }).image
              : undefined,
        mediaType:
          typeof (item as { mediaType?: unknown }).mediaType === "string"
            ? (item as { mediaType: string }).mediaType
            : undefined,
      }
    })
    .filter((item): item is { optionText: string; mediaUrl?: string; mediaType?: string } => Boolean(item))

  if (outcomes.length >= 2) return outcomes
  return [
    { optionText: "Yes" },
    { optionText: "No" },
  ]
}

export async function GET(req: NextRequest) {
  return proxyBackendRequest({
    path: "/api/v1/markets",
    method: "GET",
    searchParams: req.nextUrl.searchParams,
  })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => ({} as Record<string, unknown>))
  const now = new Date()
  const closeFallback = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const settlementFallback = new Date(Date.now() + 25 * 60 * 60 * 1000)

  const payload = {
    title: typeof body.title === "string" ? body.title : "Untitled market",
    description: typeof body.description === "string" ? body.description : "No description provided",
    betType:
      (typeof body.betType === "string" ? body.betType : undefined) ||
      (typeof body.type === "string" ? body.type : undefined) ||
      "consensus",
    buyInAmount: Number(body.buyInAmount ?? body.buyIn ?? body.amount ?? 1),
    closeTime: toIsoDate(body.closeTime ?? body.closeDate ?? body.endsAt, closeFallback),
    settlementTime: toIsoDate(body.settlementTime ?? body.settlesAt, settlementFallback),
    startTime: toIsoDate(body.startTime, now),
    marketDuration:
      typeof body.marketDuration === "string"
        ? body.marketDuration
        : typeof body.duration === "string"
          ? body.duration
          : "daily",
    minParticipants: Number(body.minParticipants ?? 2),
    maxParticipants:
      body.maxParticipants !== undefined ? Number(body.maxParticipants) : undefined,
    settlementMethod:
      typeof body.settlementMethod === "string" ? body.settlementMethod : "admin_report",
    oddsType: typeof body.oddsType === "string" ? body.oddsType : "pari_mutuel",
    outcomes: normalizeOutcomes(body.outcomes ?? body.options),
    tags: Array.isArray(body.tags)
      ? body.tags.filter((tag: unknown): tag is string => typeof tag === "string")
      : [],
    mediaUrl: typeof body.mediaUrl === "string" ? body.mediaUrl : undefined,
    mediaType: typeof body.mediaType === "string" ? body.mediaType : undefined,
  }

  return proxyBackendRequest({
    path: "/api/v1/markets",
    method: "POST",
    token,
    jsonBody: payload,
  })
}

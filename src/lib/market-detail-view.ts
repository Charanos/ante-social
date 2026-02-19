const DEFAULT_MARKET_IMAGE =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80";

const DEFAULT_OPTION_IMAGE =
  "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800&auto=format&fit=crop&q=80";

function toString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function toDate(value: unknown, fallback: Date): Date {
  if (value instanceof Date && Number.isFinite(value.getTime())) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (Number.isFinite(parsed.getTime())) return parsed;
  }
  return fallback;
}

type RawOutcome = {
  _id?: unknown;
  id?: unknown;
  optionText?: unknown;
  option_text?: unknown;
  text?: unknown;
  label?: unknown;
  participantCount?: unknown;
  votes?: unknown;
  totalAmount?: unknown;
  amount?: unknown;
  mediaUrl?: unknown;
  image?: unknown;
};

type RawParticipant = {
  username?: unknown;
  userId?: unknown;
  name?: unknown;
  totalStake?: unknown;
  total_stake?: unknown;
  amountContributed?: unknown;
  amount?: unknown;
  timestamp?: unknown;
  joinedAt?: unknown;
  createdAt?: unknown;
};

export type MarketOptionView = {
  id: string;
  option_text: string;
  votes: number;
  percentage: number;
  image: string;
  total_amount: number;
};

export type MarketParticipantView = {
  username: string;
  total_stake: number;
  timestamp: Date;
};

export type MarketDetailView = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  market_type: string;
  buy_in_amount: number;
  minStake: number;
  total_pool: number;
  poolAmount: number;
  participant_count: number;
  participantCount: number;
  status: string;
  close_date: Date;
  endsAt: string;
  options: MarketOptionView[];
  participants: MarketParticipantView[];
  scenario: string;
  raw: any;
};

export function mapMarketToDetailView(raw: any): MarketDetailView {
  const outcomes = toArray<RawOutcome>(raw?.outcomes || raw?.options);
  const voteDenominator = outcomes.reduce(
    (sum, outcome) =>
      sum + toNumber(outcome?.participantCount ?? outcome?.votes),
    0,
  );
  const amountDenominator = outcomes.reduce(
    (sum, outcome) => sum + toNumber(outcome?.totalAmount ?? outcome?.amount),
    0,
  );
  const denominator = voteDenominator > 0 ? voteDenominator : amountDenominator;

  const options: MarketOptionView[] = outcomes.map((outcome, index) => {
    const votes = toNumber(outcome?.participantCount ?? outcome?.votes);
    const totalAmount = toNumber(outcome?.totalAmount ?? outcome?.amount);
    const percentageRaw =
      denominator > 0
        ? voteDenominator > 0
          ? (votes / denominator) * 100
          : (totalAmount / denominator) * 100
        : 0;
    const percentage = Math.max(0, Math.min(100, Math.round(percentageRaw)));

    return {
      id: toString(outcome?._id || outcome?.id, `opt-${index + 1}`),
      option_text: toString(
        outcome?.optionText || outcome?.option_text || outcome?.text || outcome?.label,
        `Option ${index + 1}`,
      ),
      votes,
      percentage,
      image: toString(outcome?.mediaUrl || outcome?.image, DEFAULT_OPTION_IMAGE),
      total_amount: totalAmount,
    };
  });

  const participants = toArray<RawParticipant>(raw?.participants).map(
    (participant, index) => {
      const userObj =
        participant?.userId && typeof participant.userId === "object"
          ? (participant.userId as { username?: unknown })
          : {};
      const usernameRaw =
        toString(participant?.username) ||
        toString(userObj?.username) ||
        toString(participant?.name);

      return {
        username: usernameRaw || `@participant_${index + 1}`,
        total_stake: toNumber(
          participant?.totalStake ??
            participant?.total_stake ??
            participant?.amountContributed ??
            participant?.amount,
        ),
        timestamp: toDate(
          participant?.timestamp ??
            participant?.joinedAt ??
            participant?.createdAt,
          new Date(),
        ),
      };
    },
  );

  const tags = toArray<string>(raw?.tags);
  const marketType = toString(raw?.betType || raw?.marketType || raw?.type, "consensus");
  const category =
    toString(raw?.category) ||
    toString(tags[0]) ||
    marketType.replace(/_/g, " ");

  const closeDate = toDate(
    raw?.closeTime || raw?.close_date || raw?.endsAt || raw?.settlementTime,
    new Date(Date.now() + 24 * 60 * 60 * 1000),
  );
  const buyInAmount = toNumber(
    raw?.buyInAmount ?? raw?.buy_in_amount ?? raw?.minStake,
    1,
  );
  const totalPool = toNumber(raw?.totalPool ?? raw?.total_pool ?? raw?.poolAmount);
  const participantCount = toNumber(
    raw?.participantCount ?? raw?.participant_count,
    participants.length,
  );

  return {
    id: toString(raw?._id || raw?.id),
    title: toString(raw?.title, "Untitled Market"),
    description: toString(raw?.description),
    image: toString(raw?.mediaUrl || raw?.imageUrl || raw?.image, DEFAULT_MARKET_IMAGE),
    category,
    market_type: marketType,
    buy_in_amount: buyInAmount,
    minStake: buyInAmount,
    total_pool: totalPool,
    poolAmount: totalPool,
    participant_count: participantCount,
    participantCount,
    status: toString(raw?.status, "active"),
    close_date: closeDate,
    endsAt: closeDate.toISOString(),
    options,
    participants,
    scenario: toString(raw?.scenario || raw?.description),
    raw,
  };
}

export function extractCreatedPredictionId(payload: any): string | null {
  return (
    toString(payload?._id) ||
    toString(payload?.id) ||
    toString(payload?.data?._id) ||
    toString(payload?.data?.id) ||
    null
  );
}

export function parseApiError(payload: any, fallback: string): string {
  return (
    toString(payload?.message) ||
    toString(payload?.error) ||
    toString(payload?.details) ||
    fallback
  );
}

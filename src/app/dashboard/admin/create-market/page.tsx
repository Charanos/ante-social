"use client";

import { MarketCreationForm } from "@/components/market/MarketCreationForm";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateMarketPage() {
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    if (!data.type || !data.title || !data.description || !data.buyIn) {
      toast.error("Missing Fields", "Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const typeMap: Record<string, string> = {
        poll: "consensus", betrayal: "betrayal", reflex: "reflex",
        ladder: "ladder", divergence: "divergence",
        prisoner_dilemma: "betrayal", syndicate: "betrayal",
      };

      const outcomesSource = data.type === "ladder" ? data.ladderItems : data.options;
      const betrayalOutcomes = [{ optionText: "Cooperate" }, { optionText: "Betray" }];
      const outcomes = data.type === "betrayal"
        ? betrayalOutcomes
        : (outcomesSource || [])
            .map((item: any) => ({
              optionText: item?.text as string,
              mediaUrl: item?.imageUrl || undefined,
              mediaType: item?.imageUrl ? "image" : "none",
            }))
            .filter((item: any) => Boolean(item.optionText));

      const closeTime = data.closeDate
        ? new Date(data.closeDate).toISOString()
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const settlementTime = new Date(new Date(closeTime).getTime() + 60 * 60 * 1000).toISOString();

      const response = await fetch("/api/markets", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          betType: typeMap[data.type] || data.type,
          title: data.title,
          description: data.description,
          category: data.category || undefined,
          isFeatured: data.isFeatured || false,
          isTrending: data.isTrending || false,
          buyInAmount: Number(data.buyIn),
          buyInCurrency: data.buyInCurrency || "KSH",
          closeTime,
          settlementTime,
          outcomes,
          tags: [data.type],
          mediaUrl: data.mediaUrl || undefined,
          scenario: data.scenario,
        }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.error || "Failed to create market");
      }

      toast.success("Market Created!", `${data.title} market created successfully`);
      setIsSubmitting(false);
      router.push("/dashboard/admin/markets");
    } catch (error: any) {
      setIsSubmitting(false);
      toast.error("Create Failed", error?.message || "Could not create market");
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        <MarketCreationForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}

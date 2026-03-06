"use client";

import { useEffect, useState } from "react";
import { IconAlertTriangle } from '@tabler/icons-react';
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { MarketCreationForm } from "@/components/market/MarketCreationForm";
import { useLiveUser } from "@/lib/live-data";

type MarketFormOption = {
  text?: string;
  emoji?: string;
  imageUrl?: string;
};

type MarketFormData = {
  type?: string;
  title?: string;
  description?: string;
  category?: string;
  isFeatured?: boolean;
  buyIn?: string | number;
  buyInCurrency?: string;
  closeDate?: string;
  scenario?: string;
  mediaUrl?: string;
  options?: MarketFormOption[];
  ladderItems?: MarketFormOption[];
};

export default function CreateMarketPage() {
  const router = useRouter();
  const toast = useToast();
  const { user } = useLiveUser();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(user.role === "admin");
    setIsLoading(false);
  }, [user.role]);

  const handleSubmit = async (data: MarketFormData) => {
    if (!data.type || !data.title || !data.description || !data.buyIn) {
      toast.error("Missing Fields", "Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const typeMap: Record<string, string> = {
        poll: "consensus",
        betrayal: "betrayal",
        reflex: "reflex",
        ladder: "ladder",
        divergence: "divergence",
        prisoner_dilemma: "betrayal",
        syndicate: "betrayal",
      };

      const outcomesSource = data.type === "ladder" ? data.ladderItems : data.options;
      const betrayalOutcomes = [
        { optionText: "Cooperate" },
        { optionText: "Betray" },
      ];
      const outcomes = data.type === "betrayal"
        ? betrayalOutcomes
        : (outcomesSource || [])
            .map((item: any) => ({
              optionText: item?.text as string,
              mediaUrl: item?.imageUrl || undefined,
              mediaType: item?.imageUrl ? "image" : "none",
            }))
            .filter((item) => Boolean(item.optionText));

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
      router.push("/dashboard/markets");
    } catch (error: unknown) {
      setIsSubmitting(false);
      const message = error instanceof Error ? error.message : "Could not create market";
      toast.error("Create Failed", message);
    }
  };

  if (isLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <IconAlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-500">
            Only platform administrators can create new markets.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 pl-0 md:pl-8">
      <div className="max-w-full mx-auto px-6 pb-8">
        {/* Header */}
        <MarketCreationForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}

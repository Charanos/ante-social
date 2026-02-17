"use client";

import { MarketCreationForm } from "@/components/market/MarketCreationForm";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateMarketPage() {
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (data: any) => {
    if (!data.type || !data.title || !data.description || !data.buyIn) {
      toast.error("Missing Fields", "Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success(
        "Market Created!",
        `${data.title} market created successfully`
      );
      setIsSubmitting(false);
      router.push("/dashboard/admin/markets");
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        <DashboardHeader subtitle="Choose a market type and configure the details" />
        <MarketCreationForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}

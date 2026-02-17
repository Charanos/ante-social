"use client";

import { useEffect, useState } from "react";
import { IconAlertTriangle } from '@tabler/icons-react';
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/hooks/useToast";
import { mockUser } from "@/lib/mockData";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { MarketCreationForm } from "@/components/market/MarketCreationForm";

export default function CreateMarketPage() {
  const router = useRouter();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Simulate checking permissions - Only platform admins can create markets
    const checkAccess = () => {
      if (mockUser.role !== "admin") {
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setIsAdmin(true);
      }
      setIsLoading(false);
    };

    setTimeout(checkAccess, 1000);
  }, [router]);

  const handleSubmit = (data: any) => {
    if (!data.type || !data.title || !data.description || !data.buyIn) {
      toast.error("Missing Fields", "Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    toast.success(
      "Market Created!",
      `${data.title} market created successfully`,
    );
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard/markets");
    }, 1500);
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
            Only platform administrators can create new markets. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 pl-0 md:pl-8">
      <div className="max-w-full mx-auto px-6 pb-8">
        {/* Header */}
        <DashboardHeader
          user={mockUser}
          subtitle="Deploy a new prediction market with high-fidelity configuration"
        />

        <MarketCreationForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}

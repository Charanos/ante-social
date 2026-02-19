import { HallOfFameSection } from "@/components/landing/HallOfFameSection";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";

export default function LeaderboardPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Hall of Fame"
        description="See who's dominating the markets. Compete, climb the ranks, and earn your place among the elite."
      />
      <HallOfFameSection />
    </PageLayout>
  );
}

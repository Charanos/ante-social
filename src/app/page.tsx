import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { GameModes } from "@/components/landing/GameModes";
import { CurrencySection } from "@/components/landing/CurrencySection";
import { Testimonials } from "@/components/landing/Testimonials";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black overflow-x-hidden">
      <Navbar />
      <Hero />
      <FeatureGrid />
      <GameModes />
      <CurrencySection />
      <Testimonials />
      <Footer />
    </main>
  );
}

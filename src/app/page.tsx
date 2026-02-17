import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { GameModes } from "@/components/landing/GameModes";
import { VisualShowcase } from "@/components/landing/VisualShowcase";
import { CurrencySection } from "@/components/landing/CurrencySection";
import { Testimonials } from "@/components/landing/Testimonials";
import { Footer } from "@/components/landing/Footer";
import { WaveBackground } from "@/components/landing/WaveBackground";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section - Wave Bottom */}
      <div className="relative">
        <Hero />
        <WaveBackground variant="bottom" className="text-black/5" />
      </div>

      {/* Features - Wave Top (Transition from Hero) */}
      {/* Note: If Hero has bottom wave, Features having top wave might double up or create a gap depending on overlap. 
          To alternate properly as "top/bottom alternating of the landing page sections", 
          Hero: [Wave Bottom] 
          Features: [Wave Top] (at its start)
          GameModes: [Wave Bottom] (at its end)
          VisualShowcase: [Wave Top] (at its start)
          Currency: [Wave Bottom] (at its end)
          Testimonials: [Wave Top] (at its start)
      */}

      <div className="relative">
        <WaveBackground variant="top" className="text-black/5" />
        <FeatureGrid />
      </div>

      <div className="relative">
        <GameModes />
        <WaveBackground variant="bottom" className="text-black/5" />
      </div>

      <div className="relative">
        <WaveBackground variant="top" className="text-black/5" />
        <VisualShowcase />
      </div>

        <div className="relative">
        <CurrencySection />
        <WaveBackground variant="bottom" className="text-black/5" />
      </div>

      <div className="relative">
        <WaveBackground variant="top" className="text-black/5" />
        <Testimonials />
      </div>

      <Footer />
    </main>
  );
}

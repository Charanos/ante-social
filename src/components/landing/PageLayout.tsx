
"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { WaveBackground } from "@/components/landing/WaveBackground"; // Assuming WaveBackground is exported or I need to move it

// Creating a local WaveBackground since it was internal to Hero.tsx and Footer.tsx
// Ideally I should extract it, but for now I will duplicate the simplified version or assume I can extract it.
// I'll extract it to a separate file first in the next step if I haven't already. 
// Wait, I see WaveBackground in the file list from `list_dir` in step 85. 
// "WaveBackground.tsx","sizeBytes":"2639"
// So I can import it.

export default function PageLayout({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={`min-h-screen bg-white text-black selection:bg-black/10 selection:text-black overflow-x-hidden ${className}`}>
      <Navbar />
      
      {/* Shared Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-neutral-50/40 via-white to-white" />
         <WaveBackground />
      </div>

      <div className="relative z-10 pt-16">
        {children}
      </div>
      
      <Footer />
    </main>
  );
}

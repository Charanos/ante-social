
"use client";

import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { IconCookie } from "@tabler/icons-react";

export default function CookiePage() {
    const sections = [
        {
          id: "what-are-cookies",
          title: "1. What are Cookies?",
          content: (
            <p>
              Cookies are small text files stored on your device when you visit a website. They help us remember your preferences, keep you logged in,
              and understand how you use our platform so we can improve it.
            </p>
          ),
        },
        {
          id: "types",
          title: "2. Types of Cookies We Use",
          content: (
            <ul>
                <li><strong>Strictly Necessary Cookies:</strong> Essential for the website to function (e.g., logging in, making bets).</li>
                <li><strong>Performance Cookies:</strong> Help us analyze site traffic and improve performance.</li>
                <li><strong>Functional Cookies:</strong> Remember your settings and preferences (e.g., dark mode, language).</li>
            </ul>
          ),
        },
        {
          id: "managing",
          title: "3. Managing Cookies",
          content: (
            <p>
              You can control and manage cookies through your browser settings. You can choose to block all cookies or only third-party cookies.
              Please note that disabling strictly necessary cookies may affect the functionality of our platform.
            </p>
          ),
        },
      ];

  return (
    <PageLayout>
      <PageHeader
        title="Cookie Policy"
        description="Last updated: February 2026. How we use technology to improve your experience."
      />

      <LegalLayout sections={sections}>
        <div className="flex items-center gap-4 mb-8 not-prose">
            <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center border border-black/5">
                <IconCookie className="w-6 h-6 text-black" />
            </div>
            <span className="text-sm font-semibold text-neutral-400 uppercase tracking-widest">Tracking Technologies</span>
        </div>
      </LegalLayout>
    </PageLayout>
  );
}

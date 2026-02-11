
"use client";

import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { IconLock } from "@tabler/icons-react";

export default function PrivacyPage() {
    const sections = [
        {
          id: "collection",
          title: "1. Information We Collect",
          content: (
            <p>
              We collect information you provide directly to us, such as your name, email address, phone number, and payment information. We also automatically collect
              usage data, device information, and IP addresses to improve our platform and ensure security.
            </p>
          ),
        },
        {
          id: "usage",
          title: "2. How We Use Your Information",
          content: (
            <p>
              We use your information to facilitate transactions, verify your identity, provide customer support, and communicate with you about updates and promotions.
              We also use data to analyze trends and detect fraud.
            </p>
          ),
        },
        {
          id: "sharing",
          title: "3. Data Sharing",
          content: (
            <p>
              We do not sell your personal data. We may share information with trusted third-party service providers (like M-PESA and identity verification partners)
              solely for the purpose of operating our platform. We may also share data if required by law.
            </p>
          ),
        },
        {
          id: "security",
          title: "4. Security",
          content: (
            <p>
              We implement industry-standard security measures, including encryption and secure server infrastructure, to protect your data.
              However, no method of transmission over the internet is 100% secure.
            </p>
          ),
        },
        {
          id: "rights",
          title: "5. Your Rights",
          content: (
            <p>
              You have the right to access, correct, or delete your personal information. You can manage most settings directly in your account dashboard.
              For other requests, contact our support team.
            </p>
          ),
        },
      ];

  return (
    <PageLayout>
      <PageHeader
        title="Privacy Policy"
        description="Last updated: February 2026. Your privacy is non-negotiable."
      />
      
      <LegalLayout sections={sections}>
          <div className="flex items-center gap-4 mb-8 not-prose">
              <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center border border-black/5">
                  <IconLock className="w-6 h-6 text-black" />
              </div>
              <span className="text-sm font-semibold text-neutral-400 uppercase tracking-widest">Data Protection</span>
          </div>
      </LegalLayout>
    </PageLayout>
  );
}

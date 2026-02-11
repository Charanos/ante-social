
"use client";

import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { IconScale } from "@tabler/icons-react";

export default function TermsPage() {
  const sections = [
    {
      id: "eligibility",
      title: "1. Eligibility",
      content: (
        <p>
          You must be at least 18 years old to use Ante Social. We verify the identity and age of all users to ensure compliance with Kenyan gaming regulations.
          By creating an account, you represent and warrant that you meet these eligibility requirements.
        </p>
      ),
    },
    {
      id: "account-security",
      title: "2. Account Security",
      content: (
        <p>
          You are responsible for maintaining the confidentiality of your account credentials. Ante Social is not liable for any loss resulting from unauthorized access to your account.
          If you suspect any unauthorized activity, you must notify us immediately.
        </p>
      ),
    },
    {
      id: "deposits-withdrawals",
      title: "3. Deposits and Withdrawals",
      content: (
        <p>
          All financial transactions are processed securely via M-PESA. You agree to provide accurate payment information and acknowledge that all winning payouts are subject to a 5% platform fee.
          <br /><br />
          Withdrawals are processed instantly but may be subject to review for security purposes.
        </p>
      ),
    },
    {
      id: "prohibited-conduct",
      title: "4. Prohibited Conduct",
      content: (
        <p>
          You agree not to manipulate markets, collude with other users, or engage in any fraudulent activity. Doing so will result in immediate account termination and forfeiture of funds.
          We employ advanced monitoring systems to detect irregularity.
        </p>
      ),
    },
    {
      id: "liability",
      title: "5. Limitation of Liability",
      content: (
        <p>
          Ante Social provides a platform for user-generated betting markets. We are not responsible for the outcome of any specific event or the actions of any third party.
          Our liability is limited to the amount of fees paid by you to the platform in the 12 months preceding any claim.
        </p>
      ),
    },
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Terms of Service"
        description="Last updated: February 2026. Please read these terms carefully before using our platform."
      />
      <LegalLayout sections={sections}>
          <div className="flex items-center gap-4 mb-8 not-prose">
            <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center border border-black/5">
                <IconScale className="w-6 h-6 text-black" />
            </div>
            <span className="text-sm font-semibold text-neutral-400 uppercase tracking-widest">Legal Agreement</span>
         </div>
      </LegalLayout>
    </PageLayout>
  );
}

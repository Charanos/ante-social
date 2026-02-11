
"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

const siteMap = [
  {
    category: "Product",
    links: [
        { label: "Features", href: "/product/features" },
        { label: "Game Modes", href: "/product/game-modes" },
        { label: "Pricing", href: "/product/pricing" },
        { label: "Roadmap", href: "/product/roadmap" },
    ]
  },
  {
    category: "Resources",
    links: [
        { label: "Documentation", href: "/resources/docs" },
        { label: "API Reference", href: "/resources/api" },
        { label: "Help Center", href: "/resources/help" },
        { label: "Blog", href: "/resources/blog" },
    ]
  },
  {
    category: "Company",
    links: [
        { label: "About Us", href: "/company/about" },
        { label: "Careers", href: "/company/careers" },
        { label: "Contact", href: "/company/contact" },
        // { label: "Site Map", href: "/company/site-map" }, // Self-reference omitted
    ]
  },
  {
    category: "Legal",
    links: [
        { label: "Terms of Service", href: "/legal/terms-of-service" },
        { label: "Privacy Policy", href: "/legal/privacy-policy" },
        { label: "Cookie Policy", href: "/legal/cookie-policy" },
        { label: "Responsible Gaming", href: "/legal/responsible-gaming" },
    ]
  },
  {
    category: "Community",
    links: [
        { label: "Leaderboard", href: "/leaderboard" },
        { label: "Community Hub", href: "/community" },
    ]
  }
];

export default function SiteMapPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Site Map"
        description="Overview of all pages on Ante Social."
      />

      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {siteMap.map((section, index) => (
                <motion.div
                    key={section.category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                >
                    <h2 className="text-2xl font-medium text-black mb-6 border-b border-black/10 pb-4">
                        {section.category}
                    </h2>
                    <ul className="space-y-4">
                        {section.links.map((link) => (
                            <li key={link.href}>
                                <Link 
                                    href={link.href}
                                    className="flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-neutral-50 group transition-colors"
                                >
                                    <span className="text-lg font-medium text-neutral-600 group-hover:text-black transition-colors">
                                        {link.label}
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-white border border-neutral-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <IconArrowRight className="w-4 h-4 text-black" />
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            ))}
        </div>
      </section>
    </PageLayout>
  );
}

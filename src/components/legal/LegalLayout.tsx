
"use client";

import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalLayoutProps {
  sections: Section[];
  children?: React.ReactNode; // For any header or extra content
}

export function LegalLayout({ sections, children }: LegalLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-7xl mx-auto pb-24 px-6">
      {/* Sidebar Navigation */}
      <div className="hidden lg:block lg:col-span-3">
        <div className="sticky top-32 space-y-2">
          <h4 className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-4 px-3">
            On this page
          </h4>
          <ul className="space-y-1">
            {sections.map((section) => (
              <li key={section.id}>
                <ScrollLink
                  to={section.id}
                  smooth={true}
                  offset={-120}
                  duration={500}
                  activeClass="bg-neutral-100 text-black font-semibold"
                  className="block px-3 py-2 text-sm text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-lg cursor-pointer transition-all"
                  spy={true}
                >
                  {section.title}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-9 space-y-12">
        {children}
        
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.1 }}
            className="scroll-mt-32"
          >
            <div className="prose prose-neutral prose-lg max-w-none prose-headings:font-medium prose-headings:text-black prose-p:text-neutral-600 prose-p:font-medium prose-p:leading-relaxed prose-li:text-neutral-600 prose-strong:text-black">
              <h3>{section.title}</h3>
              {section.content}
            </div>
            {index !== sections.length - 1 && (
              <div className="h-px bg-neutral-100 mt-12" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}


"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, className, children }: PageHeaderProps) {
  return (
    <div className={cn("relative pt-32 pb-16 md:pt-40 md:pb-24 text-center z-10", className)}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-black mb-6"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-lg md:text-xl text-neutral-600 font-medium max-w-2xl mx-auto leading-relaxed"
      >
        {description}
      </motion.p>
      {children && (
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4, duration: 0.8 }}
           className="mt-8"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

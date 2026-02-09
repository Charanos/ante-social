"use client";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
}

export function SectionHeading({
  title,
  icon,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn("flex items-center gap-4 mb-10 mt-0 md:mb-12", className)}
    >
      <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
          {title}
        </h2>
      </div>
      <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
    </div>
  );
}

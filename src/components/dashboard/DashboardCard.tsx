import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
}

export function DashboardCard({ children, className, gradient = true }: DashboardCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl p-6 text-neutral-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:bg-white/90",
        className
      )}
    >
      {/* Glass Shine Effect */}
      <div className="absolute inset-0 bg-linear-to-br from-white/40 via-transparent to-transparent pointer-events-none" />

      {/* Subtle Background Gradient Blob */}
      {gradient && (
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-linear-to-br from-neutral-100/80 to-transparent blur-3xl pointer-events-none opacity-60" />
      )}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

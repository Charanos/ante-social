"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LoadingLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  fullScreen?: boolean;
}

export function LoadingLogo({
  className,
  size = "md",
  fullScreen = false,
}: LoadingLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  const content = (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div
        className={cn(
          "relative animate-pulse transition-all duration-1000 ease-in-out",
          sizeClasses[size],
        )}
      >
        <Image
          src="/ante-logo.png"
          alt="Ante Social"
          width={128}
          height={128}
          className="object-contain"
        />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
        <p className="text-xs md:text-md font-semibold text-black/40 uppercase tracking-widest animate-pulse">
          Loading
        </p>
      </div>
    );
  }

  return content;
}

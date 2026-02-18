"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  border?: boolean;
}

const sizeMap = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-xl",
  xl: "w-24 h-24 text-3xl",
};

export function UserAvatar({
  src,
  name = "User",
  size = "md",
  className,
  border = true,
}: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Generate a consistent background color based on name
  const getBGColor = (name: string) => {
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      "from-neutral-800 to-neutral-900",
      "from-slate-700 to-slate-800",
      "from-zinc-800 to-zinc-900",
      "from-stone-700 to-stone-800",
    ];
    return colors[hash % colors.length];
  };

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center overflow-hidden shrink-0",
        sizeMap[size],
        !src && `bg-linear-to-br ${getBGColor(name)} text-white font-semibold`,
        border && "border-2 border-white shadow-sm",
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover"
        />
      ) : (
        <span>{initials || "U"}</span>
      )}
      
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent pointer-events-none" />
    </div>
  );
}

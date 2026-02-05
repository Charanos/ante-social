"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconPhoto } from '@tabler/icons-react';

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-12 flex items-center justify-between py-0 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-black/5 py-3"
          : "bg-transparent py-5"
      )}
    >
      <Link href="/" className="flex items-center gap-2 h-6">
        <div className="relative w-16 h-16 -mr-2 -ml-6">
          <Image src="/ante-logo.png" alt="Ante Social" fill className="object-contain" />
        </div>
        <span className="text-xl font-semibold tracking-tight text-black">
          ANTE SOCIAL
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {["Features", "Leaderboard", "Community"].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm font-medium text-neutral-600 hover:text-black transition-colors cursor-pointer"
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="hidden md:block text-sm font-medium text-neutral-600 hover:text-black transition-colors cursor-pointer"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="px-5 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-neutral-800 hover:scale-105 transition-all cursor-pointer shadow-md hover:shadow-lg"
        >
          Get Started
        </Link>
      </div>
    </motion.nav>
  );
}


"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { useSession } from "next-auth/react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-6 md:px-12 flex items-center justify-between py-0 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-black/5 py-1 shadow-xs"
          : "bg-transparent py-2"
      )}
    >
      <Link href="/" className="flex items-center gap-2 group">
        <div className="relative w-12 h-12 md:w-16 md:h-16 -ml-2 md:-ml-4 transition-transform group-hover:scale-105">
          <Image src="/ante-logo.png" alt="Ante Social" fill className="object-contain" />
        </div>
        <span className="text-lg -ml-2 md:text-xl font-semibold tracking-tight text-black">
          Ante Social
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {[
            { label: "About", href: "/company/about" },
            { label: "Community", href: "/community" }
        ].map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors cursor-pointer relative group",
                isActive ? "text-black" : "text-neutral-600 hover:text-black"
              )}
            >
              {item.label}
              <span className={cn(
                "absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-300",
                isActive ? "w-full" : "w-0 group-hover:w-full"
              )} />
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        {session ? (
           <Link
            href="/dashboard"
            className="px-5 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-neutral-800 hover:scale-105 transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center gap-2"
          >
            Dashboard
          </Link>
        ) : (
          <>
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
          </>
        )}
      </div>
    </motion.nav>
  );
}

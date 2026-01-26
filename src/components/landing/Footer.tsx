"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-12 px-6 bg-white border-t border-black/5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <span className="text-lg font-medium tracking-tighter text-black">
            ANTE SOCIAL
          </span>
        </div>

        <div className="flex items-center gap-8 text-sm font-medium text-neutral-600">
          <Link
            href="#"
            className="hover:text-black transition-colors cursor-pointer"
          >
            Terms
          </Link>
          <Link
            href="#"
            className="hover:text-black transition-colors cursor-pointer"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="hover:text-black transition-colors cursor-pointer"
          >
            Twitter
          </Link>
          <Link
            href="#"
            className="hover:text-black transition-colors cursor-pointer"
          >
            Discord
          </Link>
        </div>

        <div className="text-sm text-neutral-600 font-medium">
          © 2026 Ante Social. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

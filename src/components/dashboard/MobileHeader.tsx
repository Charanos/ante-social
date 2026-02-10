"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  IoChevronBackOutline, 
  IoSettingsOutline, 
  IoLogOutOutline, 
  IoPersonOutline,
  IoChevronDownOutline
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  user?: {
    username?: string | null;
    image?: string | null;
  };
}

export function MobileHeader({ user }: MobileHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Derive title from pathname
  const getPageTitle = () => {
    if (!pathname || pathname === "/dashboard") return "Dashboard";
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, " ");
  };

  return (
    <div className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black/5 h-16 flex items-center justify-between mb-16">
      {/* Left: Back Button */}
      <button 
        onClick={() => router.back()}
        className="w-10 h-10 flex items-center justify-center rounded-full active:bg-black/5 text-neutral-800 transition-colors"
      >
        <IoChevronBackOutline className="w-6 h-6" />
      </button>

      {/* Center: Title */}
      <h1 className="text-lg font-semibold text-neutral-900 absolute left-1/2 -translate-x-1/2">
        {getPageTitle()}
      </h1>

      {/* Right: Profile Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 p-1 rounded-full active:bg-black/5 transition-colors"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-black/10">
            {user?.image ? (
              <Image 
                src={user.image} 
                alt={user.username || "User"} 
                fill 
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-600 font-medium text-xs">
                {(user?.username || "G").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <IoChevronDownOutline className={cn("w-3 h-3 text-neutral-500 transition-transform", isDropdownOpen && "rotate-180")} />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40 bg-transparent" 
                onClick={() => setIsDropdownOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-xl border border-black/5 rounded-2xl shadow-xl z-50 overflow-hidden py-1"
              >
                <div className="px-4 py-3 border-b border-black/5">
                  <p className="text-sm font-semibold text-neutral-900 truncate">
                    {user?.username || "Guest"}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Novice
                  </p>
                </div>
                
                <div className="p-1">
                  <Link 
                    href="/dashboard/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-black/5 rounded-xl transition-colors"
                  >
                    <IoPersonOutline className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link 
                    href="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-black/5 rounded-xl transition-colors"
                  >
                    <IoSettingsOutline className="w-4 h-4" />
                    Settings
                  </Link>
                  <button 
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <IoLogOutOutline className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconPhoto } from "@tabler/icons-react";
import {
  IoNotificationsOutline,
  IoCloseOutline,
  IoHomeOutline,
  IoLogOutOutline,
  IoMenuOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSettingsOutline,
  IoShieldOutline,
  IoTrendingUpOutline,
  IoWalletOutline,
} from "react-icons/io5";

import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const mainNavItems = [
  { title: "Home", url: "/dashboard", icon: IoHomeOutline },
  { title: "Markets", url: "/dashboard/markets", icon: IoTrendingUpOutline },
  { title: "Groups", url: "/dashboard/groups", icon: IoPeopleOutline },
  { title: "Wallet", url: "/dashboard/wallet", icon: IoWalletOutline },
];

const secondaryNavItems = [
  { title: "Profile", url: "/dashboard/profile", icon: IoPersonOutline },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: IoNotificationsOutline,
  },
  { title: "Settings", url: "/settings", icon: IoSettingsOutline },
  { title: "Admin", url: "/dashboard/admin", icon: IoShieldOutline },
];

export function MobileNav({ user }: { user: any }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        <div className="glass-panel rounded-2xl border border-white/40 shadow-xl bg-white/80 backdrop-blur-xl p-2">
          <ul className="flex justify-between items-center px-2">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.url;
              return (
                <li key={item.title} className="">
                  <Link
                    href={item.url}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300",
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-400 hover:text-gray-600",
                    )}
                  >
                    <item.icon
                      className={cn("w-6 h-6", isActive && "fill-current")}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </Link>
                </li>
              );
            })}

            {/* More IconMenu Toggle */}
            <li>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300",
                  isMenuOpen
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                {isMenuOpen ? (
                  <IoCloseOutline className="w-6 h-6" strokeWidth={2.5} />
                ) : (
                  <IoMenuOutline className="w-6 h-6" strokeWidth={2} />
                )}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Full Screen IconMenu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-3xl pt-24 px-6 pb-32 overflow-y-auto"
          >
            <div className="flex flex-col items-center mb-10">
              <div className="relative w-16 h-16 mb-4">
                <Image
                  src="/ante-logo.png"
                  alt="Ante Social"
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Ante Social
              </h2>
              <p className="text-gray-500">Bet with your friends.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                IconMenu
              </h3>
              {secondaryNavItems
                .filter(
                  (item) => item.title !== "Admin" || user?.role === "admin",
                )
                .map((item) => (
                  <Link
                    key={item.title}
                    href={item.url}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all"
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-lg text-gray-900">
                      {item.title}
                    </span>
                  </Link>
                ))}

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 border border-transparent hover:border-red-100 transition-all mt-4 text-red-600"
              >
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <IoLogOutOutline className="w-5 h-5" />
                </div>
                <span className="font-medium text-lg">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

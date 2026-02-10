"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  IoChevronDownOutline,
  IoChevronUpOutline,
} from "react-icons/io5";

import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface NavItem {
  title: string;
  url: string;
  icon: any;
  children?: { title: string; url: string }[];
}

const mainNavItems: NavItem[] = [
  { title: "Home", url: "/dashboard", icon: IoHomeOutline },
  {
    title: "Markets",
    url: "/dashboard/markets",
    icon: IoTrendingUpOutline,
    children: [
      { title: "All Markets", url: "/dashboard/markets" },
      { title: "My Bets", url: "/dashboard/markets/my-bets" },
      { title: "Create Market", url: "/dashboard/markets/create" },
    ],
  },
  {
    title: "Groups",
    url: "/dashboard/groups",
    icon: IoPeopleOutline,
    children: [
      { title: "My Groups", url: "/dashboard/groups" },
      { title: "Discover", url: "/dashboard/groups/discover" },
      { title: "Create Group", url: "/dashboard/groups/create" },
    ],
  },
  { title: "Wallet", url: "/dashboard/wallet", icon: IoWalletOutline },
];

const secondaryNavItems: NavItem[] = [
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
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  return (
    <>
      <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        <div className="glass-panel rounded-2xl border border-white/40 shadow-xl bg-white/80 backdrop-blur-xl p-2">
          <ul className="flex justify-between items-center px-2">
            {mainNavItems.map((item) => {
              const isActive =
                pathname === item.url ||
                item.children?.some((child) => pathname === child.url);
              
              // For main bar, if it has children, we still link to the main URL 
              // or just toggle menu if it's strictly a container? 
              // Current design: Bottom bar icons go to main pages.
              
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
                Menu
              </h3>
              
              {/* Combine main and secondary items for the full menu */}
              {[...mainNavItems, ...secondaryNavItems]
                .filter(
                  (item) => item.title !== "Admin" || user?.role === "admin",
                )
                .map((item) => {
                  const isActive = pathname === item.url || item.children?.some(c => pathname === c.url);
                  const isExpanded = expandedItems.includes(item.title);
                  const hasChildren = item.children && item.children.length > 0;

                  return (
                    <div key={item.title} className="flex flex-col">
                      <div className="flex items-center gap-2">
                         <Link
                          href={item.url}
                          onClick={() => !hasChildren && setIsMenuOpen(false)}
                          className={cn(
                            "flex-1 flex items-center gap-4 p-4 rounded-2xl border transition-all",
                             isActive
                              ? "bg-blue-50 border-blue-100 text-blue-900"
                              : "hover:bg-gray-50 border-transparent hover:border-gray-100 text-gray-900"
                          )}
                        >
                          <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                            isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                          )}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-lg">
                            {item.title}
                          </span>
                        </Link>
                        
                        {hasChildren && (
                          <button 
                            onClick={() => toggleExpand(item.title)}
                            className="p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 text-gray-500"
                          >
                             {isExpanded ? <IoChevronUpOutline className="w-5 h-5" /> : <IoChevronDownOutline className="w-5 h-5" />}
                          </button>
                        )}
                      </div>

                      {/* Submenu */}
                      <AnimatePresence>
                        {hasChildren && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-16 pr-4 pb-2 space-y-1">
                              {item.children?.map(child => (
                                <Link
                                  key={child.url}
                                  href={child.url}
                                  onClick={() => setIsMenuOpen(false)}
                                  className={cn(
                                    "block p-3 rounded-xl text-base font-medium transition-colors",
                                    pathname === child.url 
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                  )}
                                >
                                  {child.title}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconChevronDown,
  IconLogout,
  IconPhoto,
  IconSettings,
} from "@tabler/icons-react";
import {
  IoNotificationsOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoHomeOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoShieldOutline,
  IoTrendingUpOutline,
  IoWalletOutline,
} from "react-icons/io5";

import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { mockNotifications } from "@/lib/mockData";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  title: string;
  url: string;
  icon: any;
  children?: { title: string; url: string }[];
}

const navItems: NavItem[] = [
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
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: IoNotificationsOutline,
  },
  { title: "Profile", url: "/dashboard/profile", icon: IoPersonOutline },
  { title: "Admin", url: "/dashboard/admin", icon: IoShieldOutline },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  user?: any;
}

export function Sidebar({
  collapsed = false,
  onToggle = () => {},
  user,
}: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Auto-expand the section if the current path is within it
  useEffect(() => {
    const activeItem = navItems.find((item) =>
      item.children?.some((child) => pathname === child.url),
    );
    if (activeItem && !expandedItems.includes(activeItem.title)) {
      setExpandedItems((prev) => [...prev, activeItem.title]);
    }
  }, [pathname]);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  return (
    <aside
      className={cn(
        "hidden md:flex fixed left-0 top-0 z-40 h-screen flex-col border-r border-white/20 bg-white/60 backdrop-blur-xl transition-all duration-300 shadow-xl shadow-gray-200/50",
        collapsed ? "w-20" : "w-72",
      )}
    >
      {/* Floating Collapse Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-9 z-50 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-white/50 bg-black/80 backdrop-blur-md text-white shadow-sm transition-all hover:bg-white hover:text-gray-900 hover:scale-110"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <IoChevronForwardOutline className="h-3 w-3" />
        ) : (
          <IoChevronBackOutline className="h-3 w-3" />
        )}
      </button>

      <div
        className={cn(
          "flex h-full flex-col px-4 py-6 pt-10",
          collapsed ? "overflow-hidden" : "overflow-y-auto custom-scrollbar",
        )}
      >
        {/* Logo/Brand */}
        <div
          className={cn(
            "flex items-center transition-all duration-300 h-10 pb-8 mb-4 border-b border-gray-100/50",
            collapsed ? "justify-center" : "px-2",
          )}
        >
          {collapsed ? (
            <div className="relative w-12 h-12">
              <Image
                src="/ante-logo.png"
                alt="Ante Social"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative w-14 h-14">
                <Image
                  src="/ante-logo.png"
                  alt="Ante Social"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-semibold tracking-tight bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Ante Social
              </span>
            </div>
          )}
        </div>

        <ul className="space-y-1.5 flex-1">
          {navItems
            .filter(
              (item) =>
                item.title !== "Admin" ||
                (session?.user as any)?.role === "admin",
            )
            .map((item) => {
              const isActive =
                pathname === item.url ||
                item.children?.some((child) => pathname === child.url);
              const isNotifications = item.title === "Notifications";
              const unreadCount = isNotifications
                ? mockNotifications.filter((n) => !n.is_read).length
                : 0;
              const isExpanded = expandedItems.includes(item.title);
              const hasChildren =
                item.children && item.children.length > 0 && !collapsed;

              return (
                <li key={item.title}>
                  <div
                    className={cn(
                      "relative group flex items-center rounded-xl transition-all duration-200 cursor-pointer overflow-hidden",
                      isActive && !hasChildren
                        ? "bg-linear-to-r from-gray-900 to-gray-800 text-white shadow-lg shadow-gray-900/20"
                        : "text-gray-500 hover:bg-gray-400/10 hover:shadow-sm hover:text-gray-900",
                      collapsed ? "justify-center px-2 py-3" : "py-2.5 px-3",
                    )}
                    onClick={() =>
                      hasChildren ? toggleExpand(item.title) : null
                    }
                  >
                    {/* Main Link Content */}
                    {hasChildren ? (
                      // If it has children and is NOT collapsed, it behaves as a toggle
                      <div className="flex w-full items-center">
                        <item.icon
                          className={cn(
                            "h-5 w-5 transition-colors duration-200 shrink-0",
                            isActive
                              ? "text-gray-900"
                              : "text-gray-400 group-hover:text-gray-600",
                          )}
                        />

                        <div className="flex flex-1 items-center justify-between ml-3 overflow-hidden">
                          <span
                            className={cn(
                              "text-sm font-medium tracking-wide transition-opacity duration-200 truncate",
                              isActive
                                ? "text-gray-900"
                                : "text-gray-600 group-hover:text-gray-900",
                            )}
                          >
                            {item.title}
                          </span>
                          <IconChevronDown
                            className={cn(
                              "h-4 w-4 text-gray-400 transition-transform duration-200",
                              isExpanded ? "rotate-180" : "",
                            )}
                          />
                        </div>
                      </div>
                    ) : (
                      // Standard Link
                      <Link
                        href={item.url}
                        className={cn(
                          "flex w-full items-center",
                          collapsed && "justify-center",
                        )}
                        title={collapsed ? item.title : undefined}
                      >
                        <div className="relative shrink-0">
                          <item.icon
                            className={cn(
                              "h-5 w-5 transition-colors duration-200",
                              isActive && !hasChildren
                                ? "text-white"
                                : "text-gray-400 group-hover:text-gray-600",
                              isActive && hasChildren ? "text-gray-900" : "",
                            )}
                          />
                          {isNotifications && unreadCount > 0 && (
                            <span
                              className={cn(
                                "absolute -top-1 -right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white",
                              )}
                            />
                          )}
                        </div>

                        {!collapsed && (
                          <div className="flex flex-1 items-center justify-between ml-3 overflow-hidden">
                            <span
                              className={cn(
                                "text-sm font-medium tracking-wide transition-opacity duration-200 truncate",
                                isActive && !hasChildren
                                  ? "text-white"
                                  : "text-gray-600 group-hover:text-gray-900",
                              )}
                            >
                              {item.title}
                            </span>
                            {isNotifications && unreadCount > 0 && (
                              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                        )}
                      </Link>
                    )}

                    {/* Tooltip for collapsed mode */}
                    {collapsed && (
                      <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-all z-50 shadow-xl -translate-x-2.5 group-hover:translate-x-0">
                        {item.title}
                        {isNotifications &&
                          unreadCount > 0 &&
                          ` (${unreadCount})`}
                      </div>
                    )}
                  </div>

                  {/* Nested Items Accordion */}
                  <AnimatePresence>
                    {hasChildren && isExpanded && !collapsed && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden ml-9 mt-1 space-y-1 border-l-2 border-gray-100 pl-2"
                      >
                        {item.children
                          ?.filter((child) => {
                            if (child.title === "Create Market") {
                              return (session?.user as any)?.role === "admin";
                            }
                            return true;
                          })
                          .map((child) => {
                            const isChildActive = pathname === child.url;
                            return (
                              <li key={child.url}>
                                <Link
                                  href={child.url}
                                  className={cn(
                                    "block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
                                    isChildActive
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
                                  )}
                                >
                                  {child.title}
                                </Link>
                              </li>
                            );
                          })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
        </ul>

        {/* Bottom Controls */}
        <div className="mt-auto pt-6 border-t border-gray-100">
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center rounded-xl px-3 py-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 mb-2",
              collapsed ? "justify-center px-2" : "justify-start",
            )}
            title={collapsed ? "Settings" : undefined}
          >
            <IconSettings className="h-5 w-5" />
            {!collapsed && (
              <span className="ml-3 text-sm font-medium">Settings</span>
            )}
          </Link>

          {/* Sign Out */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={cn(
              "flex w-full cursor-pointer items-center rounded-xl px-3 py-2.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group",
              collapsed ? "justify-center px-2" : "justify-start",
            )}
            title={collapsed ? "Sign Out" : undefined}
          >
            <IconLogout className="h-5 w-5 transition-colors group-hover:text-red-600" />
            {!collapsed && (
              <span className="ml-3 text-sm font-medium">Sign Out</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

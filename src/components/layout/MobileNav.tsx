'use client';

import Link from 'next/link';
import { Home, Wallet, User, Bell, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
  { title: 'Home', url: '/dashboard', icon: Home },
  { title: 'Wallet', url: '/dashboard/wallet', icon: Wallet },
  { title: 'Groups', url: '/dashboard/groups', icon: Users },
  { title: 'Profile', url: '/dashboard/profile', icon: User },
];

export function MobileNav({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-nav z-50 pb-safe">
      <ul className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.url;
          return (
            <li key={item.title} className="w-full">
              <Link
                href={item.url}
                className={`
                  flex flex-col items-center justify-center gap-1 h-full w-full
                  transition-all duration-200
                  ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}
                `}
              >
                <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-gray-100' : ''}`}>
                  <item.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                </div>
                <span className="text-[10px] font-medium">{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

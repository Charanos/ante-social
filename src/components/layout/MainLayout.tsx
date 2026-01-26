'use client';

import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export function MainLayout({ children, user }: { children: React.ReactNode, user: any }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={user} />
      
      <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
      
      <MobileNav user={user} />
    </div>
  );
}

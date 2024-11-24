'use client';

import { Toaster } from 'react-hot-toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import { NavBar } from './nav-bar';
import { SideNav } from './side-nav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="flex">
          <SideNav />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
        <Toaster position="bottom-right" />
      </div>
    </TooltipProvider>
  );
}

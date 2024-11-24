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
      <div className="h-screen flex flex-col bg-gradient-to-br from-background to-background/95">
        <NavBar />
        <div className="flex flex-1 overflow-hidden">
          <SideNav />
          <main className="flex-1 relative">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
            <div className="relative">
              {children}
            </div>
          </main>
        </div>
        <Toaster position="bottom-right" />
      </div>
    </TooltipProvider>
  );
}

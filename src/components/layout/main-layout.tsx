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
      <div className="h-screen flex flex-col bg-background">
        <NavBar />
        <div className="flex flex-1 overflow-hidden">
          <SideNav />
          <main className="flex-1">
            {children}
          </main>
        </div>
        <Toaster position="bottom-right" />
      </div>
    </TooltipProvider>
  );
}

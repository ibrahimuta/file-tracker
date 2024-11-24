'use client';

import { Toaster } from 'react-hot-toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import { NavBar } from './nav-bar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="flex-1">
          {children}
        </main>
        <Toaster position="bottom-right" />
      </div>
    </TooltipProvider>
  );
}

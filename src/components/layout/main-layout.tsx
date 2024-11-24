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
      <div className="relative min-h-screen flex flex-col bg-background">
        <NavBar />
        <div className="flex-1 flex overflow-hidden">
          <SideNav />
          <main className="flex-1 relative overflow-y-auto">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] pointer-events-none" />
            <div className="relative h-full p-8">
              {children}
            </div>
          </main>
        </div>
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            className: 'bg-background text-foreground border border-border',
            duration: 5000,
          }}
        />
      </div>
    </TooltipProvider>
  );
}

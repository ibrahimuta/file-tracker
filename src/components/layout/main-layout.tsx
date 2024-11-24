'use client';

import { Toaster } from 'react-hot-toast';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1">
        <div className="container mx-auto py-6">
          {children}
        </div>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}

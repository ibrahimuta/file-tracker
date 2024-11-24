'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, Search, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Command, CommandInput } from '@/components/ui/command';
import { UserNav } from '@/components/layout/user-nav';
import { cn } from '@/lib/utils';

export function NavBar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const menuItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'Settings', href: '/settings' },
  ];

  const userMenuItems = [
    { name: 'Profile', href: '/profile' },
    { name: 'Settings', href: '/settings' },
    { name: 'Logout', href: '/logout' },
  ];

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1">
            <Command className="rounded-lg border-none bg-background shadow-none">
              <CommandInput
                placeholder="Search files..."
                className="h-9 border-0 focus:ring-0"
              />
            </Command>
          </div>
          <UserNav />
        </div>
      </div>
    </header>
  );
}

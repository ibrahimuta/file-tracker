'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Files,
  Settings,
  BarChart3,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Files', href: '/', icon: Files },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function SideNav() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const pathname = usePathname();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
          isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
          isCollapsed ? 'justify-center' : ''
        )}
      >
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Icon className="h-4 w-4" />
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="flex items-center gap-4">
                {item.name}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        {!isCollapsed && <span>{item.name}</span>}
      </Link>
    );
  };

  // Mobile navigation using Sheet
  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus:ring-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[280px]">
        <nav className="grid gap-2 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                pathname === item.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <MobileNav />
      </div>

      {/* Desktop Navigation */}
      <motion.div
        className={cn(
          'hidden md:flex h-screen flex-col gap-4 border-r bg-background px-2 pb-4',
          isCollapsed ? 'w-[64px]' : 'w-[240px]'
        )}
        animate={{ width: isCollapsed ? 64 : 240 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex h-14 items-center justify-between px-2">
          {!isCollapsed && (
            <span className="text-lg font-semibold">Navigation</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={toggleCollapse}
          >
            <ChevronLeft
              className={cn(
                'h-4 w-4 transition-transform',
                isCollapsed && 'rotate-180'
              )}
            />
          </Button>
        </div>

        <nav className="grid gap-2">
          <AnimatePresence mode="wait">
            {navItems.map((item) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <NavLink item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </nav>
      </motion.div>
    </>
  );
}

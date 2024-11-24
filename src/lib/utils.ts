import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const stages = {
  ORDERED: {
    label: 'Ordered',
    color: 'text-purple-500',
  },
  SHIPPED: {
    label: 'Shipped',
    color: 'text-orange-500',
  },
  INVOICED: {
    label: 'Invoiced',
    color: 'text-pink-500',
  },
  REMITTED: {
    label: 'Remitted',
    color: 'text-yellow-500',
  },
  COMPLETE: {
    label: 'Complete',
    color: 'text-green-500',
  },
} as const;

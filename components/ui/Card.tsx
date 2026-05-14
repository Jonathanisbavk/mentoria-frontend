import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: number | string;
  children: ReactNode;
  clickable?: boolean;
}

export function Card({ padding = 24, children, className, clickable, onClick, ...props }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white border border-[var(--brand-border)] rounded-2xl',
        clickable || onClick ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : '',
        className
      )}
      style={{ padding: typeof padding === 'number' ? `${padding}px` : padding }}
      {...props}
    >
      {children}
    </div>
  );
}

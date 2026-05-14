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
        'bg-white border border-gray-200 rounded-2xl shadow-sm',
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

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1', className)} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-base font-semibold tracking-tight text-gray-900', className)} {...props} />
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('pt-4', className)} {...props} />
}

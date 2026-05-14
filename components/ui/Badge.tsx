import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'default' | 'primary';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  children: ReactNode;
  dot?: boolean;
}

const variantStyles: Record<Variant, { bg: string; text: string }> = {
  primary: { bg: '#EEF1F9', text: '#0B2272' },
  success: { bg: '#D1FAE5', text: '#065F46' },
  warning: { bg: '#FEF3C7', text: '#92400E' },
  danger:  { bg: '#FEE2E2', text: '#991B1B' },
  info:    { bg: '#DBEAFE', text: '#1E40AF' },
  default: { bg: '#F3F4F6', text: '#374151' },
};

const dotColors: Record<Variant, string> = {
  primary: '#0B2272',
  success: '#10B981',
  warning: '#F59E0B',
  danger:  '#EF4444',
  info:    '#3B82F6',
  default: '#9CA3AF',
};

export function Badge({ variant = 'default', children, dot, className, ...props }: BadgeProps) {
  const { bg, text } = variantStyles[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap',
        className
      )}
      style={{ backgroundColor: bg, color: text }}
      {...props}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: dotColors[variant] }}
        />
      )}
      {children}
    </span>
  );
}

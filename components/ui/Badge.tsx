import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'default' | 'primary';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  children: ReactNode;
  dot?: boolean;
}

const variantStyles: Record<Variant, { bg: string; text: string }> = {
  primary: { bg: 'var(--brand-primary-bg)', text: 'var(--brand-primary)' },
  success: { bg: '#D1FAE5', text: '#065F46' },
  warning: { bg: '#FEF3C7', text: '#92400E' },
  danger: { bg: '#FEE2E2', text: '#991B1B' },
  info: { bg: '#DBEAFE', text: '#1E40AF' },
  default: { bg: 'var(--brand-surface)', text: 'var(--brand-slate)' },
};

const dotColors: Record<Variant, string> = {
  primary: 'var(--brand-primary)',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  default: 'var(--brand-slate-light)',
};

export function Badge({ variant = 'default', children, dot, className, ...props }: BadgeProps) {
  const { bg, text } = variantStyles[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[20px] text-xs font-medium whitespace-nowrap',
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

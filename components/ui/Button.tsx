'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children?: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-dark)] active:bg-[var(--brand-primary-dark)] border border-transparent',
  secondary: 'bg-transparent text-[var(--brand-primary)] border border-[var(--brand-primary)] hover:bg-[var(--brand-primary-bg)] active:bg-[var(--brand-primary-bg)]',
  ghost: 'bg-transparent text-[var(--brand-slate)] border border-[var(--brand-border)] hover:bg-[var(--brand-surface)] active:bg-[var(--brand-border)]',
  danger: 'bg-[var(--brand-danger)] text-white border border-transparent hover:opacity-90 active:opacity-80',
  success: 'bg-[var(--brand-success)] text-white border border-transparent hover:opacity-90 active:opacity-80',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-sm gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, iconPosition = 'left', loading, children, className, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-[10px] transition-all duration-150 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] focus-visible:outline-offset-2',
          variantStyles[variant],
          sizeStyles[size],
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin shrink-0" />
        ) : (
          icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

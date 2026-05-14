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
  primary:   'bg-[#0B2272] text-white hover:bg-[#091A5A] border border-transparent shadow-sm',
  secondary: 'bg-white text-[#0B2272] border-2 border-[#0B2272] hover:bg-[#EEF1F9]',
  ghost:     'bg-transparent text-gray-600 border border-gray-200 hover:bg-gray-50',
  danger:    'bg-red-600 text-white border border-transparent hover:bg-red-700',
  success:   'bg-green-600 text-white border border-transparent hover:bg-green-700',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-sm gap-2 rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, iconPosition = 'left', loading, children, className, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-150 cursor-pointer select-none',
          'focus-visible:outline-2 focus-visible:outline-[#0B2272] focus-visible:outline-offset-2',
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

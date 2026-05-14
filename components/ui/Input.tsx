'use client';

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, icon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium"
            style={{ color: 'var(--brand-dark)' }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--brand-slate-light)' }}
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-10 rounded-[10px] border text-sm transition-colors',
              'placeholder:text-[var(--brand-slate-light)]',
              icon ? 'pl-9 pr-4' : 'px-4',
              error
                ? 'border-[var(--brand-danger)] focus:border-[var(--brand-danger)] focus:ring-2 focus:ring-[var(--brand-danger)]/20'
                : 'border-[var(--brand-border)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20',
              'outline-none',
              className
            )}
            style={{ color: 'var(--brand-dark)', backgroundColor: 'white' }}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs" style={{ color: 'var(--brand-danger)' }}>
            {error}
          </p>
        )}
        {helper && !error && (
          <p className="text-xs" style={{ color: 'var(--brand-slate-light)' }}>
            {helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

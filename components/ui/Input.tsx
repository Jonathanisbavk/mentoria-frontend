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
            className="text-sm font-semibold text-gray-800"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-11 rounded-xl border text-sm transition-all duration-150 outline-none',
              'text-gray-900 bg-white placeholder:text-gray-400',
              icon ? 'pl-10 pr-4' : 'px-4',
              error
                ? 'border-red-400 ring-1 ring-red-300 focus:border-red-500 focus:ring-red-300'
                : 'border-gray-300 focus:border-[#0B2272] focus:ring-2 focus:ring-[#0B2272]/20',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        )}
        {helper && !error && (
          <p className="text-xs text-gray-500">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

'use client';

import { forwardRef, TextareaHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, maxLength, className, id, onChange, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const [charCount, setCharCount] = useState(0);

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
        <textarea
          ref={ref}
          id={inputId}
          maxLength={maxLength}
          onChange={(e) => {
            setCharCount(e.target.value.length);
            onChange?.(e);
          }}
          className={cn(
            'w-full rounded-[10px] border px-4 py-3 text-sm resize-none transition-colors outline-none',
            'placeholder:text-[var(--brand-slate-light)]',
            error
              ? 'border-[var(--brand-danger)]'
              : 'border-[var(--brand-border)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20',
            className
          )}
          style={{ color: 'var(--brand-dark)', backgroundColor: 'white' }}
          {...props}
        />
        <div className="flex items-center justify-between">
          {error && (
            <p className="text-xs" style={{ color: 'var(--brand-danger)' }}>
              {error}
            </p>
          )}
          {maxLength && (
            <p
              className="text-xs ml-auto"
              style={{ color: charCount >= maxLength ? 'var(--brand-danger)' : 'var(--brand-slate-light)' }}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

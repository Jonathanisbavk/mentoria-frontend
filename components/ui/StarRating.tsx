'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showLabel?: boolean;
  className?: string;
}

export function StarRating({ rating, size = 16, interactive = false, onChange, showLabel = false, className }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const displayRating = interactive && hovered > 0 ? hovered : rating;

  return (
    <div className={cn('flex items-center gap-1', className)} role={interactive ? 'radiogroup' : undefined} aria-label={`Valoración: ${rating} de 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role={interactive ? 'radio' : undefined}
          aria-checked={interactive ? star === rating : undefined}
          aria-label={interactive ? `${star} estrella${star !== 1 ? 's' : ''}` : undefined}
          disabled={!interactive}
          onClick={interactive ? () => onChange?.(star) : undefined}
          onMouseEnter={interactive ? () => setHovered(star) : undefined}
          onMouseLeave={interactive ? () => setHovered(0) : undefined}
          className={cn(
            'transition-transform duration-100',
            interactive ? 'cursor-pointer hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-warning)] rounded' : 'cursor-default pointer-events-none',
            !interactive && 'p-0 bg-transparent border-0'
          )}
          style={interactive ? {} : { background: 'none', border: 'none', padding: 0 }}
        >
          <Star
            size={size}
            fill={star <= displayRating ? '#F59E0B' : 'none'}
            stroke={star <= displayRating ? '#F59E0B' : '#CBD5E1'}
            strokeWidth={1.5}
          />
        </button>
      ))}
      {showLabel && (
        <span className="text-sm font-medium ml-1" style={{ color: 'var(--brand-dark)' }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

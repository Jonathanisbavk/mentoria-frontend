'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useState } from 'react'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: 'sm' | 'md'
}

export function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const iconSize = size === 'sm' ? 14 : 18

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={cn('transition-colors', readonly ? 'cursor-default' : 'cursor-pointer')}
        >
          <Star
            size={iconSize}
            className={cn(
              'transition-colors',
              (hovered || value) >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            )}
          />
        </button>
      ))}
    </div>
  )
}

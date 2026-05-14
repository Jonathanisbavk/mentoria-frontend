import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { getAvatarColor } from '@/lib/utils';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  initials?: string;
  name?: string;
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  src?: string | null;
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
} as const

export function Avatar({ initials, name, size = 'md', src, className, ...props }: AvatarProps) {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size]
  const displayText = initials || name || 'U'
  const bg = getAvatarColor(displayText)
  const fontSize = Math.round(pixelSize * 0.36)

  if (src) {
    return (
      <div
        className={cn('rounded-full overflow-hidden shrink-0', className)}
        style={{ width: pixelSize, height: pixelSize }}
        {...props}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={displayText} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }

  return (
    <div
      className={cn('rounded-full flex items-center justify-center shrink-0 font-semibold select-none', className)}
      style={{ width: pixelSize, height: pixelSize, backgroundColor: bg, color: 'white', fontSize }}
      aria-label={`Avatar de ${displayText}`}
      {...props}
    >
      {displayText.slice(0, 2).toUpperCase()}
    </div>
  );
}

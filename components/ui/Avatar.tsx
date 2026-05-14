import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { getAvatarColor } from '@/lib/utils';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  initials: string;
  size?: number;
  src?: string;
}

export function Avatar({ initials, size = 40, src, className, ...props }: AvatarProps) {
  const bg = getAvatarColor(initials);
  const fontSize = Math.round(size * 0.36);

  if (src) {
    return (
      <div
        className={cn('rounded-full overflow-hidden shrink-0', className)}
        style={{ width: size, height: size }}
        {...props}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={initials} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }

  return (
    <div
      className={cn('rounded-full flex items-center justify-center shrink-0 font-semibold select-none', className)}
      style={{ width: size, height: size, backgroundColor: bg, color: 'white', fontSize }}
      aria-label={`Avatar de ${initials}`}
      {...props}
    >
      {initials.slice(0, 2).toUpperCase()}
    </div>
  );
}

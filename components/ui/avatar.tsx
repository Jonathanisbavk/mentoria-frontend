import { cn } from '@/lib/utils/cn'
import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

const pxSizes = { sm: 32, md: 40, lg: 48, xl: 64 }

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (src) {
    return (
      <div className={cn('relative overflow-hidden rounded-full', sizes[size], className)}>
        <Image
          src={src}
          alt={name}
          width={pxSizes[size]}
          height={pxSizes[size]}
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-indigo-600 font-semibold text-white',
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  )
}

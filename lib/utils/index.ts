export { cn } from './cn'

export function getAvatarColor(seed: string) {
  const palette = ['#2563EB', '#0F766E', '#7C3AED', '#C2410C', '#BE123C', '#047857']
  let hash = 0

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0
  }

  return palette[hash % palette.length]
}

import type { SanityImage } from './types'

export function getImageDimensions(image: SanityImage): { width: number; height: number } | null {
  const ref = image?.asset?._ref || image?.asset?._id
  if (!ref) return null

  const match = ref.match(/-(\d+)x(\d+)-/)
  if (!match) return null

  return { width: Number(match[1]), height: Number(match[2]) }
}

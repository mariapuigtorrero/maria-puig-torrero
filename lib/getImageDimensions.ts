export function getImageDimensions(image: any): { width: number; height: number } | null {
  const ref = image?.asset?._ref || image?.asset?._id
  if (!ref) return null

  const match = ref.match(/-(\d+)x(\d+)-/)
  if (!match) return null

  return { width: Number(match[1]), height: Number(match[2]) }
}
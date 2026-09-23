import { urlFor } from '@/sanity/lib/image'

export function preloadImages(images: any[] = [], quality = 95, width?: number) {
  if (typeof window === 'undefined') return

  images.forEach((img) => {
    if (!img) return
    let builder = urlFor(img).quality(quality).auto('format')
    if (width) builder = builder.width(width)
    const preload = new window.Image()
    preload.src = builder.url()

    if (preload.decode) {
      preload.decode().catch(() => {})
    }
  })
}
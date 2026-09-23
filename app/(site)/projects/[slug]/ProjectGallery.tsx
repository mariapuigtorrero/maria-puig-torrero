'use client'

import { useEffect, useRef, useState } from 'react'
import { urlFor } from '@/sanity/lib/image'
import { preloadImages } from '@/lib/preloadImages'
import { getImageDimensions } from '@/lib/getImageDimensions'


const LIGHTBOX_WIDTH_DESKTOP = 1800
const LIGHTBOX_WIDTH_MOBILE = 1200

// En móvil, en vez de disparar la descarga de TODAS las miniaturas de golpe
// (algunas galerías tienen 20+ fotos), solo se cargan de inicio las primeras
// (lo que se ve nada más entrar) y el resto se van pidiendo progresivamente
// según el usuario se acerca haciendo scroll, con margen de sobra para que
// no se note espera. En escritorio se mantiene el comportamiento de siempre.
const MOBILE_EAGER_THUMBNAIL_COUNT = 2
const MOBILE_PRELOAD_MARGIN = '1200px'

export default function ProjectGallery({
  images,
  title,
}: {
  images: any[]
  title: string
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [visible, setVisible] = useState<boolean[]>(() => images.map(() => false))
  const [loaded, setLoaded] = useState<boolean[]>(() => images.map(() => false))
  const [shouldLoad, setShouldLoad] = useState<boolean[]>(() =>
    images.map((_, i) => i < MOBILE_EAGER_THUMBNAIL_COUNT)
  )
  const [isMobile, setIsMobile] = useState(false)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [cursorSide, setCursorSide] = useState<'left' | 'right' | null>(null)
  const thumbRefs = useRef<(HTMLImageElement | null)[]>([])
  const pinchRef = useRef<{ startDist: number; startScale: number } | null>(null)
  const panRef = useRef<{ startX: number; startY: number; startOffsetX: number; startOffsetY: number } | null>(null)
  const scrollYRef = useRef(0)
  const baseRectRef = useRef<{ width: number; height: number } | null>(null)

  const close = () => setActiveIndex(null)
  const showPrev = () =>
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + images.length) % images.length
    )
  const showNext = () =>
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % images.length
    )

  // Detectar viewport móvil
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)')
    setIsMobile(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  // En escritorio no hace falta escalonar la carga: se piden todas desde el
  // principio, como siempre.
  useEffect(() => {
    if (isMobile) return
    setShouldLoad(images.map(() => true))
  }, [isMobile, images])

  // En móvil, ir marcando como "a cargar" cada miniatura según se acerca al
  // viewport (con bastante margen de antelación), en vez de todas a la vez.
  useEffect(() => {
    if (!isMobile) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const index = Number(el.dataset.index)
            setShouldLoad((prev) => {
              if (prev[index]) return prev
              const next = [...prev]
              next[index] = true
              return next
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: `0px ${MOBILE_PRELOAD_MARGIN} 0px ${MOBILE_PRELOAD_MARGIN}`, threshold: 0 }
    )

    thumbRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [isMobile, images.length])


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Precarga en resolución de lightbox solo la imagen abierta y sus vecinas
  // (anterior/siguiente), y solo cuando el lightbox está realmente abierto.
  // Antes se precargaban TODAS las imágenes del proyecto en alta calidad
  // nada más entrar en la página, duplicando la descarga de cada imagen
  // (miniatura + versión de lightbox) desde el primer segundo — muy pesado
  // con datos móviles.
  useEffect(() => {
    if (activeIndex === null || images.length === 0) return

    const width = isMobile ? LIGHTBOX_WIDTH_MOBILE : LIGHTBOX_WIDTH_DESKTOP
    const prevIndex = (activeIndex - 1 + images.length) % images.length
    const nextIndex = (activeIndex + 1) % images.length

    preloadImages([images[activeIndex], images[prevIndex], images[nextIndex]], 95, width)
  }, [activeIndex, images, isMobile])


  useEffect(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
    baseRectRef.current = null
  }, [activeIndex])

  // Bloquear scroll de fondo mientras el lightbox está abierto (escritorio + móvil)
  useEffect(() => {
    if (activeIndex === null) return

    scrollYRef.current = window.scrollY
    const { style } = document.body
    const prevOverflow = style.overflow
    const prevPosition = style.position
    const prevTop = style.top
    const prevWidth = style.width

    style.overflow = 'hidden'
    style.position = 'fixed'
    style.top = `-${scrollYRef.current}px`
    style.width = '100%'

    return () => {
      style.overflow = prevOverflow
      style.position = prevPosition
      style.top = prevTop
      style.width = prevWidth
      window.scrollTo(0, scrollYRef.current)
    }
  }, [activeIndex])

  useEffect(() => {
    if (activeIndex === null) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, images.length])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const index = Number(el.dataset.index)

            setVisible((prev) => {
              if (prev[index]) return prev
              const next = [...prev]
              next[index] = true
              return next
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )

    thumbRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [images.length])

  // ---- Cursor nativo tipo "pasar diapositivas" en escritorio ----
  function handleOverlayMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (isMobile) return
    const isLeft = e.clientX < window.innerWidth / 2
    setCursorSide(isLeft ? 'left' : 'right')
  }

  function handleOverlayMouseLeave() {
    setCursorSide(null)
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (isMobile) {
      close()
      return
    }
    const isLeft = e.clientX < window.innerWidth / 2
    if (isLeft) {
      showPrev()
    } else {
      showNext()
    }
  }

  function handleOverlayMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  function clampOffset(x: number, y: number, currentScale: number) {
    if (!baseRectRef.current) return { x, y }
    const maxX = (baseRectRef.current.width * (currentScale - 1)) / 2
    const maxY = (baseRectRef.current.height * (currentScale - 1)) / 2
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    }
  }

  // ---- Pinch-to-zoom + desplazamiento (pan) manual en móvil ----
  function getTouchDistance(touches: React.TouchList) {
    const [t1, t2] = [touches[0], touches[1]]
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
  }

  function handleTouchStart(e: React.TouchEvent<HTMLImageElement>) {
    if (!baseRectRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      baseRectRef.current = { width: rect.width / scale, height: rect.height / scale }
    }

    if (e.touches.length === 2) {
      panRef.current = null
      pinchRef.current = {
        startDist: getTouchDistance(e.touches),
        startScale: scale,
      }
    } else if (e.touches.length === 1 && scale > 1) {
      pinchRef.current = null
      panRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        startOffsetX: offset.x,
        startOffsetY: offset.y,
      }
    }
  }

  // Bloquear el pinch-zoom nativo de Safari (gesture events) mientras el lightbox está abierto
  useEffect(() => {
    if (activeIndex === null) return

    function preventGesture(e: Event) {
      e.preventDefault()
    }

    document.addEventListener('gesturestart', preventGesture)
    document.addEventListener('gesturechange', preventGesture)
    document.addEventListener('gestureend', preventGesture)

    return () => {
      document.removeEventListener('gesturestart', preventGesture)
      document.removeEventListener('gesturechange', preventGesture)
      document.removeEventListener('gestureend', preventGesture)
    }
  }, [activeIndex])

  function handleTouchMove(e: React.TouchEvent<HTMLImageElement>) {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault()
      const dist = getTouchDistance(e.touches)
      const ratio = dist / pinchRef.current.startDist
      const nextScale = Math.min(4, Math.max(1, pinchRef.current.startScale * ratio))
      setScale(nextScale)
      if (nextScale === 1) {
        setOffset({ x: 0, y: 0 })
      } else {
        setOffset((prev) => clampOffset(prev.x, prev.y, nextScale))
      }
    } else if (e.touches.length === 1 && panRef.current && scale > 1) {
      e.preventDefault()
      const deltaX = e.touches[0].clientX - panRef.current.startX
      const deltaY = e.touches[0].clientY - panRef.current.startY
      const next = clampOffset(
        panRef.current.startOffsetX + deltaX,
        panRef.current.startOffsetY + deltaY,
        scale
      )
      setOffset(next)
    }
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLImageElement>) {
    if (e.touches.length < 2) {
      pinchRef.current = null
    }
    if (e.touches.length < 1) {
      panRef.current = null
    }
  }

  const overlayCursor = isMobile
    ? 'default'
    : cursorSide === 'left'
      ? 'w-resize'
      : cursorSide === 'right'
        ? 'e-resize'
        : 'default'

  return (
    <>
      <div className="project-gallery">
        {images.map((image, i) => {
          const position = i % 3
          const colClass =
            position === 0 ? 'gallery-col-1' : position === 1 ? 'gallery-col-2' : 'gallery-col-3'
          const dims = getImageDimensions(image)

          // En móvil todas las imágenes empiezan a cargar desde el principio
          // (no se espera a que entren en el viewport del carrusel horizontal).
          // En ambos casos, una imagen solo se revela cuando todas las anteriores
          // ya han terminado de cargar, para que nunca aparezca una posterior
          // antes que una anterior por llegar antes de la CDN.
          const priorImagesReady = isMobile
            ? images.slice(0, i).every((_, j) => loaded[j])
            : images.slice(0, i).every((_, j) => !visible[j] || loaded[j])
          const canReveal = isMobile
            ? loaded[i] && priorImagesReady
            : visible[i] && loaded[i] && priorImagesReady

          return (
            <button
              key={i}
              type="button"
              className={colClass}
              onClick={() => setActiveIndex(i)}
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              <img
                ref={(el) => {
                  thumbRefs.current[i] = el
                  if (el?.complete && el.src) {
                    setLoaded((prev) => {
                      if (prev[i]) return prev
                      const next = [...prev]
                      next[i] = true
                      return next
                    })
                  }
                }}
                data-index={i}
                src={shouldLoad[i] ? urlFor(image).width(800).quality(95).auto('format').url() : undefined}
                alt={title}
                loading="eager"
                fetchPriority={i === 0 ? 'high' : 'auto'}
                onLoad={() =>
                  setLoaded((prev) => {
                    if (prev[i]) return prev
                    const next = [...prev]
                    next[i] = true
                    return next
                  })
                }
                className={`gallery-thumbnail ${canReveal ? 'is-visible' : ''}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  aspectRatio: dims ? `${dims.width} / ${dims.height}` : undefined,
                }}
              />
            </button>
          )
        })}
      </div>

      {activeIndex !== null && (
        <div
          data-lightbox-overlay
          onClick={handleOverlayClick}
          onMouseMove={handleOverlayMouseMove}
          onMouseLeave={handleOverlayMouseLeave}
          onMouseDown={handleOverlayMouseDown}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            touchAction: 'none',
            overflow: 'hidden',
            cursor: overlayCursor,
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          <img
            src={urlFor(images[activeIndex]).width(isMobile ? LIGHTBOX_WIDTH_MOBILE : LIGHTBOX_WIDTH_DESKTOP).quality(95).auto('format').url()}
            alt={title}
            draggable={false}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              maxWidth: '90vw',
              maxHeight: '90svh',
              objectFit: 'contain',
              opacity: 1,
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transformOrigin: 'center center',
              touchAction: 'none',
              pointerEvents: isMobile ? 'auto' : 'none',
              cursor: 'inherit',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
            }}
          />

          <button
            onClick={(e) => {
              e.stopPropagation()
              close()
            }}
            aria-label="Cerrar"
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              zIndex: 1002,
            }}
          >
            <img src="/icons/close.svg" alt="" style={{ width: '100%', maxWidth: '10px', display: 'block' }} />
          </button>
        </div>
      )}
    </>
  )
}
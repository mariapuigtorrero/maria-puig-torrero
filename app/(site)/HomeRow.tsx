'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

const ACTIVATION_FRACTION_DESKTOP = 1
const ACTIVATION_FRACTION_MOBILE = 1
const EASE = 0.08 // más bajo = más suave/lento en alcanzar el objetivo, más alto = más directo

export default function HomeRow({
  project,
  hideDirection,
}: {
  project: any
  hideDirection: 'hide-right' | 'hide-left'
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const activationDistanceRef = useRef(1)
  const initialViewportHeightRef = useRef(0)
  const currentProgressRef = useRef(0)
  const [loaded, setLoaded] = useState<boolean[]>(() =>
    (project.homeImages ?? []).map(() => false)
  )

  useLayoutEffect(() => {
    let rafId: number

    initialViewportHeightRef.current = window.innerHeight

    function recalculateActivationDistance() {
      const isMobile = window.innerWidth <= 768
      const activationFraction = isMobile
        ? ACTIVATION_FRACTION_MOBILE
        : ACTIVATION_FRACTION_DESKTOP

      const maxScroll =
        document.documentElement.scrollHeight - initialViewportHeightRef.current
      activationDistanceRef.current = maxScroll * activationFraction || 1
    }

    function loop() {
      const track = trackRef.current
      if (track) {
        const targetProgress = Math.min(
          Math.max(window.scrollY / activationDistanceRef.current, 0),
          1
        )

        currentProgressRef.current +=
          (targetProgress - currentProgressRef.current) * EASE

        const factor =
          hideDirection === 'hide-right'
            ? currentProgressRef.current
            : 1 - currentProgressRef.current

        track.style.transform = `translate3d(calc(-1 * var(--home-row-shift) * ${factor}), 0, 0)`
      }

      rafId = requestAnimationFrame(loop)
    }

    recalculateActivationDistance()
    rafId = requestAnimationFrame(loop)

    const resizeObserver = new ResizeObserver(() => {
      recalculateActivationDistance()
    })
    resizeObserver.observe(document.body)

    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
    }
  }, [hideDirection])

 return (
  <Link href={`/projects/${project.slug.current}`} className="home-row">
    <div className={`home-row-track ${hideDirection}`} ref={trackRef}>
      {project.homeImages?.map((image: any, i: number) => (
        <div className="home-row-image" key={i}>
          <img
            src={urlFor(image).width(900).quality(95).auto('format').url()}
            alt={project.title}
            loading="eager"
            fetchPriority={i === 0 ? 'high' : 'auto'}
            ref={(el) => {
              if (el?.complete) {
                setLoaded((prev) => {
                  if (prev[i]) return prev
                  const next = [...prev]
                  next[i] = true
                  return next
                })
              }
            }}
            onLoad={() =>
              setLoaded((prev) => {
                if (prev[i]) return prev
                const next = [...prev]
                next[i] = true
                return next
              })
            }
            className={`fade-image ${loaded[i] ? 'is-loaded' : ''}`}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      ))}
    </div>

    <div className="grid-13 home-row-title-grid">
      <p className={hideDirection === 'hide-right' ? 'home-row-title-left' : 'home-row-title-right'}>
        {project.title}
      </p>
    </div>
  </Link>
)
}

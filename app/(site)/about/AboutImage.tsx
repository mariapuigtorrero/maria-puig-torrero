'use client'

import { useState } from 'react'

export default function AboutImage() {
  const [loaded, setLoaded] = useState(false)

  return (
    <img
      src="/images/maria-puig-profile.webp"
      alt="María Puig Torrero"
      loading="eager"
      ref={(el) => {
        if (el?.complete) setLoaded(true)
      }}
      onLoad={() => setLoaded(true)}
      className={`fade-image ${loaded ? 'is-loaded' : ''}`}
    />
  )
}

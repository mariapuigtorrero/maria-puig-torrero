'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { preloadImages } from '@/lib/preloadImages'


const AUTO_ROTATE_INTERVAL = 2000
const MOBILE_ROTATE_INTERVAL = 2500
const MOBILE_ROTATE_STAGGER = 150 // ms de desfase progresivo por tarjeta (1ª a última)

function PreviewImage({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <img
      src={src}
      alt=""
      loading="eager"
      ref={(el) => {
        if (el?.complete) setLoaded(true)
      }}
      onLoad={() => setLoaded(true)}
      className={`fade-image ${loaded ? 'is-loaded' : ''}`}
    />
  )
}

function WorkMobileCard({ project, index }: { project: any; index: number }) {
  const [imgIndex, setImgIndex] = useState(0)
  const images = project.workPreviewImages ?? []

  useEffect(() => {
    if (images.length <= 1) return

    let interval: ReturnType<typeof setInterval>
    const delay = index * MOBILE_ROTATE_STAGGER

    const timeout = setTimeout(() => {
      setImgIndex((prev) => (prev + 1) % images.length)
      interval = setInterval(() => {
        setImgIndex((prev) => (prev + 1) % images.length)
      }, MOBILE_ROTATE_INTERVAL)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [images.length, index])


  

  return (
    <Link href={`/projects/${project.slug.current}`} className="work-mobile-card">
      <div className="work-mobile-card-image">
        {images.map((img: any, i: number) => (
          <img
            key={i}
            src={urlFor(img).width(700).quality(95).auto('format').url()}
            alt=""
            loading="eager"
            className={i === imgIndex ? 'work-mobile-card-img is-active' : 'work-mobile-card-img'}
          />
        ))}
      </div>
      <p className="work-mobile-card-title">{project.title}</p>
    </Link>
  )
}





export default function WorkList({
  projects,
  categories,
}: {
  projects: any[]
  categories: any[]
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [autoIndex, setAutoIndex] = useState(0)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const filteredProjects = selectedCategoryId
    ? projects.filter((p) =>
      p.categories?.some((c: any) => c._id === selectedCategoryId)
    )
    : projects

  // Detectar viewport móvil
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)')
    setIsMobile(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])


  useEffect(() => {
  filteredProjects.forEach((p) => {
    preloadImages(p.workPreviewImages)
  })
}, [filteredProjects])

  // Reinicia el índice automático al cambiar de filtro de categoría
  useEffect(() => {
    setAutoIndex(0)
  }, [selectedCategoryId])

  // Ciclo automático: avanza cada 2s, pausado mientras el usuario tiene el hover fijo o en móvil
  useEffect(() => {
    if (isMobile) return
    if (hoveredId !== null) return
    if (filteredProjects.length === 0) return

    const interval = setInterval(() => {
      setAutoIndex((prev) => (prev + 1) % filteredProjects.length)
    }, AUTO_ROTATE_INTERVAL)

    return () => clearInterval(interval)
  }, [isMobile, hoveredId, filteredProjects.length])

  // Proyecto "activo": el que tiene hover manual, o si no hay, el del ciclo automático
  const activeId = hoveredId ?? filteredProjects[autoIndex]?._id ?? null
  const hoveredProject = filteredProjects.find((p) => p._id === activeId)
  const activeCategoryIds = isMobile
    ? new Set()
    : new Set(hoveredProject?.categories?.map((c: any) => c._id) ?? [])

  const categoriesList = (
    <>
      {categories.map((c, i) => (
        <span key={c._id}>
          <span
            className={
              activeCategoryIds.has(c._id) || selectedCategoryId === c._id
                ? 'work-active work-category-clickable'
                : 'work-category-clickable'
            }
            onClick={() =>
              setSelectedCategoryId((prev) => (prev === c._id ? null : c._id))
            }
          >
            {c.name}
          </span>
          {i < categories.length - 1 && ' / '}
        </span>
      ))}
    </>
  )

  return (
    <>
      {/* ===== Desktop ===== */}
      <div className="work-desktop-only">
        <p className="work-categories">{categoriesList}</p>

        <div className="work-projects">
          {filteredProjects.map((p, i) => (
            <Link
              key={p._id}
              href={`/projects/${p.slug.current}`}
              className={activeId === p._id ? 'work-active' : ''}
              onMouseEnter={() => {
                setHoveredId(p._id)
                setAutoIndex(i)
              }}
              onMouseLeave={() => setHoveredId(null)}
            >
              {p.title}
            </Link>
          ))}
        </div>

        {hoveredProject ? (
          <Link href={`/projects/${hoveredProject.slug.current}`} className="work-preview">
            <div className="work-preview-1">
              {hoveredProject.workPreviewImages?.[0] && (
                <PreviewImage
                  key={activeId}
                  src={urlFor(hoveredProject.workPreviewImages[0]).width(600).quality(95).auto('format').url()}
                />
              )}
            </div>
            <div className="work-preview-2">
              {hoveredProject.workPreviewImages?.[1] && (
                <PreviewImage
                  key={activeId}
                  src={urlFor(hoveredProject.workPreviewImages[1]).width(600).quality(95).auto('format').url()}
                />
              )}
            </div>
            <div className="work-preview-3">
              {hoveredProject.workPreviewImages?.[2] && (
                <PreviewImage
                  key={activeId}
                  src={urlFor(hoveredProject.workPreviewImages[2]).width(600).quality(95).auto('format').url()}
                />
              )}
            </div>
          </Link>
        ) : (
          <div className="work-preview" />
        )}
      </div>

      {/* ===== Mobile ===== */}
      <div className="work-mobile-only">
        <p className="work-categories-mobile">Filter: {categoriesList}</p>

        <div className="work-mobile-grid">
          {filteredProjects.map((p, i) => (
            <WorkMobileCard key={p._id} project={p} index={i} />
          ))}
        </div>
      </div>
    </>
  )
}
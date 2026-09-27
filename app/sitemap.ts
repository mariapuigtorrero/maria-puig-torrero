import { MetadataRoute } from 'next'
import { getWorkProjects, getProjectsForSitemap } from '@/lib/sanity'
import { urlFor } from '@/sanity/lib/image'
import { SITE_URL } from '@/lib/siteUrl'

const baseUrl = SITE_URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getWorkProjects()
  const projectsWithImages = await getProjectsForSitemap()

  // Next.js no codifica el "&" de las URLs de imagen al generar el XML del
  // sitemap, y las URLs de Sanity siempre llevan varios parámetros separados
  // por "&" (w, h, q, auto...), lo que rompe la sintaxis del XML si no se
  // codifica aquí manualmente como "&amp;".
  const imagesBySlug = new Map(
    projectsWithImages.map((p) => [
      p.slug,
      (p.gallery ?? []).map((image) =>
        urlFor(image).width(1600).quality(90).auto('format').url().replace(/&/g, '&amp;')
      ),
    ])
  )

  const projectUrls = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug.current}`,
    lastModified: new Date(),
    images: imagesBySlug.get(p.slug.current) ?? undefined,
  }))

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/work`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/legal-notice`, lastModified: new Date() },
    ...projectUrls,
  ]
}

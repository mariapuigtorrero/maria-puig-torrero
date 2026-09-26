import { MetadataRoute } from 'next'
import { getWorkProjects, getProjectsForSitemap } from '@/lib/sanity'
import { urlFor } from '@/sanity/lib/image'
import { SITE_URL } from '@/lib/siteUrl'

const baseUrl = SITE_URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getWorkProjects()
  const projectsWithImages = await getProjectsForSitemap()

  const imagesBySlug = new Map(
    projectsWithImages.map((p) => [
      p.slug,
      (p.gallery ?? []).map((image) => urlFor(image).width(1600).quality(90).auto('format').url()),
    ])
  )

  const projectUrls = projects.map((p: any) => ({
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

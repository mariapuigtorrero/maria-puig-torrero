import { MetadataRoute } from 'next'
import { getWorkProjects } from '@/lib/sanity'
import { SITE_URL } from '@/lib/siteUrl'

const baseUrl = SITE_URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getWorkProjects()

  const projectUrls = projects.map((p: any) => ({
    url: `${baseUrl}/projects/${p.slug.current}`,
    lastModified: new Date(),
  }))

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/work`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/legal-notice`, lastModified: new Date() },
    ...projectUrls,
  ]
}
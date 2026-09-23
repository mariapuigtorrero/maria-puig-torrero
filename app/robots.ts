import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/siteUrl'

const baseUrl = SITE_URL

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/api'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
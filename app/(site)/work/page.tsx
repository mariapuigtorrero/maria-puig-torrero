import type { Metadata } from 'next'
import { getWorkProjects, getCategories, getWorkSeo } from '@/lib/sanity'
import { urlFor } from '@/sanity/lib/image'
import WorkList from './WorkList'

const DEFAULT_TITLE = 'Work — María Puig Torrero'
const DEFAULT_DESCRIPTION =
  'Selected fashion and editorial photography projects by María Puig Torrero, Spanish based Photographer, Creative and Art Director.'
const DEFAULT_IMAGE = '/images/maria-puig-profile.webp'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getWorkSeo()

  const title = seo?.metaTitle || DEFAULT_TITLE
  const description = seo?.metaDescription || DEFAULT_DESCRIPTION
  const image = seo?.metaImage
    ? urlFor(seo.metaImage).width(1200).height(630).quality(90).auto('format').url()
    : DEFAULT_IMAGE

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
  }
}

export default async function WorkPage() {
  const [projects, categories] = await Promise.all([
    getWorkProjects(),
    getCategories(),
  ])

  return (
    <main className="grid-13 work-main">
      <WorkList projects={projects} categories={categories} />
    </main>
  )
}
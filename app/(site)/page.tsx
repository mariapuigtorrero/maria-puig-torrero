import type { Metadata } from 'next'
import { getHomeProjects, getHomeSeo } from '@/lib/sanity'
import { urlFor } from '@/sanity/lib/image'
import HomeRow from './HomeRow'

const DEFAULT_TITLE = 'María Puig Torrero — Photographer, Creative & Art Director'
const DEFAULT_DESCRIPTION =
  'María Puig Torrero is a Spanish based Photographer, Creative and Art Director.'
const DEFAULT_IMAGE = '/images/maria-puig-profile.webp'

// Se revalida sola cada minuto: sin esto, la página queda estática desde el
// build y los cambios de orden/proyectos en el Studio solo se verían en
// producción si la conexión en vivo con Sanity llega a disparar una
// revalidación (y en local no hace falta, porque el dev server no cachea).
export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomeSeo()

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

export default async function HomePage() {
  const projects = await getHomeProjects()

  return (
    <main className="home-main">
      {projects.map((project, rowIndex) => (
        <HomeRow
          key={project._id}
          project={project}
          hideDirection={rowIndex % 2 === 0 ? 'hide-right' : 'hide-left'}
        />
      ))}
    </main>
  )
}

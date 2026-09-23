import { getProject, getAllProjectSlugs } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import type { Metadata } from 'next'
import ProjectGallery from './ProjectGallery'

// Pre-renderiza todas las páginas de proyecto como estáticas (ISR) en vez de
// generarlas de nuevo en cada visita: una visita normal (o de un bot) recibe
// una copia ya cacheada, sin gastar cuota de Sanity/Vercel por cada request.
// Se revalida sola cada 5 minutos, y la vista previa de borradores (draft
// mode) sigue funcionando en tiempo real igualmente, sin verse afectada.
export const revalidate = 300

export async function generateStaticParams() {
  const projects = await getAllProjectSlugs()
  return projects.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) return {}

  const title = project.seo?.metaTitle || project.title
  const description = project.seo?.metaDescription || project.subtitle || undefined
  const image = project.seo?.metaImage || project.coverImage

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [urlFor(image).width(1200).height(630).quality(90).auto('format').url()] : undefined,
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) notFound()

  return (
    <main className="grid-13">
      <ProjectGallery images={project.gallery ?? []} title={project.title} />

      <div className="project-info-name">
       <h1>{project.title}</h1>
{project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}
      </div>
      <div className="project-info-description">
        <PortableText value={project.description} />
      </div>
    </main>
  )
}
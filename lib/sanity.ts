import { sanityFetch } from '@/sanity/lib/live'
import { client } from '@/sanity/lib/client'
import type {
  ProjectDetail,
  HomeProject,
  SeoData,
  AboutContent,
  ProjectListItem,
  SanityCategory,
  SanityImage,
  PortableTextBlock,
} from './types'

export async function getProject(slug: string) {
  const { data } = await sanityFetch({
    query: `*[_type == "project" && slug.current == $slug][0]{
      _id,
      title,
      subtitle,
      slug,
      coverImage,
      categories[]->{ _id, name, slug },
      gallery,
      description,
      seo
    }`,
    params: { slug },
  })
  return data as ProjectDetail | null
}


export async function getHomeProjects() {
  const { data } = await sanityFetch({
    query: `*[_type == "homeGallery"][0]{
      order[]->{
        _id,
        title,
        slug,
        homeImages
      }
    }`,
  })
  return ((data as { order?: HomeProject[] } | null)?.order ?? []) as HomeProject[]
}

export async function getHomeSeo() {
  const { data } = await sanityFetch({
    query: `*[_type == "homeGallery"][0]{ seo }`,
  })
  return ((data as { seo?: SeoData } | null)?.seo ?? null) as SeoData | null
}

export async function getAboutSeo() {
  const { data } = await sanityFetch({
    query: `*[_type == "aboutPage"][0]{ seo }`,
  })
  return ((data as { seo?: SeoData } | null)?.seo ?? null) as SeoData | null
}

export async function getWorkSeo() {
  const { data } = await sanityFetch({
    query: `*[_type == "workPage"][0]{ seo }`,
  })
  return ((data as { seo?: SeoData } | null)?.seo ?? null) as SeoData | null
}

export async function getLegalNoticeSeo() {
  const { data } = await sanityFetch({
    query: `*[_type == "legalNoticePage"][0]{ seo }`,
  })
  return ((data as { seo?: SeoData } | null)?.seo ?? null) as SeoData | null
}

export async function getAboutContent() {
  const { data } = await sanityFetch({
    query: `*[_type == "aboutPage"][0]{ bio, contact, social }`,
  })
  return (data ?? null) as AboutContent | null
}

export async function getLegalNoticeBody() {
  const { data } = await sanityFetch({
    query: `*[_type == "legalNoticePage"][0]{ body }`,
  })
  return ((data as { body?: PortableTextBlock[] } | null)?.body ?? null) as PortableTextBlock[] | null
}


export async function getProjectsForSitemap() {
  const { data } = await sanityFetch({
    query: `*[_type == "project" && defined(slug.current)]{
      "slug": slug.current,
      gallery
    }`,
  })
  return (data ?? []) as { slug: string; gallery?: SanityImage[] }[]
}

export async function getWorkProjects() {
  // El orden manual (arrastrar y soltar en el documento "Work" del Studio)
  // tiene prioridad; cualquier proyecto que todavía no se haya añadido a esa
  // lista aparece igualmente, al final y ordenado por título, para que un
  // proyecto nuevo nunca deje de aparecer en Work por no haberlo ordenado
  // todavía.
  const projectFields = `{
    _id,
    title,
    slug,
    categories[]->{ _id, name },
    workPreviewImages
  }`

  const { data } = await sanityFetch({
    query: `{
      "ordered": *[_type == "workPage"][0].order[]->${projectFields},
      "all": *[_type == "project"] | order(title asc)${projectFields}
    }`,
  })

  const { ordered, all } = (data ?? {}) as {
    ordered?: ProjectListItem[]
    all?: ProjectListItem[]
  }

  const orderedIds = new Set((ordered ?? []).map((p) => p._id))
  const remaining = (all ?? []).filter((p) => !orderedIds.has(p._id))

  return [...(ordered ?? []), ...remaining]
}

export async function getCategories() {
  const { data } = await sanityFetch({
    query: `*[_type == "category"] | order(name asc){ _id, name }`,
  })
  return (data ?? []) as SanityCategory[]
}

export async function getAllProjectSlugs() {
  const data = await client.fetch(
    `*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`
  )
  return (data ?? []) as { slug: string }[]
}

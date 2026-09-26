import { sanityFetch } from '@/sanity/lib/live'
import { client } from '@/sanity/lib/client'

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
  return data as any
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
  return ((data as any)?.order ?? []) as any
}

export async function getHomeSeo() {
  const { data } = await sanityFetch({
    query: `*[_type == "homeGallery"][0]{ seo }`,
  })
  return ((data as any)?.seo ?? null) as any
}

export async function getAboutSeo() {
  const { data } = await sanityFetch({
    query: `*[_type == "aboutPage"][0]{ seo }`,
  })
  return ((data as any)?.seo ?? null) as any
}

export async function getWorkSeo() {
  const { data } = await sanityFetch({
    query: `*[_type == "workPage"][0]{ seo }`,
  })
  return ((data as any)?.seo ?? null) as any
}

export async function getLegalNoticeSeo() {
  const { data } = await sanityFetch({
    query: `*[_type == "legalNoticePage"][0]{ seo }`,
  })
  return ((data as any)?.seo ?? null) as any
}

export async function getAboutContent() {
  const { data } = await sanityFetch({
    query: `*[_type == "aboutPage"][0]{ bio, contact, social }`,
  })
  return (data ?? null) as { bio?: any; contact?: any; social?: any } | null
}

export async function getLegalNoticeBody() {
  const { data } = await sanityFetch({
    query: `*[_type == "legalNoticePage"][0]{ body }`,
  })
  return ((data as any)?.body ?? null) as any
}


export async function getProjectsForSitemap() {
  const { data } = await sanityFetch({
    query: `*[_type == "project" && defined(slug.current)]{
      "slug": slug.current,
      gallery
    }`,
  })
  return (data ?? []) as { slug: string; gallery?: any[] }[]
}

export async function getWorkProjects() {
  const { data } = await sanityFetch({
    query: `*[_type == "project"] | order(title asc){
      _id,
      title,
      slug,
      categories[]->{ _id, name },
      workPreviewImages
    }`,
  })
  return (data ?? []) as any
}

export async function getCategories() {
  const { data } = await sanityFetch({
    query: `*[_type == "category"] | order(name asc){ _id, name }`,
  })
  return (data ?? []) as any
}

export async function getAllProjectSlugs() {
  const data = await client.fetch(
    `*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`
  )
  return (data ?? []) as { slug: string }[]
}
import type { PortableTextBlock } from '@portabletext/types'

export interface SanityImageAsset {
  _ref?: string
  _id?: string
  _type?: string
}

export interface SanityImage {
  _type?: string
  asset?: SanityImageAsset
  hotspot?: { x: number; y: number; height: number; width: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}

export interface SanityCategory {
  _id: string
  name: string
  slug?: { current: string }
}

export interface SanitySlug {
  current: string
}

export interface SeoData {
  metaTitle?: string
  metaDescription?: string
  metaImage?: SanityImage
}

export interface ProjectListItem {
  _id: string
  title: string
  slug: SanitySlug
  categories?: SanityCategory[]
  workPreviewImages?: SanityImage[]
}

export interface HomeProject {
  _id: string
  title: string
  slug: SanitySlug
  homeImages?: SanityImage[]
}

export interface ProjectDetail {
  _id: string
  title: string
  subtitle?: string
  slug: SanitySlug
  coverImage?: SanityImage
  categories?: SanityCategory[]
  gallery?: SanityImage[]
  description?: PortableTextBlock[]
  seo?: SeoData
}

export interface AboutContent {
  bio?: PortableTextBlock[]
  contact?: PortableTextBlock[]
  social?: PortableTextBlock[]
}

export type { PortableTextBlock }

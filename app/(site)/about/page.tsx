import type { Metadata } from 'next'
import { getAboutSeo } from '@/lib/sanity'
import { urlFor } from '@/sanity/lib/image'
import AboutImage from './AboutImage'

const DEFAULT_TITLE = 'About — María Puig Torrero'
const DEFAULT_DESCRIPTION =
  'María Puig Torrero is a Spanish based Photographer, Creative and Art Director.'
const DEFAULT_IMAGE = '/images/maria-puig-profile.webp'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getAboutSeo()

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

export default function AboutPage() {
  return (
    <main className="about-main">
      <div className="grid-13 about-content">
        <p className="about-text">
          María Puig Torrero is a spanish based Photographer, Creative and Art Director.
        </p>

        <div className="about-image">
          <AboutImage />
        </div>

        <p className="about-contact">
          For all enquiries, please say hello at{' '}
          <a href="mailto:hello@mariapuigtorrero.com">hello@mariapuigtorrero.com</a>
        </p>

        <div className="about-social">
          <a href="https://www.instagram.com/mpuigtorrero/" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href="https://www.linkedin.com/in/mar%C3%ADa-puig-torrero-396292175/" target="_blank" rel="noopener noreferrer">
            Linkedin
          </a>
        </div>
      </div>
    </main>
  )
}
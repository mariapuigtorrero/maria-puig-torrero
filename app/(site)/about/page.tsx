import type { Metadata } from 'next'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { getAboutSeo, getAboutContent } from '@/lib/sanity'
import { urlFor } from '@/sanity/lib/image'
import AboutImage from './AboutImage'

const DEFAULT_TITLE = 'About — María Puig Torrero'
const DEFAULT_DESCRIPTION =
  'María Puig Torrero is a Spanish based Photographer, Creative and Art Director.'
const DEFAULT_IMAGE = '/images/maria-puig-profile.webp'

const aboutTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="about-text">{children}</p>,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
}

const aboutContactComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="about-contact">{children}</p>,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href}>{children}</a>
    ),
  },
}

const aboutSocialComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <>{children}</>,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
}

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

export default async function AboutPage() {
  const content = await getAboutContent()
  const bio = content?.bio
  const contact = content?.contact
  const social = content?.social

  return (
    <main className="about-main">
      <div className="grid-13 about-content">
        {bio && bio.length > 0 ? (
          <PortableText value={bio} components={aboutTextComponents} />
        ) : (
          <p className="about-text">
            María Puig Torrero is a spanish based Photographer, Creative and Art Director.
          </p>
        )}

        <div className="about-image">
          <AboutImage />
        </div>

        {contact && contact.length > 0 ? (
          <PortableText value={contact} components={aboutContactComponents} />
        ) : (
          <p className="about-contact">
            For all enquiries, please say hello at{' '}
            <a href="mailto:hello@mariapuigtorrero.com">hello@mariapuigtorrero.com</a>
          </p>
        )}

        <div className="about-social">
          {social && social.length > 0 ? (
            <PortableText value={social} components={aboutSocialComponents} />
          ) : (
            <>
              <a href="https://www.instagram.com/mpuigtorrero/" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href="https://www.linkedin.com/in/mar%C3%ADa-puig-torrero-396292175/" target="_blank" rel="noopener noreferrer">
                Linkedin
              </a>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

import type { Metadata } from 'next'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { getLegalNoticeSeo, getLegalNoticeBody } from '@/lib/sanity'
import { urlFor } from '@/sanity/lib/image'

const DEFAULT_TITLE = 'Legal Notice — María Puig Torrero'
const DEFAULT_DESCRIPTION =
  'Legal notice and terms of use for the María Puig Torrero photography portfolio website.'
const DEFAULT_IMAGE = '/images/maria-puig-profile.webp'

const legalTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="legal-text">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="legal-text">{children}</ul>,
    number: ({ children }) => <ol className="legal-text">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
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
  const seo = await getLegalNoticeSeo()

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

export default async function LegalNoticePage() {
  const body = await getLegalNoticeBody()

  return (
    <main className="legal-main">
      <div className="grid-13 legal-content">
        <h1 className="legal-title">Legal Notice</h1>

        {body && body.length > 0 ? (
          <PortableText value={body} components={legalTextComponents} />
        ) : (
          <p className="legal-text">
            In accordance with applicable transparency and information disclosure requirements,
            this website is owned by María Puig Torrero and contact email{' '}
            <a href="mailto:hello@mariapuigtorrero.com">hello@mariapuigtorrero.com</a>. The
            purpose of this website is to showcase and promote her professional photography work.
            Access to and use of this website grants the status of user and implies full
            acceptance of the terms set out in this Legal Notice.
          </p>
        )}
      </div>
    </main>
  )
}

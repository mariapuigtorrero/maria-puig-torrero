import type { Metadata } from 'next'
import { getLegalNoticeSeo } from '@/lib/sanity'
import { urlFor } from '@/sanity/lib/image'

const DEFAULT_TITLE = 'Legal Notice — María Puig Torrero'
const DEFAULT_DESCRIPTION =
  'Legal notice and terms of use for the María Puig Torrero photography portfolio website.'
const DEFAULT_IMAGE = '/images/maria-puig-profile.webp'

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

export default function LegalNoticePage() {
  return (
    <main className="legal-main">
      <div className="grid-13 legal-content">
        <h1 className="legal-title">Legal Notice</h1>

        <p className="legal-text">
          In accordance with applicable transparency and information disclosure requirements,
          this website is owned by María Puig Torrero and contact email{' '}
          <a href="mailto:hello@mariapuigtorrero.com">hello@mariapuigtorrero.com</a>. The
          purpose of this website is to showcase and promote her professional photography work.
          Access to and use of this website grants the status of user and implies full
          acceptance of the terms set out in this Legal Notice.
        </p>
      </div>
    </main>
  )
}
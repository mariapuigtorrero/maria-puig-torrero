import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// A qué ruta(s) afecta cada tipo de documento cuando se publica un cambio.
const PATHS_BY_TYPE: Record<string, string[]> = {
  homeGallery: ['/'],
  workPage: ['/work'],
  aboutPage: ['/about'],
  legalNoticePage: ['/legal-notice'],
  // Las categorías se usan como filtro en la página Work.
  category: ['/work'],
}

// Webhook de Sanity: se dispara en cuanto se publica un cambio en el Studio
// y refresca al instante solo la(s) página(s) afectada(s), sin esperar al
// "revalidate" por tiempo (que se deja como red de seguridad por si este
// aviso llegara a fallar).
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json({ message: 'Falta configurar SANITY_REVALIDATE_SECRET' }, { status: 500 })
  }

  // Hay que leer el cuerpo como texto plano (sin parsear) para que la firma
  // coincida exactamente con lo que Sanity firmó.
  const body = await request.text()
  const signature = request.headers.get(SIGNATURE_HEADER_NAME)

  if (!signature || !(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({ message: 'Firma inválida' }, { status: 401 })
  }

  let payload: { _type?: string; slug?: string } = {}
  try {
    payload = body ? JSON.parse(body) : {}
  } catch {
    return NextResponse.json({ message: 'Cuerpo de la petición inválido' }, { status: 400 })
  }

  const { _type, slug } = payload
  const paths = new Set<string>(_type ? (PATHS_BY_TYPE[_type] ?? []) : [])

  // Un proyecto nuevo o editado puede cambiar también el listado de Home y
  // de Work, además de su propia página.
  if (_type === 'project') {
    paths.add('/')
    paths.add('/work')
    if (slug) paths.add(`/projects/${slug}`)
  }

  paths.forEach((path) => revalidatePath(path))

  return NextResponse.json({ revalidated: true, now: Date.now(), paths: Array.from(paths) })
}

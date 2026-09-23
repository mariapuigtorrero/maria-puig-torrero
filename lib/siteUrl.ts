/**
 * URL absoluta del sitio en producción, resuelta automáticamente sin
 * necesidad de hardcodear ningún dominio:
 *
 * 1. NEXT_PUBLIC_SITE_URL — override manual opcional, por si algún día
 *    se quiere forzar un valor concreto.
 * 2. VERCEL_PROJECT_PRODUCTION_URL — variable que Vercel expone sola y
 *    que siempre apunta al dominio de producción asignado al proyecto
 *    (el .vercel.app mientras no haya dominio propio, y el dominio
 *    personalizado en cuanto se conecte y se marque como producción).
 * 3. VERCEL_URL — variable de cada deployment individual (previews).
 * 4. Fallback fijo, solo por si se ejecuta fuera de Vercel sin ninguna
 *    de las anteriores (por ejemplo, un build local aislado).
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return 'https://maria-puig-torrero.vercel.app'
}

export const SITE_URL = resolveSiteUrl()

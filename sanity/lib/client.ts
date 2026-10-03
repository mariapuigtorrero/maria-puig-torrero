import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Live Content API (defineLive) usa revalidación por tags; con CDN activada las consultas podían servir datos obsoletos tras publicar
})

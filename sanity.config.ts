'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {imageAssetPickerPlugin} from 'sanity-plugin-image-asset-picker'
import { media, mediaAssetSource } from 'sanity-plugin-media'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'
import {previewAction} from './sanity/actions/previewAction'
import {singletonTypes, singletonDocIds} from './sanity/lib/singletonTypes'

export default defineConfig({
  name: 'maria-puig-torrero',
  title: 'María Puig Torrero',
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({structure}),
    imageAssetPickerPlugin(),
    media(),
  ],
  form: {
    image: {
      assetSources: () => [mediaAssetSource],
    },
  },
  releases: {
    enabled: false,
  },
  scheduledDrafts: {
    enabled: false,
  },
  document: {
    // Evita que los tipos "singleton" (Home, About, Work, Legal Notice)
    // aparezcan en el menú global de "+ Create", ya que solo debe existir
    // un documento de cada uno y se editan directamente desde el listado.
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev.filter((templateItem) => !singletonTypes.has(templateItem.templateId))
      }
      return prev
    },
    // Quita "Duplicar" y "Eliminar" solo en el documento singleton exacto
    // (por ID, no por tipo), para no bloquear la limpieza de duplicados
    // accidentales del mismo tipo que puedan aparecer sueltos.
    actions: (prev, context) => {
      if (singletonDocIds.has(context.documentId ?? '')) {
        return prev.filter(({action}) => action && !['delete', 'duplicate'].includes(action))
      }
      return context.schemaType === 'project' ? [...prev, previewAction] : prev
    },
  },
})
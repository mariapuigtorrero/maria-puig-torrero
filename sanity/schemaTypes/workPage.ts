import { defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons/Images'

// Documento único (singleton) con el SEO de la página Work y el orden
// manual de los proyectos que se muestran en ella.
export default defineType({
  name: 'workPage',
  title: 'Work',
  type: 'document',
  icon: ImagesIcon,
  preview: {
    prepare() {
      return { title: 'Work' }
    },
  },
  fields: [
    defineField({
      name: 'order',
      title: 'Orden de los proyectos',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
})

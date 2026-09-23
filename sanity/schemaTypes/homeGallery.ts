import { defineField, defineType } from 'sanity'
import { HomeIcon } from '@sanity/icons/Home'

export default defineType({
  name: 'homeGallery',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  preview: {
    prepare() {
      return { title: 'Orden proyectos' }
    },
  },
  fields: [
    defineField({
      name: 'order',
      title: 'Proyectos en orden',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Si se deja vacío, se usarán los textos e imagen por defecto de la home.',
    }),
  ],
})
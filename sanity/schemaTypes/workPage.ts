import { defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons/Images'

// Documento único (singleton) con el SEO de la página Work.
export default defineType({
  name: 'workPage',
  title: 'Work',
  type: 'document',
  icon: ImagesIcon,
  preview: {
    prepare() {
      return { title: 'SEO — Work' }
    },
  },
  fields: [
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Si se deja vacío, se usarán los textos e imagen por defecto de la página.',
    }),
  ],
})

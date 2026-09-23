import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons/User'

// Documento único (singleton) con el SEO de la página About.
export default defineType({
  name: 'aboutPage',
  title: 'About',
  type: 'document',
  icon: UserIcon,
  preview: {
    prepare() {
      return { title: 'SEO — About' }
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

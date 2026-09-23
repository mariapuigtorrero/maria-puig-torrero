import { defineField, defineType } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons/DocumentText'

// Documento único (singleton) con el SEO de la página Legal Notice.
export default defineType({
  name: 'legalNoticePage',
  title: 'Legal Notice',
  type: 'document',
  icon: DocumentTextIcon,
  preview: {
    prepare() {
      return { title: 'SEO — Legal Notice' }
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

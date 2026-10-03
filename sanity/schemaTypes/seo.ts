import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta título',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta descripción',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'metaImage',
      title: 'Imagen para compartir (redes sociales)',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
})
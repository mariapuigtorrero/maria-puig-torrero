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
      description: 'Si se deja vacío, se usará el título del proyecto.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta descripción',
      type: 'text',
      rows: 3,
      description: 'Si se deja vacío, se usará el subtítulo del proyecto.',
    }),
    defineField({
      name: 'metaImage',
      title: 'Imagen para compartir (redes sociales)',
      type: 'image',
      options: { hotspot: true },
      description: 'Si se deja vacía, se usará la imagen de portada del proyecto.',
    }),
  ],
})
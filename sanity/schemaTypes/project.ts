import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons/Image'

export default defineType({
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'subtitle',
      title: 'Subtítulo',
      type: 'string',
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Imagen de portada',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'categories',
      title: 'Categorías',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),

    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'gallery',
      title: 'Galería del proyecto',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

    defineField({
      name: 'homeImages',
      title: 'Imágenes para la Home (4)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (Rule) => Rule.max(4),
      options: { layout: 'grid' },
    }),

    defineField({
      name: 'workPreviewImages',
      title: 'Imágenes de preview para Work (3)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (Rule) => Rule.max(3),
      options: { layout: 'grid' },
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: undefined,
      options: { collapsible: true, collapsed: true },
    }),
  ],
})
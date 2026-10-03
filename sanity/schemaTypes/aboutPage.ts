import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons/User'

// Documento único (singleton) con el contenido y el SEO de la página About.
export default defineType({
  name: 'aboutPage',
  title: 'About',
  type: 'document',
  icon: UserIcon,
  preview: {
    prepare() {
      return { title: 'About' }
    },
  },
  fields: [
    defineField({
      name: 'bio',
      title: 'Texto de presentación',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Negrita', value: 'strong' },
              { title: 'Cursiva', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Enlace',
                fields: [
                  { name: 'href', type: 'string', title: 'URL o email (ej: https://... o mailto:...)' },
                  { name: 'blank', type: 'boolean', title: 'Abrir en pestaña nueva', initialValue: true },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Texto de contacto',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Negrita', value: 'strong' },
              { title: 'Cursiva', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Enlace',
                fields: [
                  { name: 'href', type: 'string', title: 'URL o email (ej: https://... o mailto:...)' },
                  { name: 'blank', type: 'boolean', title: 'Abrir en pestaña nueva', initialValue: true },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'social',
      title: 'Enlaces a redes sociales',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Negrita', value: 'strong' },
              { title: 'Cursiva', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Enlace',
                fields: [
                  { name: 'href', type: 'string', title: 'URL o email (ej: https://... o mailto:...)' },
                  { name: 'blank', type: 'boolean', title: 'Abrir en pestaña nueva', initialValue: true },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
})

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
      description: 'Si se deja vacío, se usará el texto por defecto.',
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
      description: 'Si se deja vacío, se usará el texto por defecto (con el email de contacto).',
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
      description: 'Si se deja vacío, se usarán los enlaces por defecto (Instagram y Linkedin).',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Si se deja vacío, se usarán los textos e imagen por defecto de la página.',
    }),
  ],
})

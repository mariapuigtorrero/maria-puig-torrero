import { defineField, defineType } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons/DocumentText'

// Documento único (singleton) con el contenido y el SEO de la página Legal Notice.
export default defineType({
  name: 'legalNoticePage',
  title: 'Legal Notice',
  type: 'document',
  icon: DocumentTextIcon,
  preview: {
    prepare() {
      return { title: 'Legal Notice' }
    },
  },
  fields: [
    defineField({
      name: 'body',
      title: 'Texto legal',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [
            { title: 'Con viñetas', value: 'bullet' },
            { title: 'Numerada', value: 'number' },
          ],
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
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Si se deja vacío, se usarán los textos e imagen por defecto de la página.',
    }),
  ],
})

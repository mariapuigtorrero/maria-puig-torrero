import type {StructureResolver} from 'sanity/structure'
import {HomeIcon} from '@sanity/icons/Home'
import {UserIcon} from '@sanity/icons/User'
import {ImagesIcon} from '@sanity/icons/Images'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {singletonTypes, HOME_GALLERY_DOC_ID} from './lib/singletonTypes'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home')
        .icon(HomeIcon)
        .id('homeGallery')
        .child(S.document().schemaType('homeGallery').documentId(HOME_GALLERY_DOC_ID)),
      S.listItem()
        .title('About')
        .icon(UserIcon)
        .id('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.listItem()
        .title('Work')
        .icon(ImagesIcon)
        .id('workPage')
        .child(S.document().schemaType('workPage').documentId('workPage')),
      S.listItem()
        .title('Legal Notice')
        .icon(DocumentTextIcon)
        .id('legalNoticePage')
        .child(S.document().schemaType('legalNoticePage').documentId('legalNoticePage')),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId() ?? ''
        return !id.startsWith('media.') && !singletonTypes.has(id)
      }),
    ])

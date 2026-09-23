import { type SchemaTypeDefinition } from 'sanity'
import category from './category'
import project from './project'
import homeGallery from './homeGallery'
import seo from './seo'
import aboutPage from './aboutPage'
import workPage from './workPage'
import legalNoticePage from './legalNoticePage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, project, homeGallery, seo, aboutPage, workPage, legalNoticePage],
}
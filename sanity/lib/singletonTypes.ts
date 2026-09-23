// ID real del documento "Home" que ya existía en el dataset (con el orden de
// proyectos original) — hay que apuntar a este, no a un ID inventado.
export const HOME_GALLERY_DOC_ID = '17c99c49-b48d-411a-b037-69dfb76c2ec8'

// Tipos de documento "singleton": solo debe existir uno de cada, y se editan
// directamente desde el menú (sin pasar por "+ Create"). Se usa para ocultar
// estos tipos del "+ Create" global.
export const singletonTypes = new Set([
  'homeGallery',
  'aboutPage',
  'workPage',
  'legalNoticePage',
])

// IDs de documento exactos que están protegidos (sin "Duplicar" ni
// "Eliminar"), para no bloquear por error otros documentos del mismo tipo
// que puedan existir sueltos (p. ej. duplicados accidentales a limpiar).
export const singletonDocIds = new Set([
  HOME_GALLERY_DOC_ID,
  'aboutPage',
  'workPage',
  'legalNoticePage',
])

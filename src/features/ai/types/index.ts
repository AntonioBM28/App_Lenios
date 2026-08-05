/** Un producto que coincidió con la búsqueda inteligente, con la razón que dio la IA */
export interface SmartSearchMatch {
  productoId: string
  razon: string
}

/** Respuesta de GET /ai/chef-suggestion */
export interface ChefSuggestion {
  titulo: string
  descripcion: string
  productoIds: string[]
}

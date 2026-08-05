import type { Producto, Categoria } from '@/shared/types'

/**
 * Contrato que debe cumplir cualquier implementación del servicio de menú.
 * MockMenuService lo cumple con datos en memoria.
 * HttpMenuService (futuro) lo cumplirá llamando a la API de NestJS.
 *
 * Los componentes y hooks NUNCA importan la implementación concreta —
 * solo usan este tipo, lo que permite intercambiar implementaciones
 * sin tocar un solo componente.
 */
export interface MenuService {
  getProductos(): Promise<Producto[]>
  getCategorias(): Promise<Categoria[]>
}

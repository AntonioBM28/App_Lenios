import { httpClient } from '@/core/api/httpClient'
import type { Producto, Categoria } from '@/shared/types'
import type { MenuService } from '../types'

/**
 * Implementación real de MenuService contra la API de NestJS.
 * Las formas de respuesta ya coinciden 1:1 con Producto/Categoria
 * (ajustado del lado del backend), así que no hace falta transformar nada.
 */
export class HttpMenuService implements MenuService {
  async getProductos(): Promise<Producto[]> {
    const { data } = await httpClient.get<Producto[]>('/products')
    return data
  }

  async getCategorias(): Promise<Categoria[]> {
    const { data } = await httpClient.get<Categoria[]>('/categories')
    return data
  }
}

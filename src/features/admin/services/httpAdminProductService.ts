import { httpClient } from '@/core/api/httpClient'
import { ENDPOINTS } from '@/core/api/endpoints'
import type { Producto } from '@/shared/types'
import type { AdminProductService } from './adminProductService'

/**
 * Implementación real de AdminProductService contra la API de NestJS.
 * Estas llamadas requieren sesión de admin — el token viaja automático
 * vía el interceptor de httpClient.
 */
export class HttpAdminProductService implements AdminProductService {
  async getAll(): Promise<Producto[]> {
    const { data } = await httpClient.get<Producto[]>(ENDPOINTS.MENU_PRODUCTS)
    return data
  }

  async create(data: Omit<Producto, 'id'>): Promise<Producto> {
    const { data: created } = await httpClient.post<Producto>(ENDPOINTS.MENU_PRODUCTS, data)
    return created
  }

  async update(id: string, data: Partial<Producto>): Promise<Producto> {
    const { data: updated } = await httpClient.patch<Producto>(
      ENDPOINTS.MENU_PRODUCT_BY_ID(id),
      data
    )
    return updated
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(ENDPOINTS.MENU_PRODUCT_BY_ID(id))
  }

  async toggleStatus(id: string): Promise<Producto> {
    // El backend no tiene un endpoint dedicado de "toggle": se lee el estado
    // actual y se invierte con un PATCH normal.
    const { data: current } = await httpClient.get<Producto>(ENDPOINTS.MENU_PRODUCT_BY_ID(id))
    const { data: updated } = await httpClient.patch<Producto>(ENDPOINTS.MENU_PRODUCT_BY_ID(id), {
      disponible: !current.disponible,
    })
    return updated
  }

  async updateStock(id: string, newStock: number): Promise<Producto> {
    const { data } = await httpClient.patch<Producto>(ENDPOINTS.PRODUCT_STOCK(id), {
      stock: newStock,
    })
    return data
  }
}

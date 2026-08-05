import { httpClient } from '@/core/api/httpClient'
import { ENDPOINTS } from '@/core/api/endpoints'
import type { Pedido, EstadoPedido } from '@/shared/types'
import type { AdminOrdersService } from './adminOrdersService'

/**
 * Implementación real de AdminOrdersService contra la API de NestJS.
 * Estas llamadas requieren sesión de admin — el token viaja automático
 * vía el interceptor de httpClient.
 */
export class HttpAdminOrdersService implements AdminOrdersService {
  async listOrders(): Promise<Pedido[]> {
    const { data } = await httpClient.get<Pedido[]>(ENDPOINTS.ORDERS)
    return data
  }

  async updateOrderStatus(id: string, estado: EstadoPedido): Promise<Pedido> {
    const { data } = await httpClient.patch<Pedido>(ENDPOINTS.ORDER_STATUS(id), { estado })
    return data
  }

  async deleteOrder(id: string): Promise<void> {
    await httpClient.delete(ENDPOINTS.ORDER_BY_ID(id))
  }
}

import { getAdminProductService } from './adminProductService'
import { getAdminOrdersService } from './adminOrdersService'
import type { AdminService } from './adminService'
import type { DashboardStats } from '../types'

/**
 * Implementación real de AdminService. No existe un endpoint dedicado de
 * estadísticas en el backend (fuera de alcance de esta integración), así
 * que productosActivos/productosInactivos/pedidosPendientes se calculan
 * aquí a partir de los datos reales de /products y /orders.
 *
 * clientesFrecuentes y ventasDelDia quedan como valores de ejemplo (igual
 * que en el mock) hasta que exista un endpoint de analítica — no es una
 * funcionalidad de negocio nueva, solo no hay de dónde calcularlos todavía.
 */
export class HttpAdminService implements AdminService {
  async getDashboardStats(): Promise<DashboardStats> {
    const [productos, pedidos] = await Promise.all([
      getAdminProductService().getAll(),
      getAdminOrdersService().listOrders(),
    ])

    const productosActivos = productos.filter((p) => p.disponible).length
    const productosInactivos = productos.filter((p) => !p.disponible).length
    const pedidosPendientes = pedidos.filter((p) => p.estado !== 'entregado').length

    return {
      productosActivos,
      productosInactivos,
      pedidosPendientes,
      // TODO: sin endpoint de analítica en el backend todavía — placeholder.
      clientesFrecuentes: 0,
      ventasDelDia: 0,
    }
  }
}

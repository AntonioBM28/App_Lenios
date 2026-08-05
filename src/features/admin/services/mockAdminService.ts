import type { DashboardStats } from '../types'
import { PRODUCTOS } from '@/features/menu/services/mockMenuService'
import { getAdminOrdersService } from './adminOrdersService'
import type { Producto } from '@/shared/types'

export class MockAdminService {
  async getDashboardStats(): Promise<DashboardStats> {
    // Simular latencia de red
    await new Promise((resolve) => setTimeout(resolve, 300))

    const productosActivos = PRODUCTOS.filter((p: Producto) => p.disponible).length
    const productosInactivos = PRODUCTOS.filter((p: Producto) => !p.disponible).length
    
    // Conectar a adminOrdersService para contar pedidos no entregados
    const ordersService = getAdminOrdersService()
    const allOrders = await ordersService.listOrders()
    const pedidosPendientes = allOrders.filter(o => o.estado !== 'entregado').length

    // Mock data para ventas y clientes
    const clientesFrecuentes = 45
    const ventasDelDia = 4250.50

    return {
      productosActivos,
      productosInactivos,
      pedidosPendientes,
      clientesFrecuentes,
      ventasDelDia,
    }
  }
}

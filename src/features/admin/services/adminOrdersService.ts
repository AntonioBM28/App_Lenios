import type { Pedido, EstadoPedido } from '@/shared/types'
import { env } from '@/core/config/env'
import { HttpAdminOrdersService } from './httpAdminOrdersService'

const MOCK_ORDERS: Pedido[] = [
  {
    id: 'ord-1001',
    cliente: 'María Rodríguez',
    telefono: '5512345678',
    direccion: 'Av. Siempre Viva 742, Col. Centro',
    items: [
      { productoId: 'leno-001', nombre: 'Leño Sabor Salchicha', cantidad: 2, precioUnitario: 185 },
      { productoId: 'beb-001', nombre: 'Agua de Jamaica', cantidad: 2, precioUnitario: 45 }
    ],
    total: 460,
    estado: 'recibido',
    fecha: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // Hace 5 minutos
  },
  {
    id: 'ord-1002',
    cliente: 'Juan Pérez',
    telefono: '5598765432',
    direccion: 'Calle Luna 123, Col. Roma',
    items: [
      { productoId: 'leno-002', nombre: 'Leño de Carne Ahumada', cantidad: 1, precioUnitario: 210 },
      { productoId: 'leno-007', nombre: 'Leño Cuatro Quesos', cantidad: 1, precioUnitario: 190 }
    ],
    total: 400,
    estado: 'en_preparacion',
    fecha: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // Hace 25 minutos
  },
  {
    id: 'ord-1003',
    cliente: 'Ana Gómez',
    telefono: '5566778899',
    direccion: 'Paseo de la Reforma 222, Col. Juárez',
    items: [
      { productoId: 'leno-004', nombre: 'Leño BBQ Texas', cantidad: 3, precioUnitario: 225 }
    ],
    total: 675,
    estado: 'en_camino',
    fecha: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // Hace 45 minutos
  },
  {
    id: 'ord-1004',
    cliente: 'Carlos López',
    telefono: '5544332211',
    direccion: 'Calle Sol 45, Col. Condesa',
    items: [
      { productoId: 'leno-005', nombre: 'Leño Sabor Arrachera', cantidad: 1, precioUnitario: 240 },
      { productoId: 'beb-002', nombre: 'Agua de Horchata', cantidad: 1, precioUnitario: 45 }
    ],
    total: 285,
    estado: 'entregado',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // Hace 2 horas
  },
]

export interface AdminOrdersService {
  listOrders(): Promise<Pedido[]>
  updateOrderStatus(id: string, estado: EstadoPedido): Promise<Pedido>
  deleteOrder(id: string): Promise<void>
}

// Implementación en memoria/localStorage — disponible detrás de
// VITE_USE_MOCK_DATA=true para seguir desarrollando sin backend.
// Ya no es la implementación activa por defecto: ver getAdminOrdersService().
export class MockAdminOrdersService implements AdminOrdersService {
  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private getStored(): Pedido[] {
    const saved = localStorage.getItem('admin_orders_override')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Error parseando pedidos', e)
      }
    }

    // Seed inicial si está vacío
    localStorage.setItem('admin_orders_override', JSON.stringify(MOCK_ORDERS))
    return MOCK_ORDERS
  }

  private saveStored(orders: Pedido[]) {
    localStorage.setItem('admin_orders_override', JSON.stringify(orders))
  }

  async listOrders(): Promise<Pedido[]> {
    await this.delay(300)
    const orders = this.getStored()
    // Ordenar del más reciente al más antiguo
    return orders.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  }

  async updateOrderStatus(id: string, estado: EstadoPedido): Promise<Pedido> {
    await this.delay(100) // Rápido para RNF3
    const orders = this.getStored()
    const index = orders.findIndex(o => o.id === id)
    
    if (index === -1) throw new Error('Pedido no encontrado')
    
    orders[index].estado = estado
    this.saveStored(orders)
    
    return orders[index]
  }

  async deleteOrder(id: string): Promise<void> {
    await this.delay(200)
    const orders = this.getStored()
    this.saveStored(orders.filter(o => o.id !== id))
  }
}

let instance: AdminOrdersService | null = null

export function getAdminOrdersService(): AdminOrdersService {
  if (!instance) {
    instance = env.useMockData ? new MockAdminOrdersService() : new HttpAdminOrdersService()
  }
  return instance
}

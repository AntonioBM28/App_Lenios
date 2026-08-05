import type { Producto } from '@/shared/types'
import { PRODUCTOS } from '@/features/menu/services/mockMenuService'
import { env } from '@/core/config/env'
import { HttpAdminProductService } from './httpAdminProductService'

export interface AdminProductService {
  getAll(): Promise<Producto[]>
  create(data: Omit<Producto, 'id'>): Promise<Producto>
  update(id: string, data: Partial<Producto>): Promise<Producto>
  delete(id: string): Promise<void>
  toggleStatus(id: string): Promise<Producto>
  updateStock(id: string, newStock: number): Promise<Producto>
}

// Implementación en memoria/localStorage — disponible detrás de
// VITE_USE_MOCK_DATA=true para seguir desarrollando sin backend.
// Ya no es la implementación activa por defecto: ver getAdminProductService().
export class MockAdminProductService implements AdminProductService {
  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private getStored(): Producto[] {
    const saved = localStorage.getItem('lenios-products')
    if (saved) return JSON.parse(saved)
    
    // Initialize if empty
    localStorage.setItem('lenios-products', JSON.stringify(PRODUCTOS))
    return PRODUCTOS
  }

  private saveStored(products: Producto[]) {
    localStorage.setItem('lenios-products', JSON.stringify(products))
  }

  async getAll(): Promise<Producto[]> {
    await this.delay(200)
    return this.getStored()
  }

  async create(data: Omit<Producto, 'id'>): Promise<Producto> {
    await this.delay(300)
    const products = this.getStored()
    
    const nuevoProducto: Producto = {
      ...data,
      id: `leno-${Date.now()}`,
    }
    
    this.saveStored([...products, nuevoProducto])
    return nuevoProducto
  }

  async update(id: string, data: Partial<Producto>): Promise<Producto> {
    await this.delay(300)
    const products = this.getStored()
    const index = products.findIndex(p => p.id === id)
    
    if (index === -1) throw new Error('Producto no encontrado')
    
    const updated = { ...products[index], ...data }
    products[index] = updated
    this.saveStored(products)
    
    return updated
  }

  async delete(id: string): Promise<void> {
    await this.delay(200)
    const products = this.getStored()
    this.saveStored(products.filter(p => p.id !== id))
  }

  async toggleStatus(id: string): Promise<Producto> {
    await this.delay(200)
    const products = this.getStored()
    const index = products.findIndex(p => p.id === id)
    
    if (index === -1) throw new Error('Producto no encontrado')
    
    products[index].disponible = !products[index].disponible
    this.saveStored(products)
    
    return products[index]
  }

  // TODO(RF10-backend): PATCH /products/:id/stock
  async updateStock(id: string, newStock: number): Promise<Producto> {
    // delay menor para que se sienta más rápido (optimización RNF3)
    await this.delay(50) 
    const products = this.getStored()
    const index = products.findIndex(p => p.id === id)
    
    if (index === -1) throw new Error('Producto no encontrado')
    
    const product = products[index]
    product.stock = Math.max(0, newStock) // evitar negativos por seguridad
    
    // Regla automática de disponibilidad
    product.disponible = product.stock > 0
    
    this.saveStored(products)
    
    return product
  }
}

// Singleton factory
let instance: AdminProductService | null = null

export function getAdminProductService(): AdminProductService {
  if (!instance) {
    instance = env.useMockData ? new MockAdminProductService() : new HttpAdminProductService()
  }
  return instance
}

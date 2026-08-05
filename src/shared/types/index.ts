// ─── Shared domain types ──────────────────────────────────────────

/** Una categoría de productos (Clásicos, Especiales, Bebidas…) */
export interface Categoria {
  id: string
  nombre: string
  descripcion?: string
}

export type EstadoPedido = 'recibido' | 'en_preparacion' | 'en_camino' | 'entregado'

export interface PedidoItem {
  productoId: string
  nombre: string
  cantidad: number
  precioUnitario: number
}

export interface Pedido {
  id: string
  cliente: string
  telefono: string
  direccion: string
  items: PedidoItem[]
  total: number
  estado: EstadoPedido
  fecha: string // ISO date
}

/**
 * Un producto del menú tal como lo expone la API de NestJS.
 * RF5 (disponibilidad/stock) usará `disponible` y `stock` en el futuro;
 * por ahora se incluyen en el tipo pero NO se usan en UI todavía.
 */
export interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number        // en pesos MXN
  imagenUrl: string
  categoriaId: string
  disponible: boolean   // reservado para RF5 — no renderizar lógica de UI aún
  stock: number         // reservado para RF5 — no renderizar lógica de UI aún
  destacado?: boolean   // marca los que aparecen en "Sabores Destacados" del Home
}

/** A single item inside the cart (used by the Zustand cart store) */
export interface CartItem {
  productId: string
  nombre: string
  precio: number
  imagenUrl: string
  cantidad: number
}

/** Generic paginated API response wrapper */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

/** Generic API error shape from the NestJS backend */
export interface ApiError {
  statusCode: number
  message: string | string[]
  error: string
}


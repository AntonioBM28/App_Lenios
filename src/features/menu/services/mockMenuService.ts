import type { Producto, Categoria } from '@/shared/types'
import type { MenuService } from '../types'

// ─── Categorías ─────────────────────────────────────────────────────────────
const CATEGORIAS: Categoria[] = [
  { id: 'clasicos',   nombre: 'Clásicos',   descripcion: 'Los favoritos de siempre' },
  { id: 'especiales', nombre: 'Especiales', descripcion: 'Sabores únicos de temporada' },
  { id: 'bebidas',    nombre: 'Bebidas',    descripcion: 'Para acompañar tu leño' },
]

// ─── Productos mock  ─────────────────────────────────────────────────────────
// Precios en MXN | imagenUrl usa placehold.co con el nombre del producto
export const PRODUCTOS: Producto[] = [
  {
    id: 'leno-001',
    nombre: 'Leño Sabor Salchicha',
    descripcion: 'Jugosa salchicha artesanal con queso oaxaca, jalapeños y mostaza dijon.',
    precio: 185,
    imagenUrl: 'https://placehold.co/400x300/1C110A/F97316?text=Salchicha',
    categoriaId: 'clasicos',
    disponible: true,
    stock: 20,
    destacado: true,
  },
  {
    id: 'leno-002',
    nombre: 'Leño de Carne Ahumada',
    descripcion: 'Carne de res ahumada a fuego lento, pimientos asados y queso manchego.',
    precio: 210,
    imagenUrl: 'https://placehold.co/400x300/1C110A/F97316?text=Carne+Ahumada',
    categoriaId: 'clasicos',
    disponible: true,
    stock: 15,
    destacado: true,
  },
  {
    id: 'leno-003',
    nombre: 'Leño de Pollo al Pesto',
    descripcion: 'Pechuga de pollo marinada en pesto de albahaca fresca con queso de cabra.',
    precio: 195,
    imagenUrl: 'https://placehold.co/400x300/1C110A/F97316?text=Pollo+al+Pesto',
    categoriaId: 'clasicos',
    disponible: true,
    stock: 2,
    destacado: false,
  },
  {
    id: 'leno-004',
    nombre: 'Leño BBQ Texas',
    descripcion: 'Costilla de cerdo desmechada estilo Texas con salsa BBQ artesanal y cebolla caramelizada.',
    precio: 225,
    imagenUrl: 'https://placehold.co/400x300/1C110A/F97316?text=BBQ+Texas',
    categoriaId: 'especiales',
    disponible: false,
    stock: 0,
    destacado: true,
  },
  {
    id: 'leno-005',
    nombre: 'Leño Sabor Arrachera',
    descripcion: 'Arrachera marinada al chipotle con guacamole fresco y pico de gallo.',
    precio: 240,
    imagenUrl: 'https://placehold.co/400x300/1C110A/F97316?text=Arrachera',
    categoriaId: 'especiales',
    disponible: true,
    stock: 8,
    destacado: true,
  },
  {
    id: 'leno-006',
    nombre: 'Leño Sabor Pollo',
    descripcion: 'Pollo deshebrado estilo mexicano con crema, queso fresco y epazote.',
    precio: 180,
    imagenUrl: 'https://placehold.co/400x300/1C110A/F97316?text=Pollo',
    categoriaId: 'clasicos',
    disponible: true,
    stock: 18,
    destacado: false,
  },
  {
    id: 'leno-007',
    nombre: 'Leño Cuatro Quesos',
    descripcion: 'Fusión de queso oaxaca, manchego, gouda ahumado y brie con hierbas finas.',
    precio: 190,
    imagenUrl: 'https://placehold.co/400x300/1C110A/F97316?text=Cuatro+Quesos',
    categoriaId: 'especiales',
    disponible: true,
    stock: 14,
    destacado: false,
  },
  {
    id: 'beb-001',
    nombre: 'Agua de Jamaica',
    descripcion: 'Agua fresca de flor de jamaica con canela y poca azúcar.',
    precio: 45,
    imagenUrl: 'https://placehold.co/400x300/1C110A/EA580C?text=Jamaica',
    categoriaId: 'bebidas',
    disponible: true,
    stock: 30,
    destacado: false,
  },
  {
    id: 'beb-002',
    nombre: 'Agua de Horchata',
    descripcion: 'Horchata artesanal de arroz con canela y vainilla natural.',
    precio: 45,
    imagenUrl: 'https://placehold.co/400x300/1C110A/D9B382?text=Horchata',
    categoriaId: 'bebidas',
    disponible: false,
    stock: 0,
    destacado: false,
  },
]

/**
 * MockMenuService — implementación en memoria.
 * Simula una carga mínima (100 ms) para mostrar skeletons sin bloquear.
 *
 * Para conectar el backend real, crea HttpMenuService que implemente
 * MenuService y usa httpClient de core/api. Luego actualiza el factory
 * en menuServiceFactory.ts — sin tocar ningún componente ni hook.
 */
export class MockMenuService implements MenuService {
  async getProductos(): Promise<Producto[]> {
    await delay(300)
    
    // Unificar fuente de datos con Admin mediante localStorage
    const saved = localStorage.getItem('lenios-products')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Error parseando productos de localStorage', e)
      }
    }
    
    // Inicializar si no hay nada guardado
    localStorage.setItem('lenios-products', JSON.stringify(PRODUCTOS))
    return PRODUCTOS
  }

  async getCategorias(): Promise<Categoria[]> {
    await delay(150)
    return CATEGORIAS
  }
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

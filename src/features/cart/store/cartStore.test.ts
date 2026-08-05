import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from './cartStore'
import type { Producto } from '@/shared/types'

function makeProducto(overrides: Partial<Producto> = {}): Producto {
  return {
    id: 'prod-1',
    nombre: 'Leño Relleno de Queso',
    descripcion: 'Delicioso',
    precio: 90,
    imagenUrl: '/img.jpg',
    categoriaId: 'cat-1',
    disponible: true,
    stock: 10,
    ...overrides,
  }
}

describe('useCartStore', () => {
  beforeEach(() => {
    // El store persiste en localStorage (jsdom) entre tests; lo limpiamos.
    useCartStore.getState().clear()
  })

  it('empieza vacío', () => {
    expect(useCartStore.getState().items).toHaveLength(0)
    expect(useCartStore.getState().total).toBe(0)
  })

  it('addItem agrega un producto nuevo con la cantidad indicada', () => {
    useCartStore.getState().addItem(makeProducto(), 2)

    const { items, total } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({ productId: 'prod-1', cantidad: 2 })
    expect(total).toBe(180)
  })

  it('addItem sobre un producto ya en el carrito suma la cantidad (no duplica la línea)', () => {
    useCartStore.getState().addItem(makeProducto(), 1)
    useCartStore.getState().addItem(makeProducto(), 2)

    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].cantidad).toBe(3)
  })

  it('addItem ignora productos no disponibles', () => {
    useCartStore.getState().addItem(makeProducto({ disponible: false }))

    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('removeItem quita el producto del carrito', () => {
    useCartStore.getState().addItem(makeProducto())
    useCartStore.getState().removeItem('prod-1')

    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('updateQuantity actualiza la cantidad de una línea existente', () => {
    useCartStore.getState().addItem(makeProducto(), 1)
    useCartStore.getState().updateQuantity('prod-1', 5)

    expect(useCartStore.getState().items[0].cantidad).toBe(5)
  })

  it('updateQuantity con cantidad <= 0 elimina la línea', () => {
    useCartStore.getState().addItem(makeProducto(), 1)
    useCartStore.getState().updateQuantity('prod-1', 0)

    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('getItemCount suma las cantidades de todas las líneas', () => {
    useCartStore.getState().addItem(makeProducto({ id: 'prod-1' }), 2)
    useCartStore.getState().addItem(makeProducto({ id: 'prod-2' }), 3)

    expect(useCartStore.getState().getItemCount()).toBe(5)
  })
})

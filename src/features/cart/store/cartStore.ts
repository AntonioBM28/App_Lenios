import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, Producto } from '@/shared/types'
import type { CartState } from '../types'

/**
 * Sums the price of every line in the cart.
 *
 * NOTE: `total` is intentionally recomputed and returned as a plain value
 * inside every `set()` call below, instead of being a `get total()`
 * accessor on the state object. Zustand's default `setState` merges the
 * next partial state with `Object.assign({}, state, partial)`, which reads
 * (and freezes) accessor properties into plain values at merge time — a
 * `get total()` getter would get "snapshotted" using the state *before*
 * the current update, so the UI total would always lag one action behind.
 * Computing it explicitly here keeps it correct and atomic with `items`.
 */
function computeTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
}

/**
 * Cart store powered by Zustand with localStorage persistence.
 *
 * The cart survives page reloads automatically via the `persist` middleware.
 * Storage key: "lenios-cart" in localStorage.
 *
 * Usage:
 *   const { items, addItem, removeItem, total, getItemCount } = useCartStore()
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem(producto: Producto, cantidad: number = 1) {
        if (!producto.disponible) {
          console.warn(`Intento de agregar producto no disponible: ${producto.id}`)
          return
        }

        set((state) => {
          const existing = state.items.find((i) => i.productId === producto.id)
          const items = existing
            ? state.items.map((i) =>
                i.productId === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i
              )
            : [
                ...state.items,
                {
                  productId: producto.id,
                  nombre: producto.nombre,
                  precio: producto.precio,
                  imagenUrl: producto.imagenUrl,
                  cantidad,
                },
              ]
          return { items, total: computeTotal(items) }
        })
      },

      removeItem(productId: string) {
        set((state) => {
          const items = state.items.filter((i) => i.productId !== productId)
          return { items, total: computeTotal(items) }
        })
      },

      updateQuantity(productId: string, cantidad: number) {
        if (cantidad <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => {
          const items = state.items.map((i) =>
            i.productId === productId ? { ...i, cantidad } : i
          )
          return { items, total: computeTotal(items) }
        })
      },

      clear() {
        set({ items: [], total: 0 })
      },

      getItemCount() {
        return get().items.reduce((acc, item) => acc + item.cantidad, 0)
      },
    }),
    {
      name: 'lenios-cart',           // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Persist items + total together so a reload shows the correct total
      // immediately, without waiting for the next mutation to recompute it.
      partialize: (state) => ({ items: state.items, total: state.total }),
    }
  )
)

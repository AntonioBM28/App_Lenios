import type { CartItem, Producto } from '@/shared/types'

/** Shape of the cart store */
export interface CartState {
  items: CartItem[]

  /** Computed total price of all items */
  total: number

  /**
   * Add a product to the cart. If already present, increases its quantity.
   * Optionally accepts a specific quantity to add.
   */
  addItem: (producto: Producto, cantidad?: number) => void

  /** Remove a product completely from the cart */
  removeItem: (productId: string) => void

  /** Set a specific quantity for a product (removes item if quantity ≤ 0) */
  updateQuantity: (productId: string, cantidad: number) => void

  /** Empty the cart */
  clear: () => void

  /** Get total number of items in the cart */
  getItemCount: () => number
}

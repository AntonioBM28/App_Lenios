import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import type { CartItem } from '@/shared/types'
import { formatCurrency } from '@/shared/utils'
import { QuantityStepper } from './QuantityStepper'

interface CartItemRowProps {
  item: CartItem
  onUpdateQuantity: (productId: string, cantidad: number) => void
  onRemove: (productId: string) => void
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-card bg-dark-card border border-dark-border">
      {/* Imagen */}
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-dark-bg flex-shrink-0 relative border border-dark-border/50">
        <img
          src={item.imagenUrl}
          alt={`Foto miniatura de ${item.nombre}`}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white truncate">{item.nombre}</p>
        <p className="text-sm text-primary font-medium mt-0.5">
          {formatCurrency(item.precio)}
        </p>
      </div>

      {/* Controles de cantidad */}
      <div className="flex-shrink-0">
        <QuantityStepper
          quantity={item.cantidad}
          onDecrease={() => onUpdateQuantity(item.productId, item.cantidad - 1)}
          onIncrease={() => onUpdateQuantity(item.productId, item.cantidad + 1)}
        />
      </div>

      {/* Subtotal del item (oculto en mobile) */}
      <p className="text-white font-semibold w-24 text-right hidden sm:block">
        {formatCurrency(item.precio * item.cantidad)}
      </p>

      {/* Botón eliminar */}
      <button
        onClick={() => {
          onRemove(item.productId)
          toast(`${item.nombre} eliminado`, { icon: '🗑️' })
        }}
        className="p-2 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        aria-label={`Eliminar ${item.nombre}`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

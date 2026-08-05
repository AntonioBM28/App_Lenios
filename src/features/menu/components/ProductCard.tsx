import { ShoppingCart, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Producto } from '@/shared/types'
import { formatCurrency, truncate } from '@/shared/utils'
import { useCartStore } from '@/features/cart/store/cartStore'
import { QuantityStepper } from '@/features/cart/components/QuantityStepper'

interface ProductCardProps {
  producto: Producto
  /**
   * Razón (generada por IA) por la que este producto coincidió con una
   * búsqueda del buscador inteligente del menú. Si viene, se muestra como
   * badge sobre la imagen — ver features/ai/components/SmartSearchBar.
   */
  aiReason?: string
}

/**
 * Tarjeta visual de un producto del menú.
 * Conectado directamente a useCartStore para manejar su propio estado
 * de "Agregado" y permitir modificar la cantidad inline.
 */
export function ProductCard({ producto, aiReason }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCartStore()

  // Buscar si el producto ya está en el carrito
  const cartItem = items.find((i) => i.productId === producto.id)
  const inCart = !!cartItem

  const handleAgregar = () => {
    addItem(producto)
    toast.success(`${producto.nombre} agregado al carrito`)
  }

  return (
    <article className="group flex flex-col bg-dark-card border border-dark-border rounded-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-wood hover:shadow-glow-card">
      {/* Imagen */}
      <div className="relative overflow-hidden bg-dark-bg aspect-[4/3]">
        {!producto.disponible ? (
          <span className="absolute top-3 right-3 bg-red-950/90 text-red-200 text-xs font-bold px-2.5 py-1 rounded-full z-10 backdrop-blur-sm border border-red-500/20 shadow-sm">
            Agotado
          </span>
        ) : producto.stock <= 3 ? (
          <span className="absolute top-3 right-3 bg-primary/90 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 backdrop-blur-sm border border-orange-300/30 shadow-sm">
            ¡Últimas piezas!
          </span>
        ) : null}

        <img
          src={producto.imagenUrl}
          alt={`Foto de ${producto.nombre}`}
          loading="lazy"
          className={[
            'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105',
            !producto.disponible ? 'grayscale opacity-60' : ''
          ].join(' ')}
          onError={(e) => {
            const img = e.currentTarget
            img.src = `https://placehold.co/400x300/1C110A/F97316?text=${encodeURIComponent(producto.nombre)}`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {aiReason && (
          <span className="inline-flex items-center gap-1.5 self-start bg-primary/15 border border-primary/30 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
            <Sparkles size={12} className="shrink-0" />
            {aiReason}
          </span>
        )}
        <h3 className="font-heading font-semibold text-white text-base leading-tight">
          {producto.nombre}
        </h3>
        <p className="text-beige/60 text-sm leading-relaxed flex-1">
          {truncate(producto.descripcion, 90)}
        </p>

        {/* Precio + Acciones */}
        <div className="flex items-center justify-between gap-2 pt-2 mt-auto border-t border-dark-border min-h-[44px]">
          <span className={[
            'font-heading font-bold text-lg',
            !producto.disponible ? 'text-beige/40' : 'text-primary'
          ].join(' ')}>
            {formatCurrency(producto.precio)}
          </span>

          {!producto.disponible ? (
            <span className="text-xs font-medium text-red-400/80 px-2 py-1.5 bg-red-500/10 rounded-md">
              No disponible
            </span>
          ) : inCart ? (
            <QuantityStepper
              quantity={cartItem.cantidad}
              onDecrease={() => updateQuantity(producto.id, cartItem.cantidad - 1)}
              onIncrease={() => updateQuantity(producto.id, cartItem.cantidad + 1)}
            />
          ) : (
            <button
              onClick={handleAgregar}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-card w-24 justify-center bg-primary hover:bg-secondary text-white hover:shadow-glow-primary active:scale-95"
              aria-label={`Agregar ${producto.nombre} al carrito`}
            >
              <ShoppingCart size={15} />
              Agregar
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

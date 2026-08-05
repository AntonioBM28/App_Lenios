import { useCartStore } from '@/features/cart/store/cartStore'
import { Trash2, CheckCircle2, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { EmptyState } from '@/features/menu/components/FeedbackStates'
import { Button } from '@/shared/components/Button'
import { CartItemRow } from '../components/CartItemRow'
import { CartSummary } from '../components/CartSummary'
import { DeliveryForm } from '../components/DeliveryForm'
import { useCheckout } from '../hooks/useCheckout'
import { ClosedBanner } from '@/features/business-hours/components/ClosedBanner'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clear, total, getItemCount } = useCartStore()
  const { status, submitOrder } = useCheckout()
  
  const hasItems = items.length > 0
  const count = getItemCount()

  if (!hasItems) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <EmptyState
          mensaje="Tu carrito está vacío"
          submensaje="Agrega productos desde nuestro menú para verlos aquí y continuar con tu pedido."
        />
        <div className="flex justify-center mt-6">
          <Link to="/menu">
            <Button variant="primary" size="lg">Ir al Menú</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Pantalla de éxito opcional (se muestra muy brevemente antes de redirigir, 
  // o se queda si el usuario regresa después de que se limpió el carrito)
  if (status === 'success') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-32 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="font-heading text-4xl font-bold text-white mb-4">
          ¡Pedido listo!
        </h1>
        <p className="text-beige/70 text-lg mb-8 max-w-md">
          Serás redirigido a WhatsApp para finalizar y enviar tu pedido a nuestro equipo.
        </p>
        <Link to="/menu">
          <Button variant="outline" size="lg">Volver al Menú</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <ClosedBanner />
      
      <div className="mb-6">
        <Link to="/menu" className="inline-flex items-center gap-2 text-beige hover:text-primary transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Volver al menú
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white mb-2">
            Tu <span className="text-primary">Carrito</span>
          </h1>
          <p className="text-beige/60 text-sm">
            Tienes {count} {count === 1 ? 'producto' : 'productos'} en tu orden
          </p>
        </div>
        <button
          onClick={() => {
            clear()
            toast('Carrito vaciado', { icon: '🧹' })
          }}
          className="text-sm text-red-400/70 hover:text-red-400 flex items-center gap-1.5 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-md p-1"
        >
          <Trash2 size={16} className="group-hover:scale-110 transition-transform" /> 
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna principal: Formulario y Productos */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          <DeliveryForm 
            onSubmit={submitOrder} 
            disabled={status === 'processing'} 
          />

          <div className="flex flex-col gap-3">
            <h2 className="font-heading font-semibold text-white text-lg mb-2">
              Productos seleccionados
            </h2>
            {items.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
        </div>

        {/* Resumen lateral */}
        <div className="lg:col-span-4">
          <CartSummary total={total} status={status} />
        </div>
      </div>
    </div>
  )
}

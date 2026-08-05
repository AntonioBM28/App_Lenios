import { Button } from '@/shared/components/Button'
import { formatCurrency } from '@/shared/utils'
import type { CheckoutState } from '../hooks/useCheckout'
import { Loader2 } from 'lucide-react'

interface CartSummaryProps {
  total: number
  status: CheckoutState
}

export function CartSummary({ total, status }: CartSummaryProps) {
  const isProcessing = status === 'processing'
  const isSuccess = status === 'success'

  return (
    <div className="rounded-card bg-dark-card border border-dark-border p-6 sticky top-24 flex flex-col">
      <h2 className="font-heading font-semibold text-white text-lg mb-6 pb-4 border-b border-dark-border">
        Resumen de pedido
      </h2>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-beige/70">Subtotal</span>
        <span className="text-white font-medium">{formatCurrency(total)}</span>
      </div>
      
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-dark-border">
        <span className="text-beige/70">Envío</span>
        <span className="text-white">Gratis</span>
      </div>
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="font-heading text-lg font-bold text-white block">Total</span>
          <span className="text-xs text-beige/50">(Impuestos incluidos)</span>
        </div>
        <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
      </div>
      
      <Button
        type="submit"
        form="delivery-form"
        variant="primary"
        size="lg"
        fullWidth
        disabled={isProcessing || isSuccess}
        className={isSuccess ? '!bg-emerald-500 !shadow-none' : ''}
      >
        {isProcessing && <Loader2 size={18} className="animate-spin" />}
        {isSuccess ? '¡Redirigiendo a WhatsApp!' : 'Confirmar pedido'}
      </Button>
      
      <p className="text-center text-xs text-beige/50 mt-4 leading-relaxed">
        Al confirmar, serás redirigido a WhatsApp para enviar los detalles de tu pedido.
      </p>
    </div>
  )
}


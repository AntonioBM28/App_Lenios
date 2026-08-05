import { Minus, Plus } from 'lucide-react'

interface QuantityStepperProps {
  quantity: number
  onDecrease: () => void
  onIncrease: () => void
  min?: number
  max?: number
  className?: string
}

export function QuantityStepper({
  quantity,
  onDecrease,
  onIncrease,
  min = 0,
  max = 99,
  className = '',
}: QuantityStepperProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={(e) => {
          e.preventDefault()
          if (quantity > min) onDecrease()
        }}
        disabled={quantity <= min}
        className="w-8 h-8 rounded-lg bg-dark-border hover:bg-wood flex items-center justify-center text-beige transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Reducir cantidad"
      >
        <Minus size={14} />
      </button>
      <span className="w-6 text-center text-white font-semibold text-sm">
        {quantity}
      </span>
      <button
        onClick={(e) => {
          e.preventDefault()
          if (quantity < max) onIncrease()
        }}
        disabled={quantity >= max}
        className="w-8 h-8 rounded-lg bg-dark-border hover:bg-primary flex items-center justify-center text-beige transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Aumentar cantidad"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}

import { AlertCircle } from 'lucide-react'
import { useBusinessStatus } from '../hooks/useBusinessStatus'

export function ClosedBanner() {
  const { abierto, cargando } = useBusinessStatus()

  if (cargando || abierto) return null

  return (
    <div className="bg-dark-card border-y sm:border sm:rounded-card border-orange-500/20 p-4 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="p-2 bg-orange-500/10 text-primary rounded-full shrink-0">
          <AlertCircle size={20} />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">
            Estamos cerrados en este momento
          </h3>
          <p className="text-beige/70 text-sm mt-0.5 leading-relaxed">
            Puedes armar tu pedido con normalidad y enviárnoslo por WhatsApp; lo confirmaremos y prepararemos apenas abramos.
          </p>
        </div>
      </div>
    </div>
  )
}

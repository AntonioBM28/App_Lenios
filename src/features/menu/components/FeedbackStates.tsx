import { UtensilsCrossed, AlertTriangle, RefreshCw } from 'lucide-react'

interface EmptyStateProps {
  mensaje?: string
  submensaje?: string
}

/** Mostrado cuando no hay productos para la categoría seleccionada */
export function EmptyState({
  mensaje = 'Sin productos',
  submensaje = 'No encontramos productos en esta categoría.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-dark-card border border-dark-border flex items-center justify-center">
        <UtensilsCrossed size={28} className="text-beige/30" strokeWidth={1.5} />
      </div>
      <p className="font-heading font-semibold text-white text-lg">{mensaje}</p>
      <p className="text-beige/50 text-sm max-w-xs">{submensaje}</p>
    </div>
  )
}

interface ErrorStateProps {
  mensaje?: string
  onRetry?: () => void
}

/** Mostrado cuando falla la carga de datos */
export function ErrorState({
  mensaje = 'Ocurrió un error al cargar el menú.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <AlertTriangle size={28} className="text-red-400" strokeWidth={1.5} />
      </div>
      <p className="font-heading font-semibold text-white text-lg">Algo salió mal</p>
      <p className="text-beige/50 text-sm max-w-xs">{mensaje}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 flex items-center gap-2 px-4 py-2 rounded-btn border border-dark-border text-beige/70 hover:text-white hover:border-wood text-sm transition-colors"
        >
          <RefreshCw size={14} />
          Reintentar
        </button>
      )}
    </div>
  )
}

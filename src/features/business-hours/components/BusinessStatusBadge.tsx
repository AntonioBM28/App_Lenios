import { useBusinessStatus } from '../hooks/useBusinessStatus'

interface BusinessStatusBadgeProps {
  overrideStatus?: boolean
}

export function BusinessStatusBadge({ overrideStatus }: BusinessStatusBadgeProps = {}) {
  const { abierto, cargando } = useBusinessStatus()

  const isActuallyOpen = overrideStatus !== undefined ? overrideStatus : abierto

  if (cargando && overrideStatus === undefined) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-bg border border-dark-border animate-pulse">
        <div className="w-2 h-2 rounded-full bg-beige/20"></div>
        <span className="text-xs font-medium text-beige/50">Calculando...</span>
      </div>
    )
  }

  return (
    <div
      className={[
        'flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm transition-colors',
        isActuallyOpen
          ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400'
          : 'bg-dark-bg border-dark-border text-beige/60'
      ].join(' ')}
    >
      <div
        className={[
          'w-2 h-2 rounded-full',
          isActuallyOpen ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-beige/40'
        ].join(' ')}
      ></div>
      <span className="text-xs font-semibold tracking-wide uppercase">
        {isActuallyOpen ? 'Abierto ahora' : 'Cerrado ahora'}
      </span>
    </div>
  )
}

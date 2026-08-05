import { useEffect } from 'react'
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { AlertTriangle, RefreshCw } from 'lucide-react'

const CHUNK_RELOAD_FLAG = 'lenios-chunk-reload-attempted'

function isChunkLoadError(message: string): boolean {
  return /failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed/i.test(
    message
  )
}

/**
 * errorElement del router (React Router data router).
 *
 * Los routes de este proyecto se cargan con `lazy()` (code splitting). Si el
 * usuario deja una pestaña abierta y mientras tanto se publica un nuevo
 * deploy, Vite genera archivos con hashes nuevos (ej. HomePage-abc123.js →
 * HomePage-def456.js) y el chunk viejo referenciado por esa pestaña deja de
 * existir — el navegador lanza "Failed to fetch dynamically imported
 * module". React Router, al no tener un errorElement propio, mostraba su
 * pantalla genérica de "Unexpected Application Error!".
 *
 * Aquí detectamos ese caso específico y recargamos la página UNA sola vez
 * (con una bandera en sessionStorage para no entrar en loop si el error
 * persiste) — un reload trae el index.html fresco con las referencias
 * correctas. Para cualquier otro error, mostramos una pantalla de error
 * consistente con GlobalErrorBoundary, con botón de recarga manual.
 */
export function RouteErrorBoundary() {
  const error = useRouteError()

  const message = isRouteErrorResponse(error)
    ? error.statusText || `Error ${error.status}`
    : error instanceof Error
      ? error.message
      : String(error)

  useEffect(() => {
    if (!isChunkLoadError(message)) return

    const alreadyAttempted = sessionStorage.getItem(CHUNK_RELOAD_FLAG)
    if (!alreadyAttempted) {
      sessionStorage.setItem(CHUNK_RELOAD_FLAG, '1')
      window.location.reload()
    }
  }, [message])

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-dark-card border border-dark-border rounded-card p-8 text-center shadow-2xl flex flex-col items-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="text-red-400" size={32} />
        </div>
        <h1 className="font-heading text-2xl font-bold text-white mb-3">
          Oops, algo salió mal
        </h1>
        <p className="text-beige/70 mb-8 text-sm">
          Tuvimos un problema inesperado cargando esta página. Por favor, intenta recargar.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-secondary text-white font-semibold rounded-btn transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-card w-full justify-center"
        >
          <RefreshCw size={18} />
          Recargar página
        </button>
      </div>
    </div>
  )
}

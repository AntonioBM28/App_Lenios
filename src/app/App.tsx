import { AppRouter } from './router'
import { GlobalErrorBoundary } from './GlobalErrorBoundary'
import { Toaster } from 'react-hot-toast'

// Si un boot anterior de esta pestaña disparó el auto-reload de
// RouteErrorBoundary por un chunk viejo, limpiamos la bandera aquí: llegar
// hasta este punto significa que el app ya cargó bien con el bundle actual,
// así que un futuro deploy real puede volver a disparar el auto-reload.
sessionStorage.removeItem('lenios-chunk-reload-attempted')

/**
 * App shell — mounts the router and any global providers.
 * Additional providers (React Query, Toasts, etc.) will wrap AppRouter here.
 */
export default function App() {
  return (
    <GlobalErrorBoundary>
      <AppRouter />
      {/*
       * Toaster global de react-hot-toast.
       * — position="top-center": visible sin tapar contenido de las cards.
       * — containerStyle con z-index 9999: siempre por encima de cualquier
       *   modal, card, navbar u overlay de la app.
       * — duration 5000 ms: tiempo suficiente para leer el mensaje sin
       *   bloquear la interacción; el usuario puede cerrarlo antes.
       * — Estilos coherentes con la paleta café/naranja oscura de la app.
       */}
      <Toaster
        position="top-center"
        containerStyle={{ zIndex: 9999 }}
        gutter={12}
        toastOptions={{
          duration: 5000,
          style: {
            background: 'var(--color-dark-card, #1C110A)',
            color: 'var(--color-beige, #E8D5B7)',
            border: '1px solid var(--color-dark-border, #3D2B1F)',
            borderRadius: '0.5rem',
            padding: '12px 16px',
            fontSize: '0.9rem',
            maxWidth: '420px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-primary, #F97316)',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#fff',
            },
            style: {
              background: 'var(--color-dark-card, #1C110A)',
              color: '#fca5a5',
              border: '1px solid rgba(248, 113, 113, 0.35)',
              borderRadius: '0.5rem',
              padding: '12px 16px',
              fontSize: '0.9rem',
              maxWidth: '420px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            },
          },
        }}
      />
    </GlobalErrorBoundary>
  )
}

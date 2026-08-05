import { AppRouter } from './router'
import { GlobalErrorBoundary } from './GlobalErrorBoundary'
import { Toaster } from 'react-hot-toast'

/**
 * App shell — mounts the router and any global providers.
 * Additional providers (React Query, Toasts, etc.) will wrap AppRouter here.
 */
export default function App() {
  return (
    <GlobalErrorBoundary>
      <AppRouter />
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'var(--color-dark-card)',
            color: 'var(--color-beige)',
            border: '1px solid var(--color-dark-border)',
          },
          success: {
            iconTheme: { primary: 'var(--color-primary)', secondary: 'var(--color-white)' },
          },
        }}
      />
    </GlobalErrorBoundary>
  )
}

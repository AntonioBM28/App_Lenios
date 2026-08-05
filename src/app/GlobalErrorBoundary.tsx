import React, { Component } from 'react'
import type { ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
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
              Tuvimos un problema inesperado. Por favor, intenta recargar la página.
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

    return this.props.children
  }
}

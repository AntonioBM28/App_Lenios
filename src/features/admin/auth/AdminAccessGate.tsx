import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Flame, Lock, Loader2 } from 'lucide-react'
import { httpClient } from '@/core/api/httpClient'
import { ENDPOINTS } from '@/core/api/endpoints'
import { getAdminToken, setAdminToken, hasAdminToken } from '@/core/auth/adminSession'

interface AdminAccessGateProps {
  children: ReactNode
}

interface LoginResponse {
  token: string
  expiresIn: string
}

/**
 * Guarda el acceso al panel administrativo usando un PIN simple validado
 * en el servidor (POST /auth/admin/login). El PIN nunca se compara en el
 * cliente — solo se guarda el token de sesión corto que devuelve el backend.
 */
export function AdminAccessGate({ children }: AdminAccessGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Checar si ya hay una sesión (token) al montar
  useEffect(() => {
    setIsAuthenticated(hasAdminToken())
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data } = await httpClient.post<LoginResponse>(ENDPOINTS.ADMIN_LOGIN, { code: pin })
      setAdminToken(data.token)
      setIsAuthenticated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código incorrecto')
      setPin('')
    } finally {
      setLoading(false)
    }
  }

  // Aún evaluando la sesión
  if (isAuthenticated === null) return null

  // Si está autenticado, dejar pasar
  if (isAuthenticated && getAdminToken()) {
    return <>{children}</>
  }

  // Pantalla de acceso
  return (
    <div className="min-h-screen bg-[#0F0A06] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-dark-card border border-dark-border rounded-card p-8 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center transform rotate-12">
            <Flame className="text-white" size={28} />
          </div>
        </div>

        <h1 className="font-heading text-2xl font-bold text-white text-center mb-2">
          Acceso Restringido
        </h1>
        <p className="text-beige/60 text-sm text-center mb-8">
          Panel exclusivo para administración
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label htmlFor="pin" className="sr-only">Código de Acceso</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-beige/40">
                <Lock size={18} />
              </div>
              <input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value)
                  setError(null)
                }}
                placeholder="Ingresa el código PIN"
                className={[
                  'w-full pl-10 pr-4 py-3 rounded-btn bg-dark-bg border text-white transition-colors focus:outline-none focus:ring-1 text-center tracking-widest font-mono text-lg',
                  error
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-dark-border focus:border-primary focus:ring-primary',
                ].join(' ')}
                maxLength={6}
                autoComplete="off"
                autoFocus
                disabled={loading}
              />
            </div>
            {error && (
              <p className="text-red-400 text-xs mt-2 text-center">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={pin.length < 4 || loading}
            className="w-full py-3 bg-primary hover:bg-secondary disabled:opacity-50 disabled:hover:bg-primary text-white font-semibold rounded-btn transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-card mt-2 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Verificando...' : 'Ingresar al Panel'}
          </button>
        </form>
      </div>
    </div>
  )
}

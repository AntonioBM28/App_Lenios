import axios, { AxiosError } from 'axios'
import { env } from '@/core/config/env'
import { getAdminToken, clearAdminToken } from '@/core/auth/adminSession'
import type { ApiError } from '@/shared/types'

/**
 * Pre-configured Axios instance.
 * Base URL is read from VITE_API_URL environment variable.
 */
export const httpClient = axios.create({
  baseURL: env.apiUrl ?? 'http://localhost:3000',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Preparación (sin activar) para una futura migración a cookies httpOnly:
  // hoy env.useCookieAuth siempre es false (no hay VITE_USE_COOKIE_AUTH=true
  // en ningún .env), así que esto no cambia el comportamiento actual — el
  // backend tampoco emite cookies todavía. Ver TODO abajo.
  withCredentials: env.useCookieAuth,
})

// ── Request interceptor: adjunta el token de admin si existe ──────────────
// Los endpoints públicos ignoran este header; los protegidos (AdminGuard)
// lo requieren. No hay distinción de rutas aquí — es más simple adjuntarlo
// siempre que exista sesión y dejar que el backend decida si lo necesita.
//
// TODO(migración a cookies httpOnly, coordinar con backend):
// cuando /auth/admin/login emita el token como cookie httpOnly
// (`Set-Cookie: ...; HttpOnly; Secure; SameSite=Strict`) en vez de en el
// body de la respuesta, aquí hay que:
//   1. Fijar withCredentials: true arriba (o activar VITE_USE_COOKIE_AUTH).
//   2. Eliminar este interceptor de request por completo — el navegador
//      mandará la cookie solo en cada request, ya no hace falta adjuntar
//      el header Authorization a mano.
//   3. adminSession.ts deja de tener sentido para guardar el token (una
//      cookie httpOnly no se puede leer desde JS); como mucho quedaría
//      para cachear un flag "hay sesión" si el backend expone /auth/me.
httpClient.interceptors.request.use(
  (config) => {
    const token = getAdminToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Convierte un AxiosError en un Error "plano" cuyo `.message` ya es el
 * mensaje legible del backend (formato AllExceptionsFilter: string | string[]).
 * Así los hooks existentes (`err instanceof Error ? err.message : ...`)
 * siguen funcionando sin cambios, sea cual sea el origen del error.
 */
function normalizeError(error: AxiosError<ApiError>): Error {
  const data = error.response?.data
  if (data?.message) {
    const message = Array.isArray(data.message) ? data.message.join(' — ') : data.message
    return new Error(message)
  }
  if (error.request && !error.response) {
    return new Error('No se pudo conectar con el servidor. Verifica tu conexión.')
  }
  return new Error(error.message || 'Ocurrió un error inesperado')
}

// ── Response interceptor: 401 global + normalización de errores ───────────
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status
    const isLoginRequest = error.config?.url?.includes('/auth/admin/login')

    // Un 401 en el login es "PIN incorrecto" (lo maneja AdminAccessGate).
    // Un 401 en cualquier otra ruta admin significa token ausente/expirado:
    // limpiamos la sesión y devolvemos al gate de acceso.
    if (status === 401 && !isLoginRequest) {
      clearAdminToken()
      if (window.location.pathname.startsWith('/admin')) {
        window.location.assign('/admin')
      }
    }

    return Promise.reject(normalizeError(error))
  }
)

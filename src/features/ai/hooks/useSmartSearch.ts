import { useState } from 'react'
import { aiService } from '../services/aiService'
import type { SmartSearchMatch } from '../types'

export type SmartSearchStatus = 'idle' | 'loading' | 'success' | 'error'

interface UseSmartSearchReturn {
  /** null = no hay búsqueda activa (se muestra el menú normal) */
  matches: SmartSearchMatch[] | null
  status: SmartSearchStatus
  error: string | null
  search: (query: string) => Promise<void>
  clear: () => void
}

/**
 * Hook del buscador inteligente del menú (POST /ai/smart-search).
 * `matches === null` es la señal de "sin búsqueda activa" — MenuPage la
 * usa para decidir si mostrar el catálogo filtrado por categoría o los
 * resultados de la IA.
 */
export function useSmartSearch(): UseSmartSearchReturn {
  const [matches, setMatches] = useState<SmartSearchMatch[] | null>(null)
  const [status, setStatus] = useState<SmartSearchStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const search = async (query: string) => {
    const trimmed = query.trim()
    if (trimmed.length < 3) {
      setError('Describe un poco más lo que se te antoja (mínimo 3 caracteres)')
      setStatus('error')
      return
    }

    setStatus('loading')
    setError(null)

    try {
      const result = await aiService.smartSearch(trimmed)
      setMatches(result)
      setStatus('success')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo procesar tu búsqueda'
      setError(message)
      setStatus('error')
      setMatches(null)
    }
  }

  const clear = () => {
    setMatches(null)
    setStatus('idle')
    setError(null)
  }

  return { matches, status, error, search, clear }
}

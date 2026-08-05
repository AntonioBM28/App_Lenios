import { useState, useEffect } from 'react'
import { aiService } from '../services/aiService'
import type { ChefSuggestion } from '../types'

interface UseChefSuggestionReturn {
  suggestion: ChefSuggestion | null
  loading: boolean
}

/**
 * Carga la Sugerencia del Chef al montar (GET /ai/chef-suggestion, cacheada
 * por día del lado del backend). Es decorativa: si falla, no se propaga
 * ningún error — la tarjeta simplemente no se renderiza y el resto del
 * Home sigue funcionando normal.
 */
export function useChefSuggestion(): UseChefSuggestionReturn {
  const [suggestion, setSuggestion] = useState<ChefSuggestion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    aiService
      .getChefSuggestion()
      .then((result) => {
        if (!cancelled) setSuggestion(result)
      })
      .catch(() => {
        // Silencioso a propósito: feature decorativa, no un flujo crítico.
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { suggestion, loading }
}

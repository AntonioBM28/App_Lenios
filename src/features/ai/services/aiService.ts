import { httpClient } from '@/core/api/httpClient'
import { ENDPOINTS } from '@/core/api/endpoints'
import type { SmartSearchMatch, ChefSuggestion } from '../types'

/**
 * Servicio del módulo de IA (backend `ai` module, Groq). Sin factory
 * mock/http como en menuService — estos endpoints solo tienen sentido
 * contra el backend real (llaman a Groq), así que no hay un modo mock.
 */
export const aiService = {
  async smartSearch(query: string): Promise<SmartSearchMatch[]> {
    const { data } = await httpClient.post<SmartSearchMatch[]>(ENDPOINTS.AI_SMART_SEARCH, {
      query,
    })
    return data
  },

  async getChefSuggestion(): Promise<ChefSuggestion> {
    const { data } = await httpClient.get<ChefSuggestion>(ENDPOINTS.AI_CHEF_SUGGESTION)
    return data
  },
}

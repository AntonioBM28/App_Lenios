import type { MenuService } from '../types'
import { MockMenuService } from './mockMenuService'
import { HttpMenuService } from './httpMenuService'

/**
 * Factory de servicio — decide qué implementación usar.
 *
 * VITE_USE_MOCK_DATA=true  -> datos locales en memoria (útil sin backend).
 * VITE_USE_MOCK_DATA=false -> API real de NestJS (GET /products, /categories).
 *
 * La interfaz MenuService actúa como contrato — los consumers nunca saben
 * si están hablando con mock data o una API real.
 */
function createMenuService(): MenuService {
  const useMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false'

  if (useMock) {
    return new MockMenuService()
  }

  return new HttpMenuService()
}

/** Instancia singleton usada por todos los hooks y componentes */
export const menuService: MenuService = createMenuService()

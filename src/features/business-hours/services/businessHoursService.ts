import { env } from '@/core/config/env'
import type { BusinessHoursService } from '../types'
import { MockBusinessHoursService } from './mockBusinessHoursService'
import { HttpBusinessHoursService } from './httpBusinessHoursService'

/**
 * Factory para obtener el servicio de horarios.
 * Permite inyectar la implementación correcta dependiendo
 * de si usamos datos mock o la API real.
 */
let serviceInstance: BusinessHoursService | null = null

export function getBusinessHoursService(): BusinessHoursService {
  if (!serviceInstance) {
    serviceInstance = env.useMockData
      ? new MockBusinessHoursService()
      : new HttpBusinessHoursService()
  }

  return serviceInstance
}

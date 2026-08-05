import { httpClient } from '@/core/api/httpClient'
import type { ConfiguracionHorario, BusinessHoursService, EstadoNegocio } from '../types'

/**
 * Implementación real de BusinessHoursService contra la API de NestJS.
 * getConfiguracion/updateConfiguracion son públicos para lectura; la
 * actualización requiere sesión de admin (el token viaja automático
 * vía el interceptor de httpClient).
 */
export class HttpBusinessHoursService implements BusinessHoursService {
  async getConfiguracion(): Promise<ConfiguracionHorario> {
    const { data } = await httpClient.get<ConfiguracionHorario>('/business-hours')
    return data
  }

  async updateConfiguracion(nuevaConfig: ConfiguracionHorario): Promise<ConfiguracionHorario> {
    const { data } = await httpClient.put<ConfiguracionHorario>('/business-hours', nuevaConfig)

    // Mismo evento que usaba el mock, para que useBusinessStatus y el
    // Dashboard se refresquen sin tener que tocarlos.
    window.dispatchEvent(new Event('business-hours-changed'))

    return data
  }

  async getStatus(): Promise<EstadoNegocio> {
    const { data } = await httpClient.get<EstadoNegocio>('/business-hours/status')
    return data
  }
}

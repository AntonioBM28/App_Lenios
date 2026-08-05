import type { ConfiguracionHorario, BusinessHoursService, EstadoNegocio } from '../types'
import { isBusinessOpen } from '../utils/businessHoursUtils'

// Mock de horario semanal
// Lunes (1): Cerrado
// Martes-Domingo: 13:00 - 21:00
const MOCK_CONFIG: ConfiguracionHorario = {
  cierreManual: false,
  horarios: [
    { dia: 0, abre: '13:00', cierra: '21:00', cerrado: false },
    { dia: 1, abre: '08:00', cierra: '18:00', cerrado: true }, // Lunes cerrado
    { dia: 2, abre: '13:00', cierra: '21:00', cerrado: false },
    { dia: 3, abre: '13:00', cierra: '21:00', cerrado: false },
    { dia: 4, abre: '13:00', cierra: '21:00', cerrado: false },
    { dia: 5, abre: '13:00', cierra: '22:00', cerrado: false }, // Viernes cierran más tarde
    { dia: 6, abre: '13:00', cierra: '22:00', cerrado: false }, // Sábado cierran más tarde
  ],
}

export class MockBusinessHoursService implements BusinessHoursService {
  async getConfiguracion(): Promise<ConfiguracionHorario> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    
    const saved = localStorage.getItem('business_hours_override')
    if (saved) {
      try {
        return JSON.parse(saved) as ConfiguracionHorario
      } catch (e) {
        console.error('Error parseando configuración de horarios', e)
      }
    }
    
    // Si no existe, guardar el mock por defecto y retornarlo
    localStorage.setItem('business_hours_override', JSON.stringify(MOCK_CONFIG))
    return MOCK_CONFIG
  }

  // TODO(RF12-backend): PUT/PATCH /business-hours
  async updateConfiguracion(nuevaConfig: ConfiguracionHorario): Promise<ConfiguracionHorario> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    localStorage.setItem('business_hours_override', JSON.stringify(nuevaConfig))
    
    // Notificar a otras ventanas o componentes en la misma ventana
    window.dispatchEvent(new Event('business-hours-changed'))

    return nuevaConfig
  }

  async getStatus(): Promise<EstadoNegocio> {
    const config = await this.getConfiguracion()
    return isBusinessOpen(config)
  }
}

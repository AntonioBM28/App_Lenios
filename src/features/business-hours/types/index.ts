export interface HorarioDia {
  dia: 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = Domingo ... 6 = Sábado
  abre: string // Formato "HH:mm" (ej. "13:00")
  cierra: string // Formato "HH:mm" (ej. "21:00")
  cerrado?: boolean // true si el negocio no abre ese día
}

export interface ConfiguracionHorario {
  horarios: HorarioDia[]
  cierreManual?: boolean // override manual para cerrar el negocio inesperadamente
}

/** Resultado de evaluar si el negocio está abierto ahora mismo (RF6) */
export interface EstadoNegocio {
  abierto: boolean
  horarioHoy?: HorarioDia
}

export interface BusinessHoursService {
  /**
   * Obtiene la configuración actual del negocio
   */
  getConfiguracion(): Promise<ConfiguracionHorario>

  /**
   * Actualiza la configuración de apertura y cierre (RF12)
   */
  updateConfiguracion(nuevaConfig: ConfiguracionHorario): Promise<ConfiguracionHorario>

  /**
   * Estado calculado (abierto/cerrado ahora mismo). En la implementación
   * HTTP lo calcula el backend (GET /business-hours/status); en el mock
   * se calcula localmente con la misma lógica que useBusinessStatus.
   */
  getStatus(): Promise<EstadoNegocio>
}

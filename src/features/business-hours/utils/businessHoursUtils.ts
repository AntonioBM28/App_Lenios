import type { ConfiguracionHorario, HorarioDia } from '../types'

/**
 * Función pura y testeable para calcular si el negocio está abierto en este instante.
 * @param config La configuración de horarios.
 * @param now Objeto Date opcional, por defecto es la hora actual.
 */
export function isBusinessOpen(
  config: ConfiguracionHorario,
  now: Date = new Date()
): { abierto: boolean; horarioHoy?: HorarioDia } {
  if (config.cierreManual) {
    return { abierto: false }
  }

  // 0 = Domingo, 1 = Lunes, etc.
  const diaActual = now.getDay() as HorarioDia['dia']
  const horarioHoy = config.horarios.find((h) => h.dia === diaActual)

  if (!horarioHoy || horarioHoy.cerrado) {
    return { abierto: false, horarioHoy }
  }

  // Obtener HH:mm actuales
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const horaActualStr = `${hh}:${mm}`

  const abre = horarioHoy.abre
  const cierra = horarioHoy.cierra

  // Comparamos lexicográficamente (funciona bien con formato HH:mm 24hrs)
  const abierto = horaActualStr >= abre && horaActualStr < cierra

  return { abierto, horarioHoy }
}

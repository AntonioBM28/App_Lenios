import { useState, useEffect } from 'react'
import type { ConfiguracionHorario, HorarioDia } from '../types'
import { getBusinessHoursService } from '../services/businessHoursService'
import { isBusinessOpen } from '../utils/businessHoursUtils'

interface BusinessStatus {
  abierto: boolean
  horarioHoy?: HorarioDia
  config?: ConfiguracionHorario
  cargando: boolean
  error: string | null
}

export function useBusinessStatus() {
  const [status, setStatus] = useState<BusinessStatus>({
    abierto: false,
    cargando: true,
    error: null,
  })

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>
    let isMounted = true

    const fetchConfig = async () => {
      try {
        const service = getBusinessHoursService()
        const config = await service.getConfiguracion()
        
        if (!isMounted) return

        const evaluarHorario = () => {
          const resultado = isBusinessOpen(config)
          setStatus({
            abierto: resultado.abierto,
            horarioHoy: resultado.horarioHoy,
            config,
            cargando: false,
            error: null,
          })
        }

        // Evaluación inicial
        evaluarHorario()

        // Re-evaluar cada 60 segundos
        if (intervalId) clearInterval(intervalId)
        intervalId = setInterval(evaluarHorario, 60000)

      } catch (err) {
        if (!isMounted) return
        setStatus((prev) => ({
          ...prev,
          cargando: false,
          error: 'No se pudo cargar el horario',
        }))
      }
    }

    fetchConfig()

    window.addEventListener('business-hours-changed', fetchConfig)
    window.addEventListener('storage', fetchConfig)

    return () => {
      isMounted = false
      if (intervalId) clearInterval(intervalId)
      window.removeEventListener('business-hours-changed', fetchConfig)
      window.removeEventListener('storage', fetchConfig)
    }
  }, [])

  return status
}

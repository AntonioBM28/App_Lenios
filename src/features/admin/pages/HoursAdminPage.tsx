import { useState, useEffect } from 'react'
import { getBusinessHoursService } from '@/features/business-hours/services/businessHoursService'
import { isBusinessOpen } from '@/features/business-hours/utils/businessHoursUtils'
import type { ConfiguracionHorario, HorarioDia } from '@/features/business-hours/types'
import { WeeklyHoursEditor } from '../components/WeeklyHoursEditor'
import { ManualOverrideToggle } from '../components/ManualOverrideToggle'
import { BusinessStatusBadge } from '@/features/business-hours/components/BusinessStatusBadge'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'

export default function HoursAdminPage() {
  const [draftConfig, setDraftConfig] = useState<ConfiguracionHorario | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewStatus, setPreviewStatus] = useState<boolean>(false)

  const service = getBusinessHoursService()

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true)
        const config = await service.getConfiguracion()
        // Hacemos una copia profunda (deep clone) simple
        setDraftConfig(JSON.parse(JSON.stringify(config)))
      } catch (error) {
        console.error(error)
        toast.error('Error al cargar la configuración')
      } finally {
        setLoading(false)
      }
    }
    loadConfig()
  }, [])

  // Actualizar vista previa en vivo cuando el borrador cambia
  useEffect(() => {
    if (draftConfig) {
      setPreviewStatus(isBusinessOpen(draftConfig).abierto)
    }
  }, [draftConfig])

  const handleCierreManualChange = (valor: boolean) => {
    if (draftConfig) {
      setDraftConfig({ ...draftConfig, cierreManual: valor })
    }
  }

  const handleHorariosChange = (nuevosHorarios: HorarioDia[]) => {
    if (draftConfig) {
      setDraftConfig({ ...draftConfig, horarios: nuevosHorarios })
    }
  }

  const handleSave = async () => {
    if (!draftConfig) return
    try {
      setSaving(true)
      await service.updateConfiguracion(draftConfig)
      toast.success('Horario guardado correctamente', {
        icon: '✅',
        style: {
          background: '#0a0a0a',
          color: '#fff',
          border: '1px solid #333'
        }
      })
    } catch (error) {
      console.error(error)
      toast.error('Error al guardar horario')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !draftConfig) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="w-8 h-8 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 pb-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white mb-1">Disponibilidad</h1>
          <p className="text-beige/60 text-sm">Controla cuándo el sistema permite hacer compras.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-dark-bg/50 px-4 py-2 rounded-full border border-dark-border/50">
          <span className="text-sm text-beige/60 uppercase font-medium tracking-wide">Vista Previa:</span>
          <BusinessStatusBadge overrideStatus={previewStatus} />
        </div>
      </div>

      <div className="max-w-4xl flex flex-col gap-8">
        {/* Toggle de Emergencia */}
        <ManualOverrideToggle 
          cierreManual={!!draftConfig.cierreManual} 
          onChange={handleCierreManualChange} 
        />

        {/* Editor Semanal */}
        <WeeklyHoursEditor 
          horarios={draftConfig.horarios} 
          onChange={handleHorariosChange} 
        />
      </div>

      {/* Barra pegajosa de Guardar (Sticky action bar) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-dark-bg/80 backdrop-blur-md border-t border-dark-border flex justify-end md:pl-64 z-50">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-btn transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-primary"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={20} />
          )}
          Guardar Configuración
        </button>
      </div>
    </div>
  )
}

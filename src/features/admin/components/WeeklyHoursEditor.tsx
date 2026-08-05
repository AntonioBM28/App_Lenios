import type { HorarioDia } from '@/features/business-hours/types'

interface WeeklyHoursEditorProps {
  horarios: HorarioDia[]
  onChange: (nuevosHorarios: HorarioDia[]) => void
}

const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export function WeeklyHoursEditor({ horarios, onChange }: WeeklyHoursEditorProps) {
  
  const handleDiaChange = (diaIndex: number, campo: keyof HorarioDia, valor: string | boolean) => {
    const nuevaLista = [...horarios]
    const index = nuevaLista.findIndex(h => h.dia === diaIndex)
    
    if (index >= 0) {
      nuevaLista[index] = { ...nuevaLista[index], [campo]: valor }
      onChange(nuevaLista)
    }
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl shadow-xl overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-dark-border">
        <h2 className="text-lg font-heading font-bold text-white mb-1">Horario Semanal</h2>
        <p className="text-sm text-beige/60">Configura las horas regulares de atención del negocio.</p>
      </div>
      
      <div className="divide-y divide-dark-border/50">
        {/* Aseguramos que se pinten en orden de Lunes a Domingo por usabilidad, aunque el modelo use 0=Domingo */}
        {[1, 2, 3, 4, 5, 6, 0].map(diaIndex => {
          const configDia = horarios.find(h => h.dia === diaIndex)
          if (!configDia) return null

          const { abre, cierra, cerrado } = configDia

          return (
            <div key={diaIndex} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-dark-border/20 transition-colors">
              <div className="flex items-center gap-4 w-40">
                <label className="flex items-center cursor-pointer relative">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={!cerrado}
                    onChange={(e) => handleDiaChange(diaIndex, 'cerrado', !e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-dark-bg peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-dark-border"></div>
                </label>
                <span className={`font-medium ${cerrado ? 'text-beige/40 line-through' : 'text-white'}`}>
                  {DIAS_SEMANA[diaIndex]}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 ml-15 sm:ml-0">
                <div className="flex flex-col">
                  <span className="text-[10px] text-beige/50 uppercase font-semibold mb-1">Apertura</span>
                  <input
                    type="time"
                    value={abre}
                    disabled={cerrado}
                    onChange={(e) => handleDiaChange(diaIndex, 'abre', e.target.value)}
                    className="bg-dark-bg border border-dark-border text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                
                <span className="text-beige/40 mt-5">-</span>

                <div className="flex flex-col">
                  <span className="text-[10px] text-beige/50 uppercase font-semibold mb-1">Cierre</span>
                  <input
                    type="time"
                    value={cierra}
                    disabled={cerrado}
                    onChange={(e) => handleDiaChange(diaIndex, 'cierra', e.target.value)}
                    className="bg-dark-bg border border-dark-border text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
